import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCocinaPedidos } from '../../hooks/useCocinaPedidos'
import toast from 'react-hot-toast'
import { 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BellIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const PedidosCocina = () => {
  const [filtro, setFiltro] = useState('todos') // todos, pendientes, en_preparacion, listos
  const [ordenamiento, setOrdenamiento] = useState('fecha') // fecha, prioridad, tiempo

  // Hook personalizado para gestión de pedidos de cocina
  const {
    pedidos,
    isLoadingPedidos,
    cambiarEstadoPedido,
    isChangingState
  } = useCocinaPedidos()

  // Filtrar y ordenar pedidos
  const pedidosFiltrados = pedidos?.filter(pedido => {
    if (filtro === 'todos') return true
    return pedido.estado === filtro
  }).sort((a, b) => {
    switch (ordenamiento) {
      case 'fecha':
        return new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
      case 'prioridad':
        // Prioridad basada en tiempo de espera
        const tiempoA = Date.now() - new Date(a.fechaCreacion).getTime()
        const tiempoB = Date.now() - new Date(b.fechaCreacion).getTime()
        return tiempoB - tiempoA
      case 'tiempo':
        return a.tiempoEstimado - b.tiempoEstimado
      default:
        return 0
    }
  }) || []

  const cambiarEstado = (pedidoId, nuevoEstado) => {
    cambiarEstadoPedido.mutate({ pedidoId, nuevoEstado })
  }

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
          icono: PlayIcon 
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

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    await cambiarEstadoPedido.mutateAsync({
      pedidoId,
      nuevoEstado,
      observaciones: ''
    })

    // Si el pedido está listo, notificar al mesero
    if (nuevoEstado === 'listo') {
      try {
        const pedido = pedidos?.find(p => p.id === pedidoId)
        if (pedido) {
          await notificarPedidoListo(pedido.mesaId, pedidoId)
        }
      } catch (error) {
        console.error('Error al notificar pedido listo:', error)
        toast.error('Error al notificar al mesero')
      }
    }
  }

  const calcularTiempoEspera = (fechaCreacion) => {
    const ahora = new Date()
    const fechaPedido = new Date(fechaCreacion)
    const diferencia = ahora - fechaPedido
    const minutos = Math.floor(diferencia / 60000)
    
    if (minutos < 60) {
      return `${minutos} min`
    } else {
      const horas = Math.floor(minutos / 60)
      const minRestantes = minutos % 60
      return `${horas}h ${minRestantes}min`
    }
  }

  const obtenerPrioridad = (fechaCreacion) => {
    const minutos = Math.floor((Date.now() - new Date(fechaCreacion).getTime()) / 60000)
    
    if (minutos > 30) return { nivel: 'Alta', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (minutos > 15) return { nivel: 'Media', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { nivel: 'Baja', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  const calcularEstadisticas = () => {
    const total = pedidos?.length || 0
    const pendientes = pedidos?.filter(p => p.estado === 'pendiente').length || 0
    const enPreparacion = pedidos?.filter(p => p.estado === 'en_preparacion').length || 0
    const listos = pedidos?.filter(p => p.estado === 'listo').length || 0

    return { total, pendientes, enPreparacion, listos }
  }

  const estadisticas = calcularEstadisticas()

  if (isLoadingPedidos) {
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
          Gestión de Cocina
        </h1>
        <p className="text-neutral-600">
          Administra los pedidos y el flujo de cocina
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
            label: 'Total Pedidos', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Pendientes', 
            valor: estadisticas.pendientes, 
            color: 'bg-yellow-100 text-yellow-800' 
          },
          { 
            label: 'En Preparación', 
            valor: estadisticas.enPreparacion, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Listos', 
            valor: estadisticas.listos, 
            color: 'bg-green-100 text-green-800' 
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

      {/* Filtros y controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'pendiente', label: 'Pendientes' },
              { value: 'en_preparacion', label: 'En Preparación' },
              { value: 'listo', label: 'Listos' }
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

          {/* Ordenamiento */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Ordenar por:</span>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="fecha">Fecha</option>
              <option value="prioridad">Prioridad</option>
              <option value="tiempo">Tiempo Estimado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de pedidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <ClockIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No hay pedidos
            </h2>
            <p className="text-neutral-600">
              {filtro === 'todos' 
                ? 'No hay pedidos registrados'
                : `No hay pedidos ${filtro === 'pendiente' ? 'pendientes' : 
                  filtro === 'en_preparacion' ? 'en preparación' : 'listos'}`
              }
            </p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido, index) => {
            const estado = obtenerEstadoPedido(pedido.estado)
            const EstadoIcono = estado.icono
            const prioridad = obtenerPrioridad(pedido.fechaCreacion)
            const tiempoEspera = calcularTiempoEspera(pedido.fechaCreacion)
            
            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-800">
                        #{pedido.id}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        Pedido #{pedido.id}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Mesa {pedido.mesaId} • {format(new Date(pedido.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${prioridad.bgColor} ${prioridad.color}`}>
                      {prioridad.nivel}
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
                      <div className="flex items-center space-x-2">
                        <EstadoIcono className="h-4 w-4" />
                        <span>{estado.texto}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Información del pedido */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Información</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4" />
                        <span>Mesa {pedido.mesaId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>Tiempo estimado: {pedido.tiempoEstimado} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Tiempo de espera: {tiempoEspera}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items del pedido */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Items ({pedido.items?.length || 0})</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      {pedido.items?.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between">
                          <span>{item.nombre} x{item.cantidad}</span>
                          <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                      ))}
                      {pedido.items?.length > 3 && (
                        <div className="text-xs text-neutral-500">
                          +{pedido.items.length - 3} items más
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Total</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${pedido.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Propina:</span>
                        <span>${pedido.propina.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-neutral-800">
                        <span>Total:</span>
                        <span>${pedido.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                {pedido.observaciones && (
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      <strong>Observaciones:</strong> {pedido.observaciones}
                    </p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex space-x-3">
                  {pedido.estado === 'pendiente' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => actualizarEstado(pedido.id, 'en_preparacion')}
                      disabled={isChangingState}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      <span>Iniciar Preparación</span>
                    </motion.button>
                  )}
                  
                  {pedido.estado === 'en_preparacion' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => actualizarEstado(pedido.id, 'listo')}
                      disabled={isChangingState}
                      className="btn-success flex items-center space-x-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Marcar como Listo</span>
                    </motion.button>
                  )}
                  
                  {pedido.estado === 'listo' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => actualizarEstado(pedido.id, 'entregado')}
                      disabled={isChangingState}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Marcar como Entregado</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
    </div>
  )
}

export default PedidosCocina
