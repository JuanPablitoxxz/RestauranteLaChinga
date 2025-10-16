import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useMenuDinamico } from '../../hooks/useMenuDinamico'
import { useCarrito } from '../../components/CarritoSimple'

const CartaCliente = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
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
  
  // Hook para menús dinámicos
  const { menuActual, horaActual, obtenerNombreMenu, obtenerProximoMenu, esHorarioValido } = useMenuDinamico()

  // Datos mock de platos
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
      descripcion: 'Huevos estrellados con salsa ranchera, frijoles y tortillas',
      precio: 75.00,
      categoria: 'desayuno',
      imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 3,
      nombre: 'Enchiladas Verdes',
      descripcion: 'Tortillas rellenas de pollo con salsa verde y crema',
      precio: 120.00,
      categoria: 'almuerzo',
      imagen: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 4,
      nombre: 'Tacos al Pastor',
      descripcion: 'Tacos de cerdo marinado con piña y cebolla',
      precio: 95.00,
      categoria: 'almuerzo',
      imagen: 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 5,
      nombre: 'Mole Poblano',
      descripcion: 'Pollo en mole poblano con arroz y frijoles',
      precio: 150.00,
      categoria: 'cena',
      imagen: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 6,
      nombre: 'Carnitas',
      descripcion: 'Carne de cerdo cocida lentamente con tortillas',
      precio: 130.00,
      categoria: 'cena',
      imagen: 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 7,
      nombre: 'Agua de Horchata',
      descripcion: 'Bebida refrescante de arroz con canela',
      precio: 35.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 8,
      nombre: 'Margarita Clásica',
      descripcion: 'Coctel de tequila con limón y sal',
      precio: 85.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      disponible: true
    }
  ]

  const { data: platos, isLoading } = useQuery({
    queryKey: ['platos'],
    queryFn: () => platosMock,
    staleTime: 5 * 60 * 1000
  })

  const categorias = [
    { value: 'todas', label: 'Todas' },
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'cena', label: 'Cena' },
    { value: 'bebida', label: 'Bebidas' }
  ]

  const platosFiltrados = platos?.filter(plato => {
    // Filtrar por menú actual si está disponible
    const coincideMenu = !menuActual || plato.categoria === menuActual
    const coincideCategoria = filtroCategoria === 'todas' || plato.categoria === filtroCategoria
    const coincideBusqueda = plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            plato.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideMenu && coincideCategoria && coincideBusqueda && plato.disponible
  }) || []

  const agregarAlCarrito = (plato) => {
    agregarItem(plato)
    toast.success(`${plato.nombre} agregado al carrito`)
  }

  const quitarDelCarrito = (platoId) => {
    quitarItem(platoId)
  }

  const cantidadEnCarrito = (platoId) => {
    return getCantidadItem(platoId)
  }

  const totalCarrito = getTotalPrecio()

  const notificarMesero = () => {
    toast.success('Notificación enviada al mesero')
    setMostrarNotificacion(false)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
          Nuestra Carta 🇲🇽
        </h1>
        <p className="text-neutral-600">
          Descubre los sabores auténticos de México
        </p>
        
        {/* Información del menú actual */}
        <div className="mt-4">
          {esHorarioValido ? (
            <div className="bg-mexico-verde-50 border border-mexico-verde-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-mexico-verde-600" />
                <div>
                  <p className="text-sm font-medium text-mexico-verde-800">
                    Menú actual: {obtenerNombreMenu(menuActual)}
                  </p>
                  <p className="text-xs text-mexico-verde-700">
                    Hora: {horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Fuera del horario de servicio
                  </p>
                  <p className="text-xs text-yellow-700">
                    Próximo menú: {obtenerProximoMenu().menu} a las {obtenerProximoMenu().hora}
                  </p>
                </div>
              </div>
            </div>
          )}
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

          {/* Filtro de categorías */}
          <div className="md:w-64">
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

        {/* Botón de notificación al mesero */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMostrarNotificacion(true)}
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
                <span className="bg-mexico-verde-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ${plato.precio}
                </span>
              </div>
            </div>

            {/* Información del plato */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {plato.nombre}
              </h3>
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {plato.descripcion}
              </p>

              {/* Controles del carrito */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {cantidadEnCarrito(plato.id) > 0 && (
                    <>
                      <button
                        onClick={() => quitarDelCarrito(plato.id)}
                        className="p-1 text-mexico-rojo-600 hover:text-mexico-rojo-800 hover:bg-mexico-rojo-50 rounded transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-neutral-700 min-w-[20px] text-center">
                        {cantidadEnCarrito(plato.id)}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => agregarAlCarrito(plato)}
                    className="p-1 text-mexico-verde-600 hover:text-mexico-verde-800 hover:bg-mexico-verde-50 rounded transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <span className="text-lg font-bold text-mexico-rojo-600">
                  ${plato.precio}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Carrito flotante */}
      {getTotalItems() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 max-w-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-neutral-800">Mi Pedido</h3>
            <div className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-5 w-5 text-mexico-verde-600" />
              <span className="text-sm font-medium text-mexico-verde-600">
                {getTotalItems()} items
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
            {carrito.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700 truncate">{item.nombre}</span>
                <span className="text-neutral-600">x{item.cantidad}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-neutral-800">Total:</span>
              <span className="text-lg font-bold text-mexico-rojo-600">
                ${totalCarrito.toFixed(2)}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/cliente/pedido')}
              className="w-full btn-primary text-sm"
            >
              Ver Mi Pedido
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Modal de Notificación al Mesero */}
      {mostrarNotificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-mexico-dorado-100 rounded-lg flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-mexico-dorado-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">
                  Notificar al Mesero
                </h3>
                <p className="text-sm text-neutral-600">
                  Envía una notificación al mesero asignado
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tipo de consulta
                </label>
                <select className="input-field">
                  <option value="pregunta">Pregunta sobre un plato</option>
                  <option value="especial">Solicitud especial</option>
                  <option value="servicio">Solicitud de servicio</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Describe tu consulta o solicitud..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setMostrarNotificacion(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={notificarMesero}
                className="btn-primary"
              >
                Enviar Notificación
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default CartaCliente