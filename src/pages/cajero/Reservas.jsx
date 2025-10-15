import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservasMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ReservasCajero = () => {
  const queryClient = useQueryClient()
  const [filtro, setFiltro] = useState('todas') // todas, confirmadas, pendientes, canceladas
  const [busqueda, setBusqueda] = useState('')
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  // Obtener reservas
  const { data: reservas, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => reservasMock,
    staleTime: 5 * 60 * 1000
  })

  // Filtrar reservas
  const reservasFiltradas = reservas?.filter(reserva => {
    const cumpleFiltro = filtro === 'todas' || reserva.estado === filtro
    const cumpleBusqueda = busqueda === '' || 
      reserva.id.toString().includes(busqueda) ||
      reserva.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.clienteEmail.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.mesaId.toString().includes(busqueda)
    
    return cumpleFiltro && cumpleBusqueda
  }) || []

  // Mutación para actualizar estado de reserva
  const actualizarReservaMutation = useMutation({
    mutationFn: async ({ reservaId, nuevoEstado }) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Estado de reserva actualizado')
      setMostrarModal(false)
      setReservaSeleccionada(null)
      queryClient.invalidateQueries(['reservas'])
    },
    onError: () => {
      toast.error('Error al actualizar la reserva')
    }
  })

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
      case 'completada':
        return { 
          texto: 'Completada', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          icono: CheckCircleIcon 
        }
      default:
        return { 
          texto: 'Desconocido', 
          color: 'text-neutral-600', 
          bgColor: 'bg-neutral-100',
          icono: ExclamationTriangleIcon 
        }
    }
  }

  const actualizarEstadoReserva = async (reservaId, nuevoEstado) => {
    await actualizarReservaMutation.mutateAsync({ reservaId, nuevoEstado })
  }

  const calcularEstadisticas = () => {
    const total = reservas?.length || 0
    const confirmadas = reservas?.filter(r => r.estado === 'confirmada').length || 0
    const pendientes = reservas?.filter(r => r.estado === 'pendiente').length || 0
    const canceladas = reservas?.filter(r => r.estado === 'cancelada').length || 0

    return { total, confirmadas, pendientes, canceladas }
  }

  const estadisticas = calcularEstadisticas()

  const obtenerReservasHoy = () => {
    const hoy = new Date().toDateString()
    return reservas?.filter(r => {
      const fechaReserva = new Date(r.fecha).toDateString()
      return fechaReserva === hoy
    }) || []
  }

  const reservasHoy = obtenerReservasHoy()

  if (isLoadingReservas) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Gestión de Reservas
        </h1>
        <p className="text-neutral-600">
          Administra las reservas del restaurante
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Total Reservas', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Confirmadas', 
            valor: estadisticas.confirmadas, 
            color: 'bg-green-100 text-green-800' 
          },
          { 
            label: 'Pendientes', 
            valor: estadisticas.pendientes, 
            color: 'bg-yellow-100 text-yellow-800' 
          },
          { 
            label: 'Canceladas', 
            valor: estadisticas.canceladas, 
            color: 'bg-red-100 text-red-800' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stat.color} mb-2`}>
              {stat.valor}
            </div>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Reservas de hoy */}
      {reservasHoy.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Reservas de Hoy ({reservasHoy.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservasHoy.map((reserva) => {
              const estado = obtenerEstadoReserva(reserva.estado)
              const EstadoIcono = estado.icono
              
              return (
                <motion.div
                  key={reserva.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-neutral-800">
                      Mesa {reserva.mesaId}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                      {estado.texto}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{reserva.cantidadPersonas} personas</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{reserva.hora}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{reserva.clienteNombre}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Filtros y búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { value: 'todas', label: 'Todas' },
              { value: 'confirmadas', label: 'Confirmadas' },
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'canceladas', label: 'Canceladas' }
            ].map((filtroOption) => (
              <motion.button
                key={filtroOption.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFiltro(filtroOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filtro === filtroOption.value
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {filtroOption.label}
              </motion.button>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, mesa o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de reservas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {reservasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <CalendarIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No hay reservas
            </h2>
            <p className="text-neutral-600">
              {filtro === 'todas' 
                ? 'No hay reservas registradas'
                : `No hay reservas ${filtro}`
              }
            </p>
          </div>
        ) : (
          reservasFiltradas.map((reserva, index) => {
            const estado = obtenerEstadoReserva(reserva.estado)
            const EstadoIcono = estado.icono
            
            return (
              <motion.div
                key={reserva.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-800">
                        #{reserva.id}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {reserva.clienteNombre}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Mesa {reserva.mesaId} • {format(new Date(reserva.fecha), 'dd/MM/yyyy', { locale: es })} a las {reserva.hora}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
                    <div className="flex items-center space-x-2">
                      <EstadoIcono className="h-4 w-4" />
                      <span>{estado.texto}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Información del cliente */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Cliente</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4" />
                        <span>{reserva.cantidadPersonas} personas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{reserva.clienteTelefono}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{reserva.clienteEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información de la reserva */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Reserva</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(reserva.fecha), 'dd/MM/yyyy', { locale: es })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>{reserva.hora}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Mesa {reserva.mesaId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Observaciones</h4>
                    <p className="text-sm text-neutral-600">
                      {reserva.observaciones || 'Sin observaciones'}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-3">
                  {reserva.estado === 'pendiente' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => actualizarEstadoReserva(reserva.id, 'confirmada')}
                        disabled={actualizarReservaMutation.isPending}
                        className="btn-success"
                      >
                        Confirmar
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => actualizarEstadoReserva(reserva.id, 'cancelada')}
                        disabled={actualizarReservaMutation.isPending}
                        className="btn-danger"
                      >
                        Cancelar
                      </motion.button>
                    </>
                  )}
                  
                  {reserva.estado === 'confirmada' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => actualizarEstadoReserva(reserva.id, 'completada')}
                      disabled={actualizarReservaMutation.isPending}
                      className="btn-primary"
                    >
                      Marcar como Completada
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setReservaSeleccionada(reserva)
                      setMostrarModal(true)
                    }}
                    className="btn-secondary"
                  >
                    Ver Detalles
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Modal de detalles */}
      {mostrarModal && reservaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-800">
                Detalles de la Reserva #{reservaSeleccionada.id}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información del cliente */}
              <div>
                <h4 className="font-semibold text-neutral-800 mb-3">Información del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Nombre</p>
                    <p className="font-medium">{reservaSeleccionada.clienteNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-medium">{reservaSeleccionada.clienteEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Teléfono</p>
                    <p className="font-medium">{reservaSeleccionada.clienteTelefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Cantidad de personas</p>
                    <p className="font-medium">{reservaSeleccionada.cantidadPersonas}</p>
                  </div>
                </div>
              </div>

              {/* Información de la reserva */}
              <div>
                <h4 className="font-semibold text-neutral-800 mb-3">Información de la Reserva</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Fecha</p>
                    <p className="font-medium">
                      {format(new Date(reservaSeleccionada.fecha), 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Hora</p>
                    <p className="font-medium">{reservaSeleccionada.hora}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Mesa</p>
                    <p className="font-medium">Mesa {reservaSeleccionada.mesaId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Estado</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      obtenerEstadoReserva(reservaSeleccionada.estado).bgColor
                    } ${obtenerEstadoReserva(reservaSeleccionada.estado).color}`}>
                      {obtenerEstadoReserva(reservaSeleccionada.estado).texto}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {reservaSeleccionada.observaciones && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Observaciones</h4>
                  <p className="text-neutral-600">{reservaSeleccionada.observaciones}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ReservasCajero
