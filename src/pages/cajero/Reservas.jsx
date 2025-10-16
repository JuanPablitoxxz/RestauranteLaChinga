import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  CalendarDaysIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import FormularioReserva from '../../components/forms/FormularioReserva'
import toast from 'react-hot-toast'

const ReservasCajero = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtro, setFiltro] = useState('todas')
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  // Datos mock de reservas
  const reservasMock = [
    {
      id: 1,
      fecha: '2024-01-16',
      hora: '19:00',
      personas: 4,
      mesa_id: 5,
      mesa_numero: 5,
      cliente_nombre: 'María González',
      cliente_telefono: '+52 55 1234 5678',
      cliente_email: 'maria@ejemplo.com',
      estado: 'confirmada',
      usuario_temporal: 'cliente_1705123456',
      password_temporal: 'abc12345',
      observaciones: 'Celebración de cumpleaños',
      fecha_creacion: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      fecha: '2024-01-16',
      hora: '20:30',
      personas: 2,
      mesa_id: 1,
      mesa_numero: 1,
      cliente_nombre: 'Carlos Ruiz',
      cliente_telefono: '+52 55 9876 5432',
      cliente_email: 'carlos@ejemplo.com',
      estado: 'confirmada',
      usuario_temporal: 'cliente_1705123457',
      password_temporal: 'def67890',
      observaciones: '',
      fecha_creacion: '2024-01-15T14:20:00Z'
    },
    {
      id: 3,
      fecha: '2024-01-17',
      hora: '18:00',
      personas: 6,
      mesa_id: 15,
      mesa_numero: 15,
      cliente_nombre: 'Ana Martínez',
      cliente_telefono: '+52 55 5555 1234',
      cliente_email: 'ana@ejemplo.com',
      estado: 'pendiente',
      usuario_temporal: 'cliente_1705123458',
      password_temporal: 'ghi90123',
      observaciones: 'Cena familiar',
      fecha_creacion: '2024-01-15T16:45:00Z'
    }
  ]

  // Datos mock de mesas
  const mesasMock = [
    { id: 1, numero: 1, capacidad: 2, ubicacion: 'interior', estado: 'libre' },
    { id: 5, numero: 5, capacidad: 4, ubicacion: 'interior', estado: 'reservada' },
    { id: 15, numero: 15, capacidad: 6, ubicacion: 'vip', estado: 'libre' }
  ]

  const { data: reservas, isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => reservasMock,
    staleTime: 5 * 60 * 1000
  })

  const { data: mesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  const reservasFiltradas = reservas?.filter(reserva => {
    if (filtro === 'todas') return true
    if (filtro === 'hoy') {
      const hoy = new Date().toISOString().split('T')[0]
      return reserva.fecha === hoy
    }
    return reserva.estado === filtro
  }) || []

  const obtenerEstadoReserva = (estado) => {
    switch (estado) {
      case 'confirmada':
        return { 
          texto: 'Confirmada', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
        }
      case 'pendiente':
        return { 
          texto: 'Pendiente', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'cancelada':
        return { 
          texto: 'Cancelada', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: XCircleIcon 
        }
      default:
        return { 
          texto: 'Desconocido', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          icono: XCircleIcon 
        }
    }
  }

  const copiarCredenciales = (usuario, password) => {
    const texto = `Usuario: ${usuario}\nContraseña: ${password}`
    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Credenciales copiadas al portapapeles')
    }).catch(() => {
      toast.error('Error al copiar las credenciales')
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
              Gestión de Reservas 🇲🇽
            </h1>
            <p className="text-neutral-600">
              Crea y administra las reservas del restaurante
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMostrarFormulario(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nueva Reserva</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'todas', label: 'Todas', count: reservas?.length || 0 },
            { value: 'hoy', label: 'Hoy', count: reservas?.filter(r => r.fecha === new Date().toISOString().split('T')[0]).length || 0 },
            { value: 'confirmada', label: 'Confirmadas', count: reservas?.filter(r => r.estado === 'confirmada').length || 0 },
            { value: 'pendiente', label: 'Pendientes', count: reservas?.filter(r => r.estado === 'pendiente').length || 0 },
            { value: 'cancelada', label: 'Canceladas', count: reservas?.filter(r => r.estado === 'cancelada').length || 0 }
          ].map(filtroOption => (
            <button
              key={filtroOption.value}
              onClick={() => setFiltro(filtroOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === filtroOption.value
                  ? 'bg-mexico-rojo-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filtroOption.label} ({filtroOption.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lista de Reservas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {reservasFiltradas.map(reserva => {
          const estado = obtenerEstadoReserva(reserva.estado)
          const EstadoIcono = estado.icono

          return (
            <motion.div
              key={reserva.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
                    <CalendarDaysIcon className="h-6 w-6 text-mexico-verde-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {reserva.cliente_nombre}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span className="flex items-center space-x-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>{new Date(reserva.fecha).toLocaleDateString('es-ES')} a las {reserva.hora}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{reserva.personas} personas</span>
                      </span>
                      <span>Mesa {reserva.mesa_numero}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
                    <div className="flex items-center space-x-1">
                      <EstadoIcono className="h-3 w-3" />
                      <span>{estado.texto}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => copiarCredenciales(reserva.usuario_temporal, reserva.password_temporal)}
                      className="p-2 text-neutral-600 hover:text-mexico-verde-600 hover:bg-mexico-verde-50 rounded-lg transition-colors"
                      title="Copiar credenciales"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setReservaSeleccionada(reserva)
                        setMostrarDetalle(true)
                      }}
                      className="p-2 text-neutral-600 hover:text-mexico-rojo-600 hover:bg-mexico-rojo-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {reserva.observaciones && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-700">
                    <strong>Observaciones:</strong> {reserva.observaciones}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modal de Detalle de Reserva */}
      {mostrarDetalle && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-800">
                  Detalles de la Reserva
                </h2>
                <button
                  onClick={() => setMostrarDetalle(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-neutral-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Información de la Reserva */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-3">Información de la Reserva</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700">Fecha y Hora</p>
                      <p className="text-neutral-800">
                        {new Date(reservaSeleccionada.fecha).toLocaleDateString('es-ES')} a las {reservaSeleccionada.hora}
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700">Número de Personas</p>
                      <p className="text-neutral-800">{reservaSeleccionada.personas} personas</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700">Mesa Asignada</p>
                      <p className="text-neutral-800">Mesa {reservaSeleccionada.mesa_numero}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700">Estado</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerEstadoReserva(reservaSeleccionada.estado).bgColor} ${obtenerEstadoReserva(reservaSeleccionada.estado).color}`}>
                        {obtenerEstadoReserva(reservaSeleccionada.estado).texto}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-3">Información del Cliente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <UserIcon className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Nombre</p>
                        <p className="text-neutral-800">{reservaSeleccionada.cliente_nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Teléfono</p>
                        <p className="text-neutral-800">{reservaSeleccionada.cliente_telefono}</p>
                      </div>
                    </div>
                    {reservaSeleccionada.cliente_email && (
                      <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-neutral-600" />
                        <div>
                          <p className="text-sm font-medium text-neutral-700">Email</p>
                          <p className="text-neutral-800">{reservaSeleccionada.cliente_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Credenciales Temporales */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-3">Credenciales Temporales</h3>
                  <div className="p-4 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-mexico-verde-800 mb-1">Usuario</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-sm font-mono text-neutral-800">
                            {reservaSeleccionada.usuario_temporal}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(reservaSeleccionada.usuario_temporal)}
                            className="text-mexico-verde-600 hover:text-mexico-verde-800"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-mexico-verde-800 mb-1">Contraseña</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-sm font-mono text-neutral-800">
                            {reservaSeleccionada.password_temporal}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(reservaSeleccionada.password_temporal)}
                            className="text-mexico-verde-600 hover:text-mexico-verde-800"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-mexico-verde-700 mt-3">
                      Estas credenciales funcionarán solo el día de la reserva ({new Date(reservaSeleccionada.fecha).toLocaleDateString('es-ES')})
                    </p>
                  </div>
                </div>

                {reservaSeleccionada.observaciones && (
                  <div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-3">Observaciones</h3>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-700">{reservaSeleccionada.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Formulario de Reserva */}
      <FormularioReserva
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        onReservaCreada={(nuevaReserva) => {
          // Aquí se actualizaría la lista de reservas
          console.log('Reserva creada:', nuevaReserva)
          toast.success('Reserva creada exitosamente')
        }}
        mesasDisponibles={mesas}
      />
    </div>
  )
}

export default ReservasCajero