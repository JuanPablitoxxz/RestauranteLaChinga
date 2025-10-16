import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useCarritoStore } from '../../stores/carritoStoreSimple'

const MiPedido = () => {
  const navigate = useNavigate()
  
  // Store global del carrito
  const { 
    items: carrito, 
    actualizarCantidad, 
    eliminarItem, 
    setObservaciones, 
    observaciones,
    getTotalPrecio 
  } = useCarritoStore()

  // Si el carrito está vacío, mostrar mensaje
  if (carrito.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/cliente/dashboard')}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
              Mi Pedido 🇲🇽
            </h1>
            <p className="text-neutral-600">
              Revisa y gestiona tu pedido actual
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-neutral-200 p-12 text-center"
        >
          <ShoppingCartIcon className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-neutral-600 mb-6">
            Ve a la carta para agregar platos a tu pedido
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/cliente/carta')}
            className="btn-primary"
          >
            Ver Carta
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Simular estados de pedido para los items del carrito
  const pedido = carrito.map((item, index) => ({
    ...item,
    estado: index === 0 ? 'en_preparacion' : 'listo',
    tiempo_estimado: index === 0 ? 12 : 0,
    observaciones: index === 0 ? 'Bien cocida' : index === 1 ? 'Sin sal en el borde' : ''
  }))

  const obtenerEstadoItem = (estado) => {
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
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
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

  const totalPedido = getTotalPrecio()
  const itemsPendientes = pedido.filter(item => item.estado === 'pendiente').length
  const itemsEnPreparacion = pedido.filter(item => item.estado === 'en_preparacion').length
  const itemsListos = pedido.filter(item => item.estado === 'listo').length

  const notificarMesero = () => {
    toast.success('Notificación enviada al mesero')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/cliente/dashboard')}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
              Mi Pedido 🇲🇽
            </h1>
            <p className="text-neutral-600">
              Revisa y gestiona tu pedido actual
            </p>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas del Pedido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">{itemsPendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">En Preparación</p>
              <p className="text-2xl font-bold text-blue-900">{itemsEnPreparacion}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Listos</p>
              <p className="text-2xl font-bold text-green-900">{itemsListos}</p>
            </div>
          </div>
        </div>

        <div className="bg-mexico-rojo-50 p-4 rounded-lg border border-mexico-rojo-200">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-6 w-6 text-mexico-rojo-600" />
            <div>
              <p className="text-sm font-medium text-mexico-rojo-800">Total</p>
              <p className="text-2xl font-bold text-mexico-rojo-900">${totalPedido.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de Items del Pedido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-6"
      >
        {pedido.map(item => {
          const estado = obtenerEstadoItem(item.estado)
          const EstadoIcono = estado.icono

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {item.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                      <div className="flex items-center space-x-1">
                        <EstadoIcono className="h-3 w-3" />
                        <span>{estado.texto}</span>
                      </div>
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">
                    {item.descripcion}
                  </p>

                  {item.observaciones && (
                    <div className="mb-3 p-2 bg-neutral-50 rounded text-sm text-neutral-700">
                      <strong>Observaciones:</strong> {item.observaciones}
                    </div>
                  )}

                  {item.tiempo_estimado > 0 && item.estado !== 'listo' && (
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>Tiempo estimado: {item.tiempo_estimado} minutos</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="p-1 text-mexico-rojo-600 hover:text-mexico-rojo-800 hover:bg-mexico-rojo-50 rounded transition-colors"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-neutral-700 min-w-[20px] text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="p-1 text-mexico-verde-600 hover:text-mexico-verde-800 hover:bg-mexico-verde-50 rounded transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-mexico-rojo-600">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <p className="text-sm text-neutral-600">
                      ${item.precio} c/u
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => eliminarItem(item.id)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar item"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Observaciones Generales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-neutral-200 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">
          Observaciones Generales del Pedido
        </h3>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          className="input-field resize-none"
          placeholder="Alergias, preferencias especiales, instrucciones adicionales..."
        />
      </motion.div>

      {/* Resumen del Pedido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Resumen del Pedido
        </h3>
        
        <div className="space-y-2 mb-4">
          {pedido.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-700">
                {item.nombre} x{item.cantidad}
              </span>
              <span className="text-neutral-600">
                ${(item.precio * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-neutral-800">Total:</span>
            <span className="text-2xl font-bold text-mexico-rojo-600">
              ${totalPedido.toFixed(2)}
            </span>
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={notificarMesero}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <BellIcon className="h-4 w-4" />
              <span>Notificar al Mesero</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/cliente/factura')}
              className="flex-1 btn-success"
            >
              Ver Factura
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MiPedido
