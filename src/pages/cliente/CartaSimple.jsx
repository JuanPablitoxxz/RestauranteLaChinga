import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useCarrito } from '../../components/CarritoSimple'

const CartaClienteSimple = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  
  // Context del carrito
  const { 
    items: carrito, 
    agregarItem, 
    quitarItem, 
    getCantidadItem, 
    getTotalItems, 
    getTotalPrecio 
  } = useCarrito()

  console.log('🍽️ Carta Simple - carrito recibido:', carrito)
  console.log('🍽️ Carta Simple - número de items:', carrito?.length || 0)
  
  // Datos mock de platos (simplificados)
  const platosMock = [
    {
      id: 1,
      nombre: 'Chilaquiles Rojos',
      descripcion: 'Tortillas fritas con salsa roja, crema, queso y cebolla',
      precio: 85.00,
      categoria: 'desayuno',
      imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 2,
      nombre: 'Huevos Rancheros',
      descripcion: 'Huevos estrellados sobre tortillas con salsa ranchera',
      precio: 75.00,
      categoria: 'desayuno',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 3,
      nombre: 'Pozole Rojo',
      descripcion: 'Pozole tradicional con carne de cerdo y especias',
      precio: 120.00,
      categoria: 'almuerzo',
      imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 4,
      nombre: 'Tacos de Pastor',
      descripcion: 'Tacos al pastor con piña, cebolla y cilantro',
      precio: 80.00,
      categoria: 'almuerzo',
      imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 5,
      nombre: 'Café de Olla',
      descripcion: 'Café tradicional de olla con piloncillo y canela',
      precio: 35.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 6,
      nombre: 'Agua de Horchata',
      descripcion: 'Agua de horchata tradicional con canela',
      precio: 30.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      disponible: true
    }
  ]

  const categorias = [
    { value: 'todas', label: 'Todas' },
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'bebida', label: 'Bebidas' }
  ]

  const platosFiltrados = platosMock.filter(plato => {
    const coincideCategoria = filtroCategoria === 'todas' || plato.categoria === filtroCategoria
    const coincideBusqueda = plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            plato.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda && plato.disponible
  })

  const agregarAlCarrito = (plato) => {
    agregarItem(plato)
    toast.success(`${plato.nombre} agregado al carrito`)
  }

  const quitarDelCarrito = (plato) => {
    quitarItem(plato.id)
    toast.success(`${plato.nombre} quitado del carrito`)
  }

  const notificarMesero = () => {
    toast.success('Notificación enviada al mesero')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
          NUESTRA CARTA MX
        </h1>
        <p className="text-neutral-600">
          Descubre los sabores auténticos de México
        </p>
      </motion.div>

      {/* Información del menú actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-mexico-verde-50 border border-mexico-verde-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-mexico-verde-600" />
            <div>
              <p className="text-sm font-medium text-mexico-verde-800">
                Menú actual: Bebidas Matutinas
              </p>
              <p className="text-xs text-mexico-verde-700">
                Hora: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar platos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filtro de categoría */}
          <div className="md:w-48">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="input-field"
            >
              {categorias.map(categoria => (
                <option key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón de notificación */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={notificarMesero}
            className="btn-primary flex items-center space-x-2"
          >
            <BellIcon className="h-4 w-4" />
            <span>Notificar al Mesero</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Grid de Platos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {platosFiltrados.map(plato => (
          <motion.div
            key={plato.id}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow"
          >
            {/* Imagen del plato */}
            <div className="h-48 bg-neutral-200 relative overflow-hidden">
              <img
                src={plato.imagen}
                alt={plato.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'
                }}
              />
              <div className="absolute top-2 right-2">
                <span className="bg-mexico-verde-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {plato.categoria}
                </span>
              </div>
            </div>

            {/* Contenido del plato */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {plato.nombre}
              </h3>
              <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                {plato.descripcion}
              </p>
              
              {/* Precio y controles */}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-mexico-rojo-600">
                  ${plato.precio.toFixed(2)}
                </span>
                
                <div className="flex items-center space-x-2">
                  {getCantidadItem(plato.id) > 0 ? (
                    <>
                      <button
                        onClick={() => quitarDelCarrito(plato)}
                        className="p-1 rounded-full bg-mexico-rojo-100 text-mexico-rojo-600 hover:bg-mexico-rojo-200 transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-neutral-700 min-w-[20px] text-center">
                        {getCantidadItem(plato.id)}
                      </span>
                      <button
                        onClick={() => agregarAlCarrito(plato)}
                        className="p-1 rounded-full bg-mexico-verde-100 text-mexico-verde-600 hover:bg-mexico-verde-200 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => agregarAlCarrito(plato)}
                      className="btn-primary text-sm flex items-center space-x-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Agregar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mensaje si no hay platos */}
      {platosFiltrados.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-neutral-500">
            <p className="text-lg mb-2">No se encontraron platos</p>
            <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
          </div>
        </motion.div>
      )}

      {/* Resumen del carrito */}
      {getTotalItems() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4 z-50"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-5 w-5 text-mexico-verde-600" />
              <span className="text-sm font-medium text-neutral-700">
                {getTotalItems()} items
              </span>
            </div>
            <div className="text-sm font-bold text-mexico-rojo-600">
              Total: ${getTotalPrecio().toFixed(2)}
            </div>
            <button
              onClick={() => navigate('/cliente/pedido')}
              className="btn-primary text-sm"
            >
              Ver Pedido
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CartaClienteSimple
