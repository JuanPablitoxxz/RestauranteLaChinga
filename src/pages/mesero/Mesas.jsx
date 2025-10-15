import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { mesasMock, pedidosMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const MesasMesero = () => {
  const { usuario } = useAuthStore()
  const queryClient = useQueryClient()
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  // Obtener mesas asignadas al mesero
  const { data: mesas, isLoading: isLoadingMesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  // Obtener pedidos
  const { data: pedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => pedidosMock,
    staleTime: 5 * 60 * 1000
  })

  const mesasAsignadas = mesas?.filter(mesa => 
    usuario?.mesasAsignadas?.includes(mesa.id)
  ) || []

  // Mutación para actualizar estado de mesa
  const actualizarMesaMutation = useMutation({
    mutationFn: async ({ mesaId, nuevoEstado }) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Estado de mesa actualizado')
      queryClient.invalidateQueries(['mesas'])
    },
    onError: () => {
      toast.error('Error al actualizar la mesa')
    }
  })

  const obtenerEstadoMesa = (mesa) => {
    switch (mesa.estado) {
      case 'libre':
        return { 
          texto: 'Libre', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
        }
      case 'ocupada':
        return { 
          texto: 'Ocupada', 
          color: 'text-primary-600', 
          bgColor: 'bg-primary-100',
          icono: UserGroupIcon 
        }
      case 'con_pedido':
        return { 
          texto: 'Con Pedido', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'pendiente_pago':
        return { 
          texto: 'Pendiente Pago', 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-100',
          icono: ExclamationTriangleIcon 
        }
      default:
        return { 
          texto: 'No disponible', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: XCircleIcon 
        }
    }
  }

  const obtenerPedidoMesa = (mesaId) => {
    return pedidos?.find(pedido => 
      pedido.mesaId === mesaId && 
      (pedido.estado === 'pendiente' || pedido.estado === 'en_preparacion' || pedido.estado === 'listo')
    )
  }

  const cambiarEstadoMesa = async (mesaId, nuevoEstado) => {
    await actualizarMesaMutation.mutateAsync({ mesaId, nuevoEstado })
  }

  const obtenerAccionesDisponibles = (mesa) => {
    const acciones = []
    
    switch (mesa.estado) {
      case 'libre':
        acciones.push({ 
          accion: 'ocupar', 
          label: 'Ocupar Mesa', 
          color: 'btn-primary',
          nuevoEstado: 'ocupada'
        })
        break
      case 'ocupada':
        acciones.push(
          { 
            accion: 'liberar', 
            label: 'Liberar Mesa', 
            color: 'btn-secondary',
            nuevoEstado: 'libre'
          },
          { 
            accion: 'pedido', 
            label: 'Tomar Pedido', 
            color: 'btn-success',
            nuevoEstado: 'con_pedido'
          }
        )
        break
      case 'con_pedido':
        acciones.push(
          { 
            accion: 'cobrar', 
            label: 'Cobrar', 
            color: 'btn-warning',
            nuevoEstado: 'pendiente_pago'
          }
        )
        break
      case 'pendiente_pago':
        acciones.push(
          { 
            accion: 'finalizar', 
            label: 'Finalizar', 
            color: 'btn-success',
            nuevoEstado: 'libre'
          }
        )
        break
    }
    
    return acciones
  }

  const obtenerColorUbicacion = (ubicacion) => {
    const colores = {
      interior: 'bg-blue-100 text-blue-800',
      terraza: 'bg-green-100 text-green-800',
      jardin: 'bg-purple-100 text-purple-800'
    }
    return colores[ubicacion] || 'bg-neutral-100 text-neutral-800'
  }

  if (isLoadingMesas) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loading-skeleton h-48 w-full"></div>
          ))}
        </div>
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
          Mis Mesas
        </h1>
        <p className="text-neutral-600">
          Gestiona las mesas asignadas a ti
        </p>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Total Mesas', 
            valor: mesasAsignadas.length, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Ocupadas', 
            valor: mesasAsignadas.filter(m => m.estado === 'ocupada').length, 
            color: 'bg-primary-100 text-primary-800' 
          },
          { 
            label: 'Con Pedido', 
            valor: mesasAsignadas.filter(m => m.estado === 'con_pedido').length, 
            color: 'bg-yellow-100 text-yellow-800' 
          },
          { 
            label: 'Pendiente Pago', 
            valor: mesasAsignadas.filter(m => m.estado === 'pendiente_pago').length, 
            color: 'bg-orange-100 text-orange-800' 
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

      {/* Grid de mesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mesasAsignadas.map((mesa, index) => {
          const estado = obtenerEstadoMesa(mesa)
          const EstadoIcono = estado.icono
          const pedido = obtenerPedidoMesa(mesa.id)
          const acciones = obtenerAccionesDisponibles(mesa)
          
          return (
            <motion.div
              key={mesa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer"
            >
              {/* Header de la mesa */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-800">
                      {mesa.numero}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      Mesa {mesa.numero}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {mesa.capacidad} personas
                    </p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                  {estado.texto}
                </div>
              </div>

              {/* Información de la mesa */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <EstadoIcono className={`h-4 w-4 ${estado.color}`} />
                  <span className="text-sm text-neutral-600">Estado:</span>
                  <span className={`text-sm font-medium ${estado.color}`}>
                    {estado.texto}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-600">Ubicación:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${obtenerColorUbicacion(mesa.ubicacion)}`}>
                    {mesa.ubicacion}
                  </span>
                </div>

                {mesa.horaOcupacion && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm text-neutral-600">
                      Ocupada desde: {new Date(mesa.horaOcupacion).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Información del pedido */}
              {pedido && (
                <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BellIcon className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-neutral-800">
                      Pedido #{pedido.id}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    <p>Items: {pedido.items?.length || 0}</p>
                    <p>Total: ${pedido.total?.toLocaleString() || 0}</p>
                    <p className="capitalize">Estado: {pedido.estado}</p>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-2">
                {acciones.map((accion, accionIndex) => (
                  <motion.button
                    key={accion.accion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => cambiarEstadoMesa(mesa.id, accion.nuevoEstado)}
                    disabled={actualizarMesaMutation.isPending}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      accion.color === 'btn-primary' ? 'btn-primary' :
                      accion.color === 'btn-secondary' ? 'btn-secondary' :
                      accion.color === 'btn-success' ? 'btn-success' :
                      accion.color === 'btn-warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                      'btn-secondary'
                    }`}
                  >
                    {accion.label}
                  </motion.button>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMesaSeleccionada(mesa)
                    setMostrarModal(true)
                  }}
                  className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all duration-200"
                >
                  Ver Detalles
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modal de detalles de mesa */}
      {mostrarModal && mesaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral-800">
                Mesa {mesaSeleccionada.numero}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Capacidad</p>
                  <p className="font-medium">{mesaSeleccionada.capacidad} personas</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Ubicación</p>
                  <p className="font-medium capitalize">{mesaSeleccionada.ubicacion}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Estado</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${obtenerEstadoMesa(mesaSeleccionada).bgColor} ${obtenerEstadoMesa(mesaSeleccionada).color}`}>
                  {obtenerEstadoMesa(mesaSeleccionada).texto}
                </div>
              </div>

              {mesaSeleccionada.horaOcupacion && (
                <div>
                  <p className="text-sm text-neutral-600">Ocupada desde</p>
                  <p className="font-medium">
                    {new Date(mesaSeleccionada.horaOcupacion).toLocaleString()}
                  </p>
                </div>
              )}

              {obtenerPedidoMesa(mesaSeleccionada.id) && (
                <div>
                  <p className="text-sm text-neutral-600">Pedido activo</p>
                  <p className="font-medium">
                    Pedido #{obtenerPedidoMesa(mesaSeleccionada.id).id}
                  </p>
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

export default MesasMesero
