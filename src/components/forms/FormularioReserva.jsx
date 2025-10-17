import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { XMarkIcon, CalendarDaysIcon, UserPlusIcon, KeyIcon, ClockIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const FormularioReserva = ({ isOpen, onClose, onReservaCreada, mesasDisponibles = [] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [credencialesGeneradas, setCredencialesGeneradas] = useState(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      fecha: '',
      hora: '',
      duracion: '2',
      personas: 2,
      mesa_id: '',
      cliente_nombre: '',
      cliente_telefono: '',
      cliente_email: '',
      observaciones: ''
    }
  })

  const fechaSeleccionada = watch('fecha')
  const personas = watch('personas')

  // Generar horarios disponibles (cada 30 minutos de 12:00 a 22:00)
  const horariosDisponibles = []
  for (let hora = 12; hora <= 22; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const horaStr = hora.toString().padStart(2, '0')
      const minutoStr = minuto.toString().padStart(2, '0')
      horariosDisponibles.push(`${horaStr}:${minutoStr}`)
    }
  }

  // Filtrar mesas disponibles según capacidad
  const mesasAdecuadas = mesasDisponibles.filter(mesa => 
    mesa.capacidad >= personas && mesa.estado === 'libre'
  )

  // Debug: mostrar información de mesas
  console.log('🔍 Debug FormularioReserva:')
  console.log('- mesasDisponibles:', mesasDisponibles)
  console.log('- personas:', personas)
  console.log('- mesasAdecuadas:', mesasAdecuadas)

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Validaciones adicionales
      const fechaReserva = new Date(data.fecha)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      
      if (fechaReserva < hoy) {
        toast.error('No se pueden hacer reservas para fechas pasadas')
        setIsLoading(false)
        return
      }

      if (fechaReserva > new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        toast.error('No se pueden hacer reservas con más de 7 días de anticipación')
        setIsLoading(false)
        return
      }

      // Generar credenciales temporales únicas
      const timestamp = Date.now()
      const usuarioTemporal = `cliente_${timestamp}@temporal.lachinga.com`
      const passwordTemporal = Math.random().toString(36).slice(-8)
      
      // Calcular fecha de expiración (24 horas después de la fecha de reserva)
      const fechaExpiracion = new Date(fechaReserva)
      fechaExpiracion.setDate(fechaExpiracion.getDate() + 1)
      
      const reservaData = {
        fecha: data.fecha,
        hora: data.hora,
        duracion: parseInt(data.duracion),
        personas: parseInt(data.personas),
        mesa_id: data.mesa_id ? parseInt(data.mesa_id) : null,
        cliente_nombre: data.cliente_nombre,
        cliente_telefono: data.cliente_telefono,
        cliente_email: data.cliente_email || null,
        observaciones: data.observaciones || null,
        usuario_temporal: usuarioTemporal,
        password_temporal: passwordTemporal,
        fecha_expiracion: fechaExpiracion.toISOString(),
        estado: 'confirmada',
        fecha_creacion: new Date().toISOString()
      }

      // Guardar en Supabase
      const { data: reservaInsertada, error } = await supabase
        .from('reservas')
        .insert([reservaData])
        .select()
        .single()

      if (error) {
        console.error('Error al crear reserva:', error)
        toast.error('Error al crear la reserva en la base de datos')
        return
      }

      // Crear usuario temporal en la tabla usuarios
      const usuarioTemporalData = {
        email: usuarioTemporal,
        password_hash: `temp_hash_${passwordTemporal}_${timestamp}`,
        nombre: data.cliente_nombre,
        apellido: 'Temporal',
        rol: 'cliente',
        telefono: data.cliente_telefono,
        activo: true,
        es_temporal: true,
        fecha_expiracion: fechaExpiracion.toISOString(),
        reserva_id: reservaInsertada.id
      }

      const { error: errorUsuario } = await supabase
        .from('usuarios')
        .insert([usuarioTemporalData])

      if (errorUsuario) {
        console.error('Error al crear usuario temporal:', errorUsuario)
        toast.error('Error al crear credenciales temporales')
        return
      }

      // Mostrar credenciales generadas
      setCredencialesGeneradas({
        usuario: usuarioTemporal,
        password: passwordTemporal,
        fechaExpiracion: fechaExpiracion.toLocaleDateString('es-ES'),
        reservaId: reservaInsertada.id
      })
      
      toast.success('Reserva creada exitosamente con credenciales temporales')
      onReservaCreada?.(reservaInsertada)
      
    } catch (error) {
      toast.error('Error al crear la reserva')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copiarCredenciales = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Credenciales copiadas al portapapeles')
    }).catch(() => {
      toast.error('Error al copiar las credenciales')
    })
  }

  const cerrarFormulario = () => {
    setCredencialesGeneradas(null)
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="h-6 w-6 text-mexico-verde-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Crear Nueva Reserva</h2>
              <p className="text-sm text-neutral-600">Generar reserva con credenciales temporales</p>
            </div>
          </div>
          <button
            onClick={cerrarFormulario}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-neutral-600" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información de la Reserva */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Información de la Reserva</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fecha de la Reserva *
                </label>
                <input
                  type="date"
                  {...register('fecha', {
                    required: 'La fecha es requerida'
                  })}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="input-field"
                />
                {errors.fecha && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Hora *
                </label>
                <select
                  {...register('hora', {
                    required: 'La hora es requerida'
                  })}
                  className="input-field"
                >
                  <option value="">Selecciona una hora</option>
                  {horariosDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
                {errors.hora && (
                  <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Número de Personas *
                </label>
                <input
                  type="number"
                  {...register('personas', {
                    required: 'El número de personas es requerido',
                    min: { value: 1, message: 'Mínimo 1 persona' },
                    max: { value: 12, message: 'Máximo 12 personas' }
                  })}
                  min="1"
                  max="12"
                  className="input-field"
                />
                {errors.personas && (
                  <p className="mt-1 text-sm text-red-600">{errors.personas.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Duración Estimada (horas)
                </label>
                <select
                  {...register('duracion')}
                  className="input-field"
                >
                  <option value="1">1 hora</option>
                  <option value="1.5">1.5 horas</option>
                  <option value="2">2 horas</option>
                  <option value="2.5">2.5 horas</option>
                  <option value="3">3 horas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mesa Preferida
              </label>
              <select
                {...register('mesa_id')}
                className="input-field"
              >
                <option value="">Sin preferencia</option>
                {mesasAdecuadas.map(mesa => (
                  <option key={mesa.id} value={mesa.id}>
                    Mesa {mesa.numero} - {mesa.capacidad} personas ({mesa.ubicacion})
                  </option>
                ))}
              </select>
              {mesasAdecuadas.length === 0 && personas > 0 && (
                <div className="mt-1 text-sm text-yellow-600">
                  <p>No hay mesas disponibles para {personas} personas</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mesas totales: {mesasDisponibles.length} | 
                    Mesas libres: {mesasDisponibles.filter(m => m.estado === 'libre').length} | 
                    Con capacidad suficiente: {mesasDisponibles.filter(m => m.capacidad >= personas).length}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Información del Cliente</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register('cliente_nombre', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
                className="input-field"
                placeholder="Ej: Juan Pérez"
              />
              {errors.cliente_nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente_nombre.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('cliente_telefono', {
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                      message: 'Ingresa un teléfono válido'
                    }
                  })}
                  className="input-field"
                  placeholder="Ej: +52 55 1234 5678"
                />
                {errors.cliente_telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente_telefono.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('cliente_email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingresa un email válido'
                    }
                  })}
                  className="input-field"
                  placeholder="Ej: cliente@ejemplo.com"
                />
                {errors.cliente_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente_email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Observaciones
              </label>
              <textarea
                {...register('observaciones')}
                rows={3}
                className="input-field resize-none"
                placeholder="Alergias, preferencias especiales, celebraciones, etc."
              />
            </div>
          </div>

          {/* Información de Credenciales */}
          <div className="p-4 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200">
            <div className="flex items-center space-x-2 mb-2">
              <UserPlusIcon className="h-5 w-5 text-mexico-verde-600" />
              <h4 className="text-sm font-medium text-mexico-verde-800">
                Credenciales Temporales
              </h4>
            </div>
            <p className="text-sm text-mexico-verde-700">
              Se generarán automáticamente credenciales temporales que funcionarán solo el día de la reserva.
              El cliente podrá acceder al sistema para ver la carta, hacer pedidos y generar su factura.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={cerrarFormulario}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando Reserva...
                </div>
              ) : (
                'Crear Reserva'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Modal de Credenciales Generadas */}
      {credencialesGeneradas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-mexico-verde-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyIcon className="h-8 w-8 text-mexico-verde-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  ¡Reserva Creada Exitosamente!
                </h3>
                <p className="text-neutral-600">
                  Se han generado credenciales temporales para el cliente
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200">
                  <h4 className="text-sm font-medium text-mexico-verde-800 mb-3">
                    Credenciales de Acceso Temporal
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-mexico-verde-700 mb-1">
                        Usuario
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded text-sm font-mono text-neutral-800 border">
                          {credencialesGeneradas.usuario}
                        </code>
                        <button
                          onClick={() => copiarCredenciales(credencialesGeneradas.usuario)}
                          className="px-3 py-2 bg-mexico-verde-600 text-white rounded text-sm hover:bg-mexico-verde-700 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-mexico-verde-700 mb-1">
                        Contraseña
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded text-sm font-mono text-neutral-800 border">
                          {credencialesGeneradas.password}
                        </code>
                        <button
                          onClick={() => copiarCredenciales(credencialesGeneradas.password)}
                          className="px-3 py-2 bg-mexico-verde-600 text-white rounded text-sm hover:bg-mexico-verde-700 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      <strong>Válidas hasta:</strong> {credencialesGeneradas.fechaExpiracion}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>ID de Reserva:</strong> #{credencialesGeneradas.reservaId}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => copiarCredenciales(`Usuario: ${credencialesGeneradas.usuario}\nContraseña: ${credencialesGeneradas.password}\nVálidas hasta: ${credencialesGeneradas.fechaExpiracion}`)}
                  className="flex-1 bg-mexico-verde-600 text-white px-4 py-2 rounded-lg hover:bg-mexico-verde-700 transition-colors"
                >
                  Copiar Todo
                </button>
                <button
                  onClick={cerrarFormulario}
                  className="flex-1 bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FormularioReserva
