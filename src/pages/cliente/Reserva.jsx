import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { reservasMock, mesasMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

const ReservaCliente = () => {
  const { usuario } = useAuthStore()
  const queryClient = useQueryClient()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      fecha: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      hora: '19:00',
      cantidadPersonas: 2,
      observaciones: ''
    }
  })

  const fechaSeleccionada = watch('fecha')
  const cantidadPersonas = watch('cantidadPersonas')

  // Obtener reservas del cliente
  const { data: reservasCliente, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reservas-cliente', usuario?.id],
    queryFn: () => reservasMock.filter(r => r.clienteId === usuario?.id),
    staleTime: 5 * 60 * 1000
  })

  // Obtener mesas disponibles
  const { data: mesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  // Mutación para crear reserva
  const crearReservaMutation = useMutation({
    mutationFn: async (datosReserva) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, reservaId: Date.now() }
    },
    onSuccess: () => {
      toast.success('¡Reserva creada exitosamente!')
      setMostrarFormulario(false)
      reset()
      queryClient.invalidateQueries(['reservas-cliente'])
    },
    onError: () => {
      toast.error('Error al crear la reserva')
    }
  })

  // Mutación para cancelar reserva
  const cancelarReservaMutation = useMutation({
    mutationFn: async (reservaId) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Reserva cancelada exitosamente')
      queryClient.invalidateQueries(['reservas-cliente'])
    },
    onError: () => {
      toast.error('Error al cancelar la reserva')
    }
  })

  const onSubmit = async (data) => {
    const fechaReserva = new Date(data.fecha)
    const hoy = startOfDay(new Date())
    const fechaMaxima = addDays(hoy, 7)

    // Validaciones
    if (isBefore(fechaReserva, hoy)) {
      toast.error('No puedes reservar para fechas pasadas')
      return
    }

    if (isAfter(fechaReserva, fechaMaxima)) {
      toast.error('Solo puedes reservar hasta 7 días en adelante')
      return
    }

    const reserva = {
      clienteId: usuario.id,
      clienteNombre: usuario.nombre,
      clienteEmail: usuario.email,
      clienteTelefono: '+57 300 123 4567', // Mock
      fecha: data.fecha,
      hora: data.hora,
      cantidadPersonas: parseInt(data.cantidadPersonas),
      observaciones: data.observaciones,
      estado: 'pendiente'
    }

    await crearReservaMutation.mutateAsync(reserva)
  }

  const cancelarReserva = async (reservaId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      await cancelarReservaMutation.mutateAsync(reservaId)
    }
  }

  const obtenerEstadoReserva = (reserva) => {
    const fechaReserva = new Date(reserva.fecha)
    const hoy = new Date()
    
    if (reserva.estado === 'cancelada') {
      return { texto: 'Cancelada', color: 'text-red-600', icono: XCircleIcon }
    }
    
    if (isBefore(fechaReserva, hoy)) {
      return { texto: 'Completada', color: 'text-green-600', icono: CheckCircleIcon }
    }
    
    if (reserva.estado === 'confirmada') {
      return { texto: 'Confirmada', color: 'text-green-600', icono: CheckCircleIcon }
    }
    
    return { texto: 'Pendiente', color: 'text-yellow-600', icono: ExclamationTriangleIcon }
  }

  const puedeCancelar = (reserva) => {
    const fechaReserva = new Date(reserva.fecha)
    const hoy = new Date()
    const unDiaAntes = addDays(fechaReserva, -1)
    
    return reserva.estado !== 'cancelada' && 
           reserva.estado !== 'completada' && 
           isAfter(hoy, unDiaAntes)
  }

  const obtenerMesaDisponible = (cantidadPersonas) => {
    return mesas?.find(mesa => 
      mesa.estado === 'libre' && mesa.capacidad >= cantidadPersonas
    )
  }

  const mesaDisponible = obtenerMesaDisponible(cantidadPersonas)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Mis Reservas
        </h1>
        <p className="text-neutral-600">
          Gestiona tus reservas en La Chinga
        </p>
      </motion.div>

      {/* Botón nueva reserva */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn-primary"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Reserva'}
        </motion.button>
      </motion.div>

      {/* Formulario de nueva reserva */}
      {mostrarFormulario && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">
            Crear Nueva Reserva
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  {...register('fecha', {
                    required: 'La fecha es requerida',
                    validate: (value) => {
                      const fecha = new Date(value)
                      const hoy = startOfDay(new Date())
                      const fechaMaxima = addDays(hoy, 7)
                      
                      if (isBefore(fecha, hoy)) {
                        return 'No puedes reservar para fechas pasadas'
                      }
                      if (isAfter(fecha, fechaMaxima)) {
                        return 'Solo puedes reservar hasta 7 días en adelante'
                      }
                      return true
                    }
                  })}
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
                  className="input-field"
                />
                {errors.fecha && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
                )}
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Hora
                </label>
                <select
                  {...register('hora', { required: 'La hora es requerida' })}
                  className="input-field"
                >
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="21:30">9:30 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
                {errors.hora && (
                  <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>
                )}
              </div>
            </div>

            {/* Cantidad de personas */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Cantidad de personas
              </label>
              <select
                {...register('cantidadPersonas', { 
                  required: 'La cantidad de personas es requerida',
                  min: { value: 1, message: 'Mínimo 1 persona' },
                  max: { value: 8, message: 'Máximo 8 personas' }
                })}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
              {errors.cantidadPersonas && (
                <p className="mt-1 text-sm text-red-600">{errors.cantidadPersonas.message}</p>
              )}
            </div>

            {/* Mesa disponible */}
            {mesaDisponible && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Mesa {mesaDisponible.numero} disponible
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Capacidad: {mesaDisponible.capacidad} personas • {mesaDisponible.ubicacion}
                </p>
              </div>
            )}

            {!mesaDisponible && cantidadPersonas && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    No hay mesas disponibles
                  </span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  Intenta con una cantidad menor de personas o selecciona otra fecha/hora
                </p>
              </div>
            )}

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Observaciones especiales
              </label>
              <textarea
                {...register('observaciones')}
                placeholder="Ej: Mesa cerca de la ventana, cumpleaños, alergias..."
                className="w-full h-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarFormulario(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!mesaDisponible || crearReservaMutation.isPending}
                className={`btn-primary flex-1 ${
                  !mesaDisponible ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {crearReservaMutation.isPending ? 'Creando...' : 'Crear Reserva'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de reservas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-neutral-800">
          Mis Reservas
        </h2>

        {isLoadingReservas ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-skeleton h-24 w-full"></div>
            ))}
          </div>
        ) : reservasCliente?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <CalendarIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No tienes reservas</p>
            <p className="text-neutral-400 text-sm mt-2">
              Crea tu primera reserva para disfrutar de La Chinga
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservasCliente?.map((reserva, index) => {
              const estado = obtenerEstadoReserva(reserva)
              const EstadoIcono = estado.icono
              
              return (
                <motion.div
                  key={reserva.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-neutral-600" />
                          <span className="font-semibold text-neutral-800">
                            {format(new Date(reserva.fecha), 'dd/MM/yyyy', { locale: es })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-5 w-5 text-neutral-600" />
                          <span className="text-neutral-600">{reserva.hora}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="h-5 w-5 text-neutral-600" />
                          <span className="text-neutral-600">
                            {reserva.cantidadPersonas} {reserva.cantidadPersonas === 1 ? 'persona' : 'personas'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <EstadoIcono className="h-5 w-5" />
                          <span className={`font-medium ${estado.color}`}>
                            {estado.texto}
                          </span>
                        </div>
                        
                        {reserva.mesaId && (
                          <span className="text-sm text-neutral-600">
                            Mesa {reserva.mesaId}
                          </span>
                        )}
                      </div>

                      {reserva.observaciones && (
                        <p className="text-sm text-neutral-600 mt-2">
                          <strong>Observaciones:</strong> {reserva.observaciones}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {puedeCancelar(reserva) && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => cancelarReserva(reserva.id)}
                          disabled={cancelarReservaMutation.isPending}
                          className="btn-danger text-sm"
                        >
                          {cancelarReservaMutation.isPending ? 'Cancelando...' : 'Cancelar'}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Información sobre cancelaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-800 mb-2">
          Política de cancelaciones
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Puedes cancelar tu reserva hasta 1 día antes</li>
          <li>• Cancelaciones con menos de 24 horas: 80% de devolución</li>
          <li>• No shows: sin devolución</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default ReservaCliente
