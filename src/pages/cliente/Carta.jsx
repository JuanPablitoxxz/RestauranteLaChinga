import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../stores/appStore'
import { obtenerCartaActual, cartasMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { ClockIcon, StarIcon } from '@heroicons/react/24/outline'

const CartaCliente = () => {
  const [cartaSeleccionada, setCartaSeleccionada] = useState('actual')
  const { agregarAlCarrito } = useAppStore()

  // Obtener carta actual
  const { data: cartaActual, isLoading: isLoadingActual } = useQuery({
    queryKey: ['carta-actual'],
    queryFn: () => obtenerCartaActual(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  // Obtener todas las cartas
  const { data: todasLasCartas, isLoading: isLoadingCartas } = useQuery({
    queryKey: ['cartas'],
    queryFn: () => Object.values(cartasMock),
    staleTime: 10 * 60 * 1000 // 10 minutos
  })

  const cartaMostrada = cartaSeleccionada === 'actual' ? cartaActual : 
    todasLasCartas?.find(c => c.id === cartaSeleccionada)

  const agregarAlCarritoHandler = (plato) => {
    agregarAlCarrito({
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio,
      imagen: plato.imagen,
      cantidad: 1
    })
    toast.success(`${plato.nombre} agregado al carrito`)
  }

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      entradas: 'bg-blue-100 text-blue-800',
      principales: 'bg-primary-100 text-primary-800',
      ensaladas: 'bg-green-100 text-green-800',
      postres: 'bg-purple-100 text-purple-800',
      bebidas: 'bg-yellow-100 text-yellow-800',
      cocteles: 'bg-pink-100 text-pink-800',
      cervezas: 'bg-orange-100 text-orange-800',
      vinos: 'bg-red-100 text-red-800'
    }
    return colores[categoria] || 'bg-neutral-100 text-neutral-800'
  }

  if (isLoadingActual || isLoadingCartas) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <div className="loading-skeleton h-48 w-full mb-4"></div>
              <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
              <div className="loading-skeleton h-3 w-full mb-2"></div>
              <div className="loading-skeleton h-3 w-1/2"></div>
            </div>
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
          Nuestra Carta
        </h1>
        <p className="text-neutral-600">
          Descubre nuestros deliciosos platos preparados con ingredientes frescos
        </p>
      </motion.div>

      {/* Selector de cartas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Selecciona una carta
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Carta actual */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCartaSeleccionada('actual')}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              cartaSeleccionada === 'actual'
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-neutral-800">
                {cartaActual?.nombre}
              </h3>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Actual
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              {cartaActual?.horario}
            </p>
          </motion.button>

          {/* Otras cartas */}
          {todasLasCartas?.filter(c => c.id !== cartaActual?.id).map((carta) => (
            <motion.button
              key={carta.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCartaSeleccionada(carta.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                cartaSeleccionada === carta.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <h3 className="font-semibold text-neutral-800 mb-2">
                {carta.nombre}
              </h3>
              <p className="text-sm text-neutral-600">
                {carta.horario}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Carta seleccionada */}
      {cartaMostrada && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Info de la carta */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-800">
                {cartaMostrada.nombre}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <ClockIcon className="h-4 w-4" />
                <span>{cartaMostrada.horario}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`status-badge ${cartaMostrada.activa ? 'status-libre' : 'status-ocupada'}`}>
                {cartaMostrada.activa ? 'Disponible' : 'No disponible'}
              </span>
              <span className="text-sm text-neutral-600">
                {cartaMostrada.platos?.length} platos disponibles
              </span>
            </div>
          </div>

          {/* Platos agrupados por categoría */}
          {Object.entries(
            cartaMostrada.platos?.reduce((acc, plato) => {
              if (!acc[plato.categoria]) acc[plato.categoria] = []
              acc[plato.categoria].push(plato)
              return acc
            }, {}) || {}
          ).map(([categoria, platos]) => (
            <motion.div
              key={categoria}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-neutral-800 capitalize">
                {categoria}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platos.map((plato, index) => (
                  <motion.div
                    key={plato.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="card group cursor-pointer"
                  >
                    {/* Imagen del plato */}
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={plato.imagen}
                        alt={plato.nombre}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`status-badge ${obtenerColorCategoria(plato.categoria)}`}>
                          {plato.categoria}
                        </span>
                      </div>
                      {!plato.disponible && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">No disponible</span>
                        </div>
                      )}
                    </div>

                    {/* Información del plato */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-lg">
                          {plato.nombre}
                        </h4>
                        <p className="text-neutral-600 text-sm mt-1">
                          {plato.descripcion}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-neutral-500">
                          <ClockIcon className="h-4 w-4" />
                          <span>{plato.tiempoPreparacion} min</span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-800">
                            ${plato.precio.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Botón agregar */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => agregarAlCarritoHandler(plato)}
                        disabled={!plato.disponible}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          plato.disponible
                            ? 'btn-primary'
                            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {plato.disponible ? 'Agregar al carrito' : 'No disponible'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default CartaCliente
