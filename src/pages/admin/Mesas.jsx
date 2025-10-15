import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { mesasMock, usuariosMock } from '../../data/mockData'
import { 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

const MesasAdmin = () => {
  const [filtro, setFiltro] = useState('todas') // todas, libres, ocupadas, con_pedido, pendiente_pago

  // Obtener mesas
  const { data: mesas, isLoading: isLoadingMesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  // Obtener usuarios (meseros)
  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosMock,
    staleTime: 5 * 60 * 1000
  })

  const mesasFiltradas = mesas?.filter(mesa => {
    if (filtro === 'todas') return true
    return mesa.estado === filtro
  }) || []

  const obtenerEstadoMesa = (estado) => {
    switch (estado) {
      case 'libre':
        return { 
          texto: 'Libre', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
        }
      case 'ocupada':
        return { 
          texto: 'Ocupada', 
          color: 'text-primary-600', 
          bgColor: 'bg-primary-100',
          icono: UserGroupIcon 
        }
      case 'con_pedido':
        return { 
          texto: 'Con Pedido', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'pendiente_pago':
        return { 
          texto: 'Pendiente Pago', 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-100',
          icono: ExclamationTriangleIcon 
        }
      default:
        return { 
          texto: 'No disponible', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: XCircleIcon 
        }
    }
  }

  const obtenerColorUbicacion = (ubicacion) => {
    const colores = {
      interior: 'bg-blue-100 text-blue-800',
      terraza: 'bg-green-100 text-green-800',
      jardin: 'bg-purple-100 text-purple-800'
    }
    return colores[ubicacion] || 'bg-neutral-100 text-neutral-800'
  }

  const obtenerMeseroAsignado = (mesaId) => {
    return usuarios?.find(usuario => 
      usuario.rol === 'mesero' && 
      usuario.mesasAsignadas?.includes(mesaId)
    )
  }

  const calcularEstadisticas = () => {
    const total = mesas?.length || 0
    const libres = mesas?.filter(m => m.estado === 'libre').length || 0
    const ocupadas = mesas?.filter(m => m.estado === 'ocupada').length || 0
    const conPedido = mesas?.filter(m => m.estado === 'con_pedido').length || 0
    const pendientePago = mesas?.filter(m => m.estado === 'pendiente_pago').length || 0

    return { total, libres, ocupadas, conPedido, pendientePago }
  }

  const estadisticas = calcularEstadisticas()

  if (isLoadingMesas) {
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
          Gestión de Mesas
        </h1>
        <p className="text-neutral-600">
          Administra las 24 mesas del restaurante
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {[
          { 
            label: 'Total', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Libres', 
            valor: estadisticas.libres, 
            color: 'bg-green-100 text-green-800' 
          },
          { 
            label: 'Ocupadas', 
            valor: estadisticas.ocupadas, 
            color: 'bg-primary-100 text-primary-800' 
          },
          { 
            label: 'Con Pedido', 
            valor: estadisticas.conPedido, 
            color: 'bg-yellow-100 text-yellow-800' 
          },
          { 
            label: 'Pendiente Pago', 
            valor: estadisticas.pendientePago, 
            color: 'bg-orange-100 text-orange-800' 
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

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'todas', label: 'Todas' },
            { value: 'libre', label: 'Libres' },
            { value: 'ocupada', label: 'Ocupadas' },
            { value: 'con_pedido', label: 'Con Pedido' },
            { value: 'pendiente_pago', label: 'Pendiente Pago' }
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
      </motion.div>

      {/* Mapa de mesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Mapa de Mesas
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mesasFiltradas.map((mesa, index) => {
            const estado = obtenerEstadoMesa(mesa.estado)
            const EstadoIcono = estado.icono
            const mesero = obtenerMeseroAsignado(mesa.id)
            
            return (
              <motion.div
                key={mesa.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  mesa.estado === 'libre' ? 'border-green-200 bg-green-50' :
                  mesa.estado === 'ocupada' ? 'border-primary-200 bg-primary-50' :
                  mesa.estado === 'con_pedido' ? 'border-yellow-200 bg-yellow-50' :
                  mesa.estado === 'pendiente_pago' ? 'border-orange-200 bg-orange-50' :
                  'border-neutral-200 bg-neutral-50'
                }`}
              >
                {/* Número de mesa */}
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-neutral-800 mb-1">
                    {mesa.numero}
                  </div>
                  
                  {/* Estado */}
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                    <div className="flex items-center space-x-1">
                      <EstadoIcono className="h-3 w-3" />
                      <span>{estado.texto}</span>
                    </div>
                  </div>
                </div>

                {/* Información de la mesa */}
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-3 w-3" />
                    <span>{mesa.capacidad} personas</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-3 w-3" />
                    <span className="capitalize">{mesa.ubicacion}</span>
                  </div>
                  
                  {mesero && (
                    <div className="text-xs text-primary-600 font-medium">
                      {mesero.nombre}
                    </div>
                  )}
                </div>

                {/* Indicador de prioridad */}
                {mesa.estado === 'con_pedido' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">
            Leyenda:
          </h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span>Libre</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-4 w-4 text-primary-600" />
              <span>Ocupada</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4 text-yellow-600" />
              <span>Con Pedido</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
              <span>Pendiente Pago</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista detallada de mesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">
          Lista Detallada de Mesas
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Mesa</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Capacidad</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Ubicación</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Mesero</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesasFiltradas.map((mesa) => {
                const estado = obtenerEstadoMesa(mesa.estado)
                const mesero = obtenerMeseroAsignado(mesa.id)
                
                return (
                  <tr key={mesa.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-800">
                      Mesa {mesa.numero}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                        {estado.texto}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {mesa.capacidad} personas
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUbicacion(mesa.ubicacion)}`}>
                        {mesa.ubicacion}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {mesero ? mesero.nombre : 'Sin asignar'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-800 text-sm">
                          Editar
                        </button>
                        <button className="text-neutral-600 hover:text-neutral-800 text-sm">
                          Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default MesasAdmin
