import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import { useAuthStore } from '../../stores/authStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mesasMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  MinusIcon, 
  TrashIcon,
  ShoppingCartIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const PedidoCliente = () => {
  const { carrito, limpiarCarrito, getTotalCarrito, getCantidadTotalCarrito } = useAppStore()
  const { usuario } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)
  const [observaciones, setObservaciones] = useState('')
  const [isEnviando, setIsEnviando] = useState(false)

  // Obtener mesas disponibles
  const { data: mesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  // Mutación para crear pedido
  const crearPedidoMutation = useMutation({
    mutationFn: async (datosPedido) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, pedidoId: Date.now() }
    },
    onSuccess: () => {
      toast.success('¡Pedido enviado exitosamente!')
      limpiarCarrito()
      setMesaSeleccionada(null)
      setObservaciones('')
      queryClient.invalidateQueries(['pedidos'])
    },
    onError: () => {
      toast.error('Error al enviar el pedido')
    }
  })

  const actualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removerItem(itemId)
    } else {
      // Actualizar cantidad en el store
      const item = carrito.find(i => i.id === itemId)
      if (item) {
        // Esta función debería estar en el store
        // Por ahora simulamos la actualización
        console.log(`Actualizar cantidad de ${itemId} a ${nuevaCantidad}`)
      }
    }
  }

  const removerItem = (itemId) => {
    // Esta función debería estar en el store
    console.log(`Remover item ${itemId}`)
  }

  const enviarPedido = async () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    if (!mesaSeleccionada) {
      toast.error('Selecciona una mesa')
      return
    }

    setIsEnviando(true)

    const pedido = {
      clienteId: usuario.id,
      mesaId: mesaSeleccionada.id,
      items: carrito.map(item => ({
        platoId: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      })),
      subtotal: getTotalCarrito(),
      propina: Math.round(getTotalCarrito() * 0.1), // 10% propina
      total: getTotalCarrito() + Math.round(getTotalCarrito() * 0.1),
      observaciones,
      estado: 'pendiente'
    }

    await crearPedidoMutation.mutateAsync(pedido)
    setIsEnviando(false)
  }

  const mesasDisponibles = mesas?.filter(mesa => mesa.estado === 'libre') || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Mi Pedido
        </h1>
        <p className="text-neutral-600">
          Revisa tu pedido y selecciona una mesa
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carrito */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Resumen del carrito */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-800 flex items-center">
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                Carrito ({getCantidadTotalCarrito()} items)
              </h2>
              {carrito.length > 0 && (
                <button
                  onClick={limpiarCarrito}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Limpiar carrito
                </button>
              )}
            </div>

            {carrito.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg">Tu carrito está vacío</p>
                <p className="text-neutral-400 text-sm mt-2">
                  Ve a la carta para agregar platos
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {carrito.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-800">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        ${item.precio.toLocaleString()} c/u
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.cantidad}
                      </span>
                      
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-primary-800">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removerItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Observaciones especiales
            </h3>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Sin cebolla, bien cocido, sin picante..."
              className="w-full h-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </motion.div>

        {/* Panel de resumen y envío */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Selección de mesa */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Selecciona una mesa
            </h3>
            
            {mesasDisponibles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500">No hay mesas disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {mesasDisponibles.map((mesa) => (
                  <motion.button
                    key={mesa.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMesaSeleccionada(mesa)}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      mesaSeleccionada?.id === mesa.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-neutral-800">
                      Mesa {mesa.numero}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {mesa.capacidad} personas
                    </div>
                    <div className="text-xs text-neutral-500 capitalize">
                      {mesa.ubicacion}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Resumen del pedido
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="font-medium">${getTotalCarrito().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-600">Propina (10%):</span>
                <span className="font-medium">${Math.round(getTotalCarrito() * 0.1).toLocaleString()}</span>
              </div>
              
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-neutral-800">Total:</span>
                  <span className="text-lg font-bold text-primary-800">
                    ${(getTotalCarrito() + Math.round(getTotalCarrito() * 0.1)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="h-4 w-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-800">Cliente:</span>
              </div>
              <p className="text-sm text-neutral-600">{usuario?.nombre}</p>
              <p className="text-xs text-neutral-500">{usuario?.email}</p>
            </div>

            {/* Botón enviar pedido */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={enviarPedido}
              disabled={carrito.length === 0 || !mesaSeleccionada || isEnviando}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                carrito.length === 0 || !mesaSeleccionada || isEnviando
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isEnviando ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando pedido...
                </div>
              ) : (
                'Enviar Pedido'
              )}
            </motion.button>

            {carrito.length > 0 && !mesaSeleccionada && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Selecciona una mesa para continuar
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PedidoCliente
