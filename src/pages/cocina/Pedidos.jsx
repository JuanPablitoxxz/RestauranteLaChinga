import { useState } from 'react'
import { motion } from 'framer-motion'
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
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      numero: 'PED-001',
      mesa: 2,
      mesero: 'Pedro González',
      cliente: 'María García',
      items: [
        { nombre: 'Tacos al Pastor', cantidad: 3, precio: 45, observaciones: 'Sin cebolla' },
        { nombre: 'Quesadilla de Pollo', cantidad: 1, precio: 35, observaciones: 'Extra queso' },
        { nombre: 'Coca Cola', cantidad: 2, precio: 25, observaciones: 'Sin hielo' }
      ],
      estado: 'pendiente',
      prioridad: 'normal',
      tiempoEstimado: 20,
      fechaCreacion: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
      cocineroAsignado: null,
      observaciones: 'Cliente alérgico a mariscos'
    },
    {
      id: 2,
      numero: 'PED-002',
      mesa: 4,
      mesero: 'Ana López',
      cliente: 'Carlos Ruiz',
      items: [
        { nombre: 'Burrito de Carne', cantidad: 1, precio: 55, observaciones: 'Picante' },
        { nombre: 'Ensalada César', cantidad: 1, precio: 40, observaciones: 'Sin crutones' }
      ],
      estado: 'en_preparacion',
      prioridad: 'alta',
      tiempoEstimado: 15,
      fechaCreacion: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
      cocineroAsignado: 'Chef Roberto',
      observaciones: 'Urgente - cliente con prisa'
    },
    {
      id: 3,
      numero: 'PED-003',
      mesa: 1,
      mesero: 'Luis Martínez',
      cliente: 'Sofia Herrera',
      items: [
        { nombre: 'Chiles Rellenos', cantidad: 2, precio: 65, observaciones: 'Sin picante' },
        { nombre: 'Arroz Blanco', cantidad: 1, precio: 20, observaciones: 'Extra arroz' }
      ],
      estado: 'listo',
      prioridad: 'normal',
      tiempoEstimado: 25,
      fechaCreacion: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
      cocineroAsignado: 'Chef María',
      observaciones: 'Listo para entregar'
    },
    {
      id: 4,
      numero: 'PED-004',
      mesa: 6,
      mesero: 'Pedro González',
      cliente: 'Roberto Silva',
      items: [
        { nombre: 'Pozole', cantidad: 1, precio: 50, observaciones: 'Extra carne' },
        { nombre: 'Tostadas', cantidad: 3, precio: 30, observaciones: 'Bien tostadas' }
      ],
      estado: 'pendiente',
      prioridad: 'alta',
      tiempoEstimado: 30,
      fechaCreacion: new Date(Date.now() - 120000).toISOString(), // 2 min atrás
      cocineroAsignado: null,
      observaciones: 'Cliente VIP'
    }
  ])

  // Filtrar y ordenar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
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
  })

  const cambiarEstado = (pedidoId, nuevoEstado) => {
    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      )
    )
    
    const pedido = pedidos.find(p => p.id === pedidoId)
    if (pedido && nuevoEstado === 'listo') {
      toast.success(`Pedido ${pedido.numero} listo para Mesa ${pedido.mesa}`)
    } else {
      toast.success('Estado de pedido actualizado')
    }
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
          icono: BellIcon 
        }
    }
  }

  const obtenerPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return { 
          texto: 'Alta', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100' 
        }
      case 'normal':
        return { 
          texto: 'Normal', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100' 
        }
      case 'baja':
        return { 
          texto: 'Baja', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100' 
        }
      default:
        return { 
          texto: 'Normal', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100' 
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

  const estadisticas = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    enPreparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
    listos: pedidos.filter(p => p.estado === 'listo').length
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
          Gestión de Pedidos
        </h1>
        <p className="text-neutral-600">
          Administra y supervisa todos los pedidos de cocina
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
            {estadisticas.total}
          </div>
          <p className="text-sm text-neutral-600">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-2">
            {estadisticas.pendientes}
          </div>
          <p className="text-sm text-neutral-600">Pendientes</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
            {estadisticas.enPreparacion}
          </div>
          <p className="text-sm text-neutral-600">En Preparación</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
            {estadisticas.listos}
          </div>
          <p className="text-sm text-neutral-600">Listos</p>
        </div>
      </motion.div>

      {/* Filtros y Ordenamiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 items-center justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'en_preparacion', label: 'En Preparación' },
            { key: 'listo', label: 'Listos' }
          ].map((filtroOption) => (
            <button
              key={filtroOption.key}
              onClick={() => setFiltro(filtroOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === filtroOption.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filtroOption.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-600">Ordenar por:</span>
          <select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="fecha">Fecha</option>
            <option value="prioridad">Prioridad</option>
            <option value="tiempo">Tiempo Estimado</option>
          </select>
        </div>
      </motion.div>

      {/* Lista de Pedidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No hay pedidos con el filtro seleccionado</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido, index) => {
            const estadoInfo = obtenerEstadoPedido(pedido.estado)
            const prioridadInfo = obtenerPrioridad(pedido.prioridad)
            const EstadoIcono = estadoInfo.icono
            
            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${estadoInfo.bgColor}`}>
                      <EstadoIcono className={`h-5 w-5 ${estadoInfo.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-800">
                        {pedido.numero}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>Mesa {pedido.mesa}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{pedido.mesero}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadInfo.bgColor} ${prioridadInfo.color}`}>
                      {prioridadInfo.texto}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.bgColor} ${estadoInfo.color}`}>
                      {estadoInfo.texto}
                    </span>
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="mb-4">
                  <h4 className="font-medium text-neutral-800 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {pedido.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{item.nombre}</span>
                          <span className="text-neutral-600 ml-2">x{item.cantidad}</span>
                          {item.observaciones && (
                            <span className="text-neutral-500 ml-2">({item.observaciones})</span>
                          )}
                        </div>
                        <span className="font-medium">${item.precio}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>Tiempo espera: {calcularTiempoEspera(pedido.fechaCreacion)}</span>
                    <span>Tiempo estimado: {pedido.tiempoEstimado} min</span>
                    {pedido.cocineroAsignado && (
                      <span>Cocinero: {pedido.cocineroAsignado}</span>
                    )}
                  </div>
                  <span>
                    {format(new Date(pedido.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>

                {/* Observaciones */}
                {pedido.observaciones && (
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-700">
                      <strong>Observaciones:</strong> {pedido.observaciones}
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center space-x-2">
                  {pedido.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstado(pedido.id, 'en_preparacion')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Preparación
                    </button>
                  )}
                  
                  {pedido.estado === 'en_preparacion' && (
                    <button
                      onClick={() => cambiarEstado(pedido.id, 'listo')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Marcar como Listo
                    </button>
                  )}
                  
                  {pedido.estado === 'listo' && (
                    <button
                      onClick={() => cambiarEstado(pedido.id, 'entregado')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Marcar como Entregado
                    </button>
                  )}
                  
                  {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                    <button
                      onClick={() => cambiarEstado(pedido.id, 'cancelado')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
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