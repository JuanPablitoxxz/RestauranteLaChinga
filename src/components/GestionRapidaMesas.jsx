import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  UserIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const GestionRapidaMesas = ({ mesa, onMesaActualizada, meserosDisponibles = [] }) => {
  const [isLoading, setIsLoading] = useState(false)

  const estados = [
    { value: 'libre', label: 'Libre', color: 'green', icono: CheckCircleIcon },
    { value: 'ocupada', label: 'Ocupada', color: 'red', icono: ExclamationTriangleIcon },
    { value: 'reservada', label: 'Reservada', color: 'yellow', icono: ClockIcon },
    { value: 'mantenimiento', label: 'Mantenimiento', color: 'gray', icono: XCircleIcon }
  ]

  const cambiarEstado = async (nuevoEstado) => {
    setIsLoading(true)
    
    try {
      // Aquí iría la llamada a la API para cambiar el estado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const estadoLabel = estados.find(e => e.value === nuevoEstado)?.label
      toast.success(`Mesa ${mesa.numero} cambiada a ${estadoLabel}`)
      onMesaActualizada?.({ ...mesa, estado: nuevoEstado })
    } catch (error) {
      toast.error('Error al cambiar el estado de la mesa')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const asignarMesero = async (meseroId) => {
    setIsLoading(true)
    
    try {
      // Aquí iría la llamada a la API para asignar mesero
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mesero = meserosDisponibles.find(m => m.id === meseroId)
      const mensaje = meseroId 
        ? `Mesero ${mesero?.nombre} asignado a mesa ${mesa.numero}`
        : `Mesero desasignado de mesa ${mesa.numero}`
      
      toast.success(mensaje)
      onMesaActualizada?.({ ...mesa, mesero_id: meseroId })
    } catch (error) {
      toast.error('Error al asignar mesero')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const estadoActual = estados.find(e => e.value === mesa.estado)
  const meseroAsignado = meserosDisponibles.find(m => m.id === mesa.mesero_id)

  return (
    <div className="p-4 bg-white rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-mexico-verde-600">M{mesa.numero}</span>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">
              Mesa {mesa.numero} - {mesa.capacidad} personas
            </h3>
            <p className="text-sm text-neutral-600 capitalize">{mesa.ubicacion}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          estadoActual?.color === 'green' ? 'bg-green-100 text-green-800' :
          estadoActual?.color === 'red' ? 'bg-red-100 text-red-800' :
          estadoActual?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {estadoActual?.label}
        </div>
      </div>

      {/* Cambio rápido de estado */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-700">Cambio Rápido de Estado</h4>
        <div className="grid grid-cols-2 gap-2">
          {estados.map(estado => {
            const IconoEstado = estado.icono
            const isActive = mesa.estado === estado.value
            
            return (
              <motion.button
                key={estado.value}
                onClick={() => !isActive && cambiarEstado(estado.value)}
                disabled={isLoading || isActive}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: isActive ? 1 : 0.98 }}
                className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2 ${
                  isActive 
                    ? 'bg-mexico-rojo-100 text-mexico-rojo-800 cursor-default' 
                    : `hover:bg-${estado.color}-50 hover:text-${estado.color}-800 bg-neutral-50 text-neutral-700`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <IconoEstado className="h-4 w-4" />
                <span>{estado.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Asignación de mesero */}
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-neutral-700">Asignar Mesero</h4>
        <div className="space-y-2">
          <button
            onClick={() => asignarMesero('')}
            disabled={isLoading}
            className={`w-full p-2 rounded-lg text-sm font-medium transition-colors ${
              !mesa.mesero_id 
                ? 'bg-mexico-verde-100 text-mexico-verde-800' 
                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Sin asignar
          </button>
          
          {meserosDisponibles.map(mesero => (
            <button
              key={mesero.id}
              onClick={() => asignarMesero(mesero.id)}
              disabled={isLoading}
              className={`w-full p-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                mesa.mesero_id === mesero.id 
                  ? 'bg-mexico-rojo-100 text-mexico-rojo-800' 
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{mesero.nombre} {mesero.apellido}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mesero actual */}
      {meseroAsignado && (
        <div className="mt-4 p-3 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-mexico-verde-600" />
            <div>
              <p className="text-sm font-medium text-mexico-verde-800">
                Mesero Asignado
              </p>
              <p className="text-sm text-mexico-verde-700">
                {meseroAsignado.nombre} {meseroAsignado.apellido}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-neutral-600">
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
          <span>Actualizando...</span>
        </div>
      )}
    </div>
  )
}

export default GestionRapidaMesas
