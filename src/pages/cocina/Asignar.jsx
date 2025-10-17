import { useState } from 'react'
import { motion } from 'framer-motion'
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
  UserIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const AsignarCocina = () => {
  const [cocineroSeleccionado, setCocineroSeleccionado] = useState(null)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
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

  const cocineros = [
    { id: 1, nombre: 'Chef Roberto', especialidad: 'Platos Principales', activo: true, pedidosAsignados: 1 },
    { id: 2, nombre: 'Chef María', especialidad: 'Entradas y Ensaladas', activo: true, pedidosAsignados: 1 },
    { id: 3, nombre: 'Chef Carlos', especialidad: 'Postres', activo: true, pedidosAsignados: 0 },
    { id: 4, nombre: 'Chef Ana', especialidad: 'Bebidas y Cocteles', activo: false, pedidosAsignados: 0 }
  ]

  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente')
  const pedidosEnPreparacion = pedidos.filter(p => p.estado === 'en_preparacion')

  const asignarPedido = (pedidoId, cocineroId) => {
    const cocinero = cocineros.find(c => c.id === cocineroId)
    if (!cocinero) return

    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, cocineroAsignado: cocinero.nombre, estado: 'en_preparacion' }
          : pedido
      )
    )
    
    toast.success(`Pedido asignado a ${cocinero.nombre}`)
    setMostrarModal(false)
    setPedidoSeleccionado(null)
    setCocineroSeleccionado(null)
  }

  const desasignarPedido = (pedidoId) => {
    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, cocineroAsignado: null, estado: 'pendiente' }
          : pedido
      )
    )
    
    toast.success('Pedido desasignado')
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

  const estadisticas = {
    pedidosPendientes: pedidosPendientes.length,
    pedidosEnPreparacion: pedidosEnPreparacion.length,
    cocinerosActivos: cocineros.filter(c => c.activo).length,
    cocinerosDisponibles: cocineros.filter(c => c.activo && c.pedidosAsignados < 3).length
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
          Asignación de Cocineros
        </h1>
        <p className="text-neutral-600">
          Gestiona la asignación de pedidos a cocineros
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
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-2">
            {estadisticas.pedidosPendientes}
          </div>
          <p className="text-sm text-neutral-600">Pendientes</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
            {estadisticas.pedidosEnPreparacion}
          </div>
          <p className="text-sm text-neutral-600">En Preparación</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
            {estadisticas.cocinerosActivos}
          </div>
          <p className="text-sm text-neutral-600">Cocineros Activos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-2">
            {estadisticas.cocinerosDisponibles}
          </div>
          <p className="text-sm text-neutral-600">Disponibles</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos Pendientes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
            Pedidos Pendientes ({pedidosPendientes.length})
          </h2>
          
          <div className="space-y-4">
            {pedidosPendientes.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">No hay pedidos pendientes</p>
              </div>
            ) : (
              pedidosPendientes.map((pedido) => {
                const prioridadInfo = obtenerPrioridad(pedido.prioridad)
                
                return (
                  <div key={pedido.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-800">{pedido.numero}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadInfo.bgColor} ${prioridadInfo.color}`}>
                        {prioridadInfo.texto}
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-3">
                      <span>Tiempo espera: {calcularTiempoEspera(pedido.fechaCreacion)}</span>
                      <span className="ml-4">Tiempo estimado: {pedido.tiempoEstimado} min</span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-3">
                      <strong>Items:</strong> {pedido.items.map(item => `${item.nombre} x${item.cantidad}`).join(', ')}
                    </div>
                    
                    {pedido.observaciones && (
                      <div className="text-sm text-neutral-600 mb-3">
                        <strong>Observaciones:</strong> {pedido.observaciones}
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setPedidoSeleccionado(pedido)
                        setMostrarModal(true)
                      }}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Asignar Cocinero
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>

        {/* Pedidos En Preparación */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
            <PlayIcon className="h-5 w-5 text-blue-600 mr-2" />
            Pedidos En Preparación ({pedidosEnPreparacion.length})
          </h2>
          
          <div className="space-y-4">
            {pedidosEnPreparacion.length === 0 ? (
              <div className="text-center py-8">
                <PlayIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">No hay pedidos en preparación</p>
              </div>
            ) : (
              pedidosEnPreparacion.map((pedido) => {
                const prioridadInfo = obtenerPrioridad(pedido.prioridad)
                
                return (
                  <div key={pedido.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-800">{pedido.numero}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadInfo.bgColor} ${prioridadInfo.color}`}>
                        {prioridadInfo.texto}
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-3">
                      <span>Tiempo espera: {calcularTiempoEspera(pedido.fechaCreacion)}</span>
                      <span className="ml-4">Tiempo estimado: {pedido.tiempoEstimado} min</span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-3">
                      <strong>Cocinero:</strong> {pedido.cocineroAsignado}
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-3">
                      <strong>Items:</strong> {pedido.items.map(item => `${item.nombre} x${item.cantidad}`).join(', ')}
                    </div>
                    
                    {pedido.observaciones && (
                      <div className="text-sm text-neutral-600 mb-3">
                        <strong>Observaciones:</strong> {pedido.observaciones}
                      </div>
                    )}
                    
                    <button
                      onClick={() => desasignarPedido(pedido.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Desasignar
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal de Asignación */}
      {mostrarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Asignar Cocinero a {pedidoSeleccionado?.numero}
            </h3>
            
            <div className="space-y-3 mb-6">
              {cocineros.filter(c => c.activo).map((cocinero) => (
                <button
                  key={cocinero.id}
                  onClick={() => setCocineroSeleccionado(cocinero)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                    cocineroSeleccionado?.id === cocinero.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-medium text-neutral-800">{cocinero.nombre}</div>
                  <div className="text-sm text-neutral-600">{cocinero.especialidad}</div>
                  <div className="text-sm text-neutral-500">
                    Pedidos asignados: {cocinero.pedidosAsignados}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setMostrarModal(false)
                  setPedidoSeleccionado(null)
                  setCocineroSeleccionado(null)
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={() => asignarPedido(pedidoSeleccionado.id, cocineroSeleccionado.id)}
                disabled={!cocineroSeleccionado}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  !cocineroSeleccionado
                    ? 'bg-neutral-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Asignar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AsignarCocina