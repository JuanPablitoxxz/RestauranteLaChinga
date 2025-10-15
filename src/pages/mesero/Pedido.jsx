import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { pedidosMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BellIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const PedidoMesero = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)

  // Obtener pedido específico
  const { data: pedido, isLoading: isLoadingPedido } = useQuery({
    queryKey: ['pedido', id],
    queryFn: () => pedidosMock.find(p => p.id === parseInt(id)),
    staleTime: 5 * 60 * 1000
  })

  // Mutación para actualizar estado del pedido
  const actualizarPedidoMutation = useMutation({
    mutationFn: async ({ pedidoId, nuevoEstado, observaciones }) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Estado del pedido actualizado')
      queryClient.invalidateQueries(['pedido', id])
      queryClient.invalidateQueries(['pedidos'])
    },
    onError: () => {
      toast.error('Error al actualizar el pedido')
    }
  })

  const obtenerEstadoPedido = (estado) => {
    switch (estado) {
      case 'pendiente':
        return { 
          texto: 'Pendiente', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'en_preparacion':
        return { 
          texto: 'En Preparación', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          icono: ClockIcon 
        }
      case 'listo':
        return { 
          texto: 'Listo', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
        }
      case 'entregado':
        return { 
          texto: 'Entregado', 
          color: 'text-primary-600', 
          bgColor: 'bg-primary-100',
          icono: CheckCircleIcon 
        }
      case 'cancelado':
        return { 
          texto: 'Cancelado', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: ExclamationTriangleIcon 
        }
      default:
        return { 
          texto: 'Desconocido', 
          color: 'text-neutral-600', 
          bgColor: 'bg-neutral-100',
          icono: ClockIcon 
        }
    }
  }

  const actualizarEstado = async (nuevoEstado) => {
    await actualizarPedidoMutation.mutateAsync({
      pedidoId: pedido.id,
      nuevoEstado,
      observaciones: pedido.observaciones
    })
  }

  const notificarCocina = async () => {
    setMostrarNotificacion(true)
    toast.success('Notificación enviada a cocina')
    
    // Simular notificación
    setTimeout(() => {
      setMostrarNotificacion(false)
    }, 3000)
  }

  const obtenerAccionesDisponibles = (estado) => {
    const acciones = []
    
    switch (estado) {
      case 'pendiente':
        acciones.push(
          { 
            accion: 'preparacion', 
            label: 'Enviar a Cocina', 
            color: 'btn-primary',
            nuevoEstado: 'en_preparacion'
          }
        )
        break
      case 'en_preparacion':
        acciones.push(
          { 
            accion: 'listo', 
            label: 'Marcar como Listo', 
            color: 'btn-success',
            nuevoEstado: 'listo'
          }
        )
        break
      case 'listo':
        acciones.push(
          { 
            accion: 'entregado', 
            label: 'Entregar al Cliente', 
            color: 'btn-primary',
            nuevoEstado: 'entregado'
          }
        )
        break
      case 'entregado':
        acciones.push(
          { 
            accion: 'cobrar', 
            label: 'Procesar Cobro', 
            color: 'btn-success',
            nuevoEstado: 'cobrado'
          }
        )
        break
    }
    
    return acciones
  }

  if (isLoadingPedido) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">
          Pedido no encontrado
        </h2>
        <p className="text-neutral-600 mb-6">
          El pedido que buscas no existe o ha sido eliminado
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mesero/mesas')}
          className="btn-primary"
        >
          Volver a Mesas
        </motion.button>
      </div>
    )
  }

  const estado = obtenerEstadoPedido(pedido.estado)
  const EstadoIcono = estado.icono
  const acciones = obtenerAccionesDisponibles(pedido.estado)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mesero/mesas')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-neutral-600" />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold text-primary-800">
              Pedido #{pedido.id}
            </h1>
            <p className="text-neutral-600">
              Mesa {pedido.mesaId} • {format(new Date(pedido.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
          <div className="flex items-center space-x-2">
            <EstadoIcono className="h-4 w-4" />
            <span>{estado.texto}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del pedido */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Detalles del pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">
              Detalles del Pedido
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Mesa:</span>
                  <span className="font-medium">Mesa {pedido.mesaId}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Hora:</span>
                  <span className="font-medium">
                    {format(new Date(pedido.fechaCreacion), 'HH:mm', { locale: es })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Tiempo estimado:</span>
                  <span className="font-medium">{pedido.tiempoEstimado} min</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-medium">${pedido.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Propina:</span>
                  <span className="font-medium">${pedido.propina.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-neutral-200 pt-2">
                  <span className="text-neutral-800">Total:</span>
                  <span className="text-primary-800">${pedido.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {pedido.observaciones && (
              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <strong>Observaciones:</strong> {pedido.observaciones}
                </p>
              </div>
            )}
          </div>

          {/* Items del pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">
              Items del Pedido
            </h2>
            
            <div className="space-y-4">
              {pedido.items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-800">
                        {item.cantidad}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-neutral-800">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        ${item.precio.toLocaleString()} c/u
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-primary-800">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel de acciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Acciones del pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Acciones
            </h3>
            
            <div className="space-y-3">
              {acciones.map((accion, index) => (
                <motion.button
                  key={accion.accion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => actualizarEstado(accion.nuevoEstado)}
                  disabled={actualizarPedidoMutation.isPending}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    accion.color === 'btn-primary' ? 'btn-primary' :
                    accion.color === 'btn-secondary' ? 'btn-secondary' :
                    accion.color === 'btn-success' ? 'btn-success' :
                    'btn-secondary'
                  }`}
                >
                  {accion.label}
                </motion.button>
              ))}
              
              {pedido.estado === 'pendiente' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={notificarCocina}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-200"
                >
                  Notificar a Cocina
                </motion.button>
              )}
            </div>
          </div>

          {/* Timeline del pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Progreso del Pedido
            </h3>
            
            <div className="space-y-4">
              {[
                { estado: 'pendiente', label: 'Pedido recibido', completado: true },
                { estado: 'en_preparacion', label: 'En preparación', completado: pedido.estado !== 'pendiente' },
                { estado: 'listo', label: 'Listo para entregar', completado: ['listo', 'entregado', 'cobrado'].includes(pedido.estado) },
                { estado: 'entregado', label: 'Entregado al cliente', completado: ['entregado', 'cobrado'].includes(pedido.estado) },
                { estado: 'cobrado', label: 'Cobrado', completado: pedido.estado === 'cobrado' }
              ].map((paso, index) => (
                <div key={paso.estado} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    paso.completado 
                      ? 'bg-green-600 text-white' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {paso.completado ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  <span className={`text-sm ${
                    paso.completado ? 'text-green-600 font-medium' : 'text-neutral-600'
                  }`}>
                    {paso.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notificación a cocina */}
          {mostrarNotificacion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Notificación enviada
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                La cocina ha sido notificada sobre este pedido
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default PedidoMesero
