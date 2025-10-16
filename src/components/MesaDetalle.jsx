import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  XMarkIcon, 
  UserIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const MesaDetalle = ({ mesa, isOpen, onClose, onMesaActualizada, meserosDisponibles = [] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      estado: mesa?.estado || 'libre',
      mesero_id: mesa?.mesero_id || '',
      observaciones: mesa?.observaciones || ''
    }
  })

  const estadoSeleccionado = watch('estado')

  const estados = [
    { value: 'libre', label: 'Libre', color: 'green', descripcion: 'Mesa disponible' },
    { value: 'ocupada', label: 'Ocupada', color: 'red', descripcion: 'Mesa en uso' },
    { value: 'reservada', label: 'Reservada', color: 'yellow', descripcion: 'Mesa reservada' },
    { value: 'mantenimiento', label: 'Mantenimiento', color: 'gray', descripcion: 'Mesa en reparación' }
  ]

  // Datos mock para el consumo de la mesa
  const consumoMesa = {
    totalHoy: 1250.00,
    totalSemana: 8750.00,
    totalMes: 32500.00,
    pedidosHoy: 8,
    promedioPorPedido: 156.25,
    ultimoPedido: '2024-01-15 14:30',
    clienteFrecuente: 'Ana García',
    platoFavorito: 'Mole Poblano'
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Aquí iría la llamada a la API para actualizar la mesa
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Mesa actualizada exitosamente')
      onMesaActualizada?.(data)
      setMostrarFormulario(false)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar la mesa')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !mesa) return null

  const estadoActual = estados.find(e => e.value === mesa.estado)
  const meseroAsignado = meserosDisponibles.find(m => m.id === mesa.mesero_id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-mexico-verde-600">M{mesa.numero}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                Mesa {mesa.numero} - {mesa.capacidad} personas
              </h2>
              <p className="text-sm text-neutral-600">
                {mesa.ubicacion} • Estado: {estadoActual?.label}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Editar mesa"
            >
              <PencilIcon className="h-5 w-5 text-neutral-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado Actual */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800">Estado Actual</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    estadoActual?.color === 'green' ? 'bg-green-100 text-green-800' :
                    estadoActual?.color === 'red' ? 'bg-red-100 text-red-800' :
                    estadoActual?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {estadoActual?.label}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Mesero Asignado:</span>
                  <span className="text-sm text-neutral-600">
                    {meseroAsignado ? `${meseroAsignado.nombre} ${meseroAsignado.apellido}` : 'Sin asignar'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Capacidad:</span>
                  <span className="text-sm text-neutral-600">{mesa.capacidad} personas</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Ubicación:</span>
                  <span className="text-sm text-neutral-600 capitalize">{mesa.ubicacion}</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de Consumo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800">Estadísticas de Consumo</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-mexico-verde-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-mexico-verde-600" />
                    <span className="text-sm font-medium text-mexico-verde-800">Ventas Hoy:</span>
                  </div>
                  <span className="text-sm font-bold text-mexico-verde-800">
                    ${consumoMesa.totalHoy.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-mexico-dorado-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-mexico-dorado-600" />
                    <span className="text-sm font-medium text-mexico-dorado-800">Ventas Semana:</span>
                  </div>
                  <span className="text-sm font-bold text-mexico-dorado-800">
                    ${consumoMesa.totalSemana.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-mexico-tierra-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-mexico-tierra-600" />
                    <span className="text-sm font-medium text-mexico-tierra-800">Pedidos Hoy:</span>
                  </div>
                  <span className="text-sm font-bold text-mexico-tierra-800">
                    {consumoMesa.pedidosHoy}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-mexico-rojo-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-mexico-rojo-600" />
                    <span className="text-sm font-medium text-mexico-rojo-800">Último Pedido:</span>
                  </div>
                  <span className="text-sm font-bold text-mexico-rojo-800">
                    {consumoMesa.ultimoPedido}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Promedio por Pedido</h4>
              <p className="text-lg font-bold text-neutral-800">
                ${consumoMesa.promedioPorPedido.toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Cliente Frecuente</h4>
              <p className="text-sm font-medium text-neutral-800">{consumoMesa.clienteFrecuente}</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Plato Favorito</h4>
              <p className="text-sm font-medium text-neutral-800">{consumoMesa.platoFavorito}</p>
            </div>
          </div>

          {/* Formulario de Edición */}
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-neutral-200 pt-6"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Editar Mesa</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Estado *
                    </label>
                    <select
                      {...register('estado', {
                        required: 'El estado es requerido'
                      })}
                      className="input-field"
                    >
                      {estados.map(estado => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label} - {estado.descripcion}
                        </option>
                      ))}
                    </select>
                    {errors.estado && (
                      <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mesero Asignado
                    </label>
                    <select
                      {...register('mesero_id')}
                      className="input-field"
                    >
                      <option value="">Sin asignar</option>
                      {meserosDisponibles.map(mesero => (
                        <option key={mesero.id} value={mesero.id}>
                          {mesero.nombre} {mesero.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    {...register('observaciones')}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Notas adicionales sobre la mesa..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Actualizando...
                      </div>
                    ) : (
                      'Actualizar Mesa'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MesaDetalle
