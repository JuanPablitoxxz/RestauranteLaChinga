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

const MesasAdminSimple = () => {
  const [filtro, setFiltro] = useState('todas')

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
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: ExclamationTriangleIcon 
        }
      case 'reservada':
        return { 
          texto: 'Reservada', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'mantenimiento':
        return { 
          texto: 'Mantenimiento', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          icono: XCircleIcon 
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

  const meseros = usuarios?.filter(user => user.rol === 'mesero') || []

  if (isLoadingMesas) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg"></div>
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
          Gestión de Mesas 🇲🇽
        </h1>
        <p className="text-neutral-600">
          Administra las 24 mesas del restaurante y asigna meseros
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'todas', label: 'Todas', count: mesas?.length || 0 },
            { value: 'libre', label: 'Libres', count: mesas?.filter(m => m.estado === 'libre').length || 0 },
            { value: 'ocupada', label: 'Ocupadas', count: mesas?.filter(m => m.estado === 'ocupada').length || 0 },
            { value: 'reservada', label: 'Reservadas', count: mesas?.filter(m => m.estado === 'reservada').length || 0 },
            { value: 'mantenimiento', label: 'Mantenimiento', count: mesas?.filter(m => m.estado === 'mantenimiento').length || 0 }
          ].map(filtroOption => (
            <button
              key={filtroOption.value}
              onClick={() => setFiltro(filtroOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === filtroOption.value
                  ? 'bg-mexico-rojo-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filtroOption.label} ({filtroOption.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid de Mesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {mesasFiltradas.map(mesa => {
          const estado = obtenerEstadoMesa(mesa.estado)
          const EstadoIcono = estado.icono
          const mesero = meseros.find(m => m.id === mesa.mesero_id)

          return (
            <motion.div
              key={mesa.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                mesa.estado === 'libre' ? 'border-green-200 bg-green-50' :
                mesa.estado === 'ocupada' ? 'border-red-200 bg-red-50' :
                mesa.estado === 'reservada' ? 'border-yellow-200 bg-yellow-50' :
                mesa.estado === 'mantenimiento' ? 'border-gray-200 bg-gray-50' :
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
                  <div className="text-xs text-mexico-rojo-600 font-medium">
                    {mesero.nombre}
                  </div>
                )}
              </div>

              {/* Indicador de prioridad */}
              {mesa.estado === 'ocupada' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Mesas Libres</p>
              <p className="text-2xl font-bold text-green-900">
                {mesas?.filter(m => m.estado === 'libre').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Mesas Ocupadas</p>
              <p className="text-2xl font-bold text-red-900">
                {mesas?.filter(m => m.estado === 'ocupada').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Reservadas</p>
              <p className="text-2xl font-bold text-yellow-900">
                {mesas?.filter(m => m.estado === 'reservada').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Mantenimiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {mesas?.filter(m => m.estado === 'mantenimiento').length || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MesasAdminSimple
