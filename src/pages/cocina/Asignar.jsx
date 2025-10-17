import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCocinaPedidos } from '../../hooks/useCocinaPedidos'
import toast from 'react-hot-toast'
import { 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const AsignarCocina = () => {
  const [cocineroSeleccionado, setCocineroSeleccionado] = useState(null)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  // Hook personalizado para gestión de pedidos de cocina
  const {
    pedidos,
    cocineros,
    isLoadingPedidos,
    isLoadingCocineros,
    asignarPedido,
    desasignarPedido,
    isAssigning,
    isUnassigning
  } = useCocinaPedidos()

  const pedidosPendientes = pedidos?.filter(p => p.estado === 'pendiente') || []
  const pedidosEnPreparacion = pedidos?.filter(p => p.estado === 'en_preparacion') || []

  const asignarPedidoHandler = (pedidoId, cocineroId) => {
    asignarPedido.mutate({ pedidoId, cocineroId })
    setMostrarModal(false)
    setPedidoSeleccionado(null)
    setCocineroSeleccionado(null)
  }

  const desasignarPedidoHandler = (pedidoId) => {
    desasignarPedido.mutate({ pedidoId })
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

  const obtenerEspecialidadRecomendada = (pedido) => {
    const items = pedido.items || []
    const categorias = items.map(item => {
      // Simular categorización basada en el nombre del plato
      if (item.nombre.toLowerCase().includes('ensalada') || item.nombre.toLowerCase().includes('entrada')) {
        return 'Entradas y Ensaladas'
      } else if (item.nombre.toLowerCase().includes('postre') || item.nombre.toLowerCase().includes('tiramisu')) {
        return 'Postres'
      } else if (item.nombre.toLowerCase().includes('bebida') || item.nombre.toLowerCase().includes('café')) {
        return 'Bebidas y Cocteles'
      } else {
        return 'Platos Principales'
      }
    })
    
    // Retornar la categoría más común
    const categoriaMasComun = categorias.reduce((a, b, i, arr) =>
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    )
    
    return categoriaMasComun
  }

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
          Asignación de Pedidos
        </h1>
        <p className="text-neutral-600">
          Asigna pedidos a los cocineros según su especialidad
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de cocineros */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-neutral-800">
            Cocineros Disponibles
          </h2>
          
          <div className="space-y-3">
            {cocineros.map((cocinero, index) => (
              <motion.div
                key={cocinero.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  cocineroSeleccionado?.id === cocinero.id
                    ? 'border-primary-500 bg-primary-50'
                    : cocinero.activo
                    ? 'border-neutral-200 hover:border-neutral-300'
                    : 'border-neutral-200 bg-neutral-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      cocinero.activo ? 'bg-green-100' : 'bg-neutral-200'
                    }`}>
                      <UserGroupIcon className={`h-5 w-5 ${
                        cocinero.activo ? 'text-green-600' : 'text-neutral-500'
                      }`} />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {cocinero.nombre}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {cocinero.especialidad}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-neutral-600">
                      {cocinero.pedidosAsignados} pedidos
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      cocinero.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {cocinero.activo ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
                
                {cocinero.activo && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCocineroSeleccionado(cocinero)}
                    className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      cocineroSeleccionado?.id === cocinero.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                    }`}
                  >
                    {cocineroSeleccionado?.id === cocinero.id ? 'Seleccionado' : 'Seleccionar'}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lista de pedidos pendientes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-neutral-800">
            Pedidos Pendientes ({pedidosPendientes.length})
          </h2>
          
          {pedidosPendientes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
              <CheckCircleIcon className="h-16 w-16 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                ¡Excelente trabajo!
              </h3>
              <p className="text-neutral-600">
                No hay pedidos pendientes por asignar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosPendientes.map((pedido, index) => {
                const prioridad = obtenerPrioridad(pedido.fechaCreacion)
                const tiempoEspera = calcularTiempoEspera(pedido.fechaCreacion)
                const especialidadRecomendada = obtenerEspecialidadRecomendada(pedido)
                
                return (
                  <motion.div
                    key={pedido.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      pedidoSeleccionado?.id === pedido.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-800">
                            #{pedido.id}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-neutral-800">
                            Pedido #{pedido.id}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Mesa {pedido.mesaId} • {tiempoEspera} de espera
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${prioridad.bgColor} ${prioridad.color}`}>
                        {prioridad.nivel}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-neutral-600">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>{pedido.items?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo estimado:</span>
                        <span>{pedido.tiempoEstimado} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Especialidad recomendada:</span>
                        <span className="text-primary-600 font-medium">
                          {especialidadRecomendada}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setPedidoSeleccionado(pedido)
                        setMostrarModal(true)
                      }}
                      className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pedidoSeleccionado?.id === pedido.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                      }`}
                    >
                      {pedidoSeleccionado?.id === pedido.id ? 'Seleccionado' : 'Asignar'}
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Pedidos en preparación */}
      {pedidosEnPreparacion.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Pedidos en Preparación ({pedidosEnPreparacion.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidosEnPreparacion.map((pedido, index) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-800">
                    Pedido #{pedido.id}
                  </h3>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    En Preparación
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-neutral-600">
                  <p>Mesa {pedido.mesaId}</p>
                  <p>{pedido.items?.length || 0} items</p>
                  <p>Tiempo estimado: {pedido.tiempoEstimado} min</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal de asignación */}
      {mostrarModal && pedidoSeleccionado && (
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
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              Asignar Pedido #{pedidoSeleccionado.id}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-2">Detalles del Pedido</h4>
                <div className="space-y-1 text-sm text-neutral-600">
                  <p>Mesa: {pedidoSeleccionado.mesaId}</p>
                  <p>Items: {pedidoSeleccionado.items?.length || 0}</p>
                  <p>Tiempo estimado: {pedidoSeleccionado.tiempoEstimado} min</p>
                  <p>Total: ${pedidoSeleccionado.total.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Seleccionar Cocinero
                </label>
                <div className="space-y-2">
                  {cocineros.filter(c => c.activo).map((cocinero) => (
                    <motion.button
                      key={cocinero.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCocineroSeleccionado(cocinero)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        cocineroSeleccionado?.id === cocinero.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-medium text-neutral-800">{cocinero.nombre}</div>
                      <div className="text-sm text-neutral-600">{cocinero.especialidad}</div>
                      <div className="text-xs text-neutral-500">
                        {cocinero.pedidosAsignados} pedidos asignados
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => asignarPedidoHandler(pedidoSeleccionado.id, cocineroSeleccionado.id)}
                disabled={!cocineroSeleccionado || isAssigning}
                className={`flex-1 ${
                  !cocineroSeleccionado || isAssigning
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isAssigning ? 'Asignando...' : 'Asignar Pedido'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AsignarCocina
