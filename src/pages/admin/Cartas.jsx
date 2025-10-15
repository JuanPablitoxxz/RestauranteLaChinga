import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { cartasMock } from '../../data/mockData'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const CartasAdmin = () => {
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [accionModal, setAccionModal] = useState('ver') // ver, editar, crear

  // Obtener cartas
  const { data: cartas, isLoading: isLoadingCartas } = useQuery({
    queryKey: ['cartas'],
    queryFn: () => Object.values(cartasMock),
    staleTime: 5 * 60 * 1000
  })

  const obtenerEstadoCarta = (activa) => {
    if (activa) {
      return { 
        texto: 'Activa', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        icono: CheckCircleIcon 
      }
    } else {
      return { 
        texto: 'Inactiva', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        icono: XCircleIcon 
      }
    }
  }

  const calcularEstadisticas = () => {
    const total = cartas?.length || 0
    const activas = cartas?.filter(c => c.activa).length || 0
    const inactivas = cartas?.filter(c => !c.activa).length || 0
    const totalPlatos = cartas?.reduce((sum, c) => sum + (c.platos?.length || 0), 0) || 0

    return { total, activas, inactivas, totalPlatos }
  }

  const estadisticas = calcularEstadisticas()

  if (isLoadingCartas) {
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
          Gestión de Cartas
        </h1>
        <p className="text-neutral-600">
          Administra las cartas y platos del restaurante
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
            label: 'Total Cartas', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Activas', 
            valor: estadisticas.activas, 
            color: 'bg-green-100 text-green-800' 
          },
          { 
            label: 'Inactivas', 
            valor: estadisticas.inactivas, 
            color: 'bg-red-100 text-red-800' 
          },
          { 
            label: 'Total Platos', 
            valor: estadisticas.totalPlatos, 
            color: 'bg-purple-100 text-purple-800' 
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

      {/* Botón crear carta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setAccionModal('crear')
            setCartaSeleccionada(null)
            setMostrarModal(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nueva Carta</span>
        </motion.button>
      </motion.div>

      {/* Lista de cartas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {cartas?.map((carta, index) => {
          const estado = obtenerEstadoCarta(carta.activa)
          const EstadoIcono = estado.icono
          
          return (
            <motion.div
              key={carta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-800">
                      {carta.nombre.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 text-lg">
                      {carta.nombre}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {carta.horario}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
                    <div className="flex items-center space-x-2">
                      <EstadoIcono className="h-4 w-4" />
                      <span>{estado.texto}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAccionModal('ver')
                        setCartaSeleccionada(carta)
                        setMostrarModal(true)
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAccionModal('editar')
                        setCartaSeleccionada(carta)
                        setMostrarModal(true)
                      }}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      title="Editar carta"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Eliminar carta"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Información de la carta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Información General</h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>Horario: {carta.horario}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>ID: {carta.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Platos</h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div>Total: {carta.platos?.length || 0} platos</div>
                    <div>Disponibles: {carta.platos?.filter(p => p.disponible).length || 0}</div>
                    <div>No disponibles: {carta.platos?.filter(p => !p.disponible).length || 0}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Categorías</h4>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(carta.platos?.map(p => p.categoria))].map((categoria) => (
                      <span key={categoria} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de platos */}
              <div>
                <h4 className="font-medium text-neutral-800 mb-3">Platos de la Carta</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {carta.platos?.slice(0, 6).map((plato, platoIndex) => (
                    <div key={plato.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-neutral-800 text-sm">
                          {plato.nombre}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          plato.disponible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {plato.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600">
                        <div>Precio: ${plato.precio.toLocaleString()}</div>
                        <div>Tiempo: {plato.tiempoPreparacion} min</div>
                        <div className="capitalize">{plato.categoria}</div>
                      </div>
                    </div>
                  ))}
                  {carta.platos?.length > 6 && (
                    <div className="p-3 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-neutral-600">
                        +{carta.platos.length - 6} platos más
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modal de carta */}
      {mostrarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              {accionModal === 'crear' ? 'Crear Nueva Carta' :
               accionModal === 'editar' ? 'Editar Carta' :
               'Detalles de la Carta'}
            </h3>

            {accionModal === 'ver' && cartaSeleccionada ? (
              <div className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3">Información General</h4>
                    <div className="space-y-2 text-sm text-neutral-600">
                      <div><strong>Nombre:</strong> {cartaSeleccionada.nombre}</div>
                      <div><strong>Horario:</strong> {cartaSeleccionada.horario}</div>
                      <div><strong>ID:</strong> {cartaSeleccionada.id}</div>
                      <div><strong>Estado:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          cartaSeleccionada.activa 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cartaSeleccionada.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3">Estadísticas</h4>
                    <div className="space-y-2 text-sm text-neutral-600">
                      <div><strong>Total platos:</strong> {cartaSeleccionada.platos?.length || 0}</div>
                      <div><strong>Disponibles:</strong> {cartaSeleccionada.platos?.filter(p => p.disponible).length || 0}</div>
                      <div><strong>No disponibles:</strong> {cartaSeleccionada.platos?.filter(p => !p.disponible).length || 0}</div>
                      <div><strong>Categorías:</strong> {[...new Set(cartaSeleccionada.platos?.map(p => p.categoria))].length}</div>
                    </div>
                  </div>
                </div>

                {/* Lista completa de platos */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Todos los Platos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cartaSeleccionada.platos?.map((plato) => (
                      <div key={plato.id} className="p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-neutral-800">{plato.nombre}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plato.disponible 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {plato.disponible ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{plato.descripcion}</p>
                        <div className="flex justify-between text-sm text-neutral-600">
                          <span>Precio: ${plato.precio.toLocaleString()}</span>
                          <span>Tiempo: {plato.tiempoPreparacion} min</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 capitalize">
                          Categoría: {plato.categoria}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-600">
                  {accionModal === 'crear' 
                    ? 'Formulario para crear nueva carta'
                    : 'Formulario para editar carta'
                  }
                </p>
                <p className="text-sm text-neutral-500">
                  Esta funcionalidad se implementaría con un formulario completo
                  para crear/editar cartas y platos con validaciones.
                </p>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CartasAdmin
