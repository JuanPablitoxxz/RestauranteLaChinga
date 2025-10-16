import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { XMarkIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const FormularioCarta = ({ isOpen, onClose, onCartaCreada, cartaExistente = null }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: cartaExistente || {
      nombre: '',
      descripcion: '',
      horario_inicio: '',
      horario_fin: '',
      activa: true
    }
  })

  const horarioInicio = watch('horario_inicio')
  const horarioFin = watch('horario_fin')

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Validar que el horario de inicio sea menor al de fin
      if (data.horario_inicio >= data.horario_fin) {
        toast.error('El horario de inicio debe ser menor al horario de fin')
        setIsLoading(false)
        return
      }

      // Aquí iría la llamada a la API para crear/actualizar la carta
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mensaje = cartaExistente ? 'Carta actualizada exitosamente' : 'Carta creada exitosamente'
      toast.success(mensaje)
      onCartaCreada?.(data)
      reset()
      onClose()
    } catch (error) {
      toast.error('Error al procesar la carta')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
              <DocumentPlusIcon className="h-6 w-6 text-mexico-verde-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                {cartaExistente ? 'Editar Carta' : 'Crear Nueva Carta'}
              </h2>
              <p className="text-sm text-neutral-600">
                {cartaExistente ? 'Modificar información de la carta' : 'Agregar una nueva carta al menú'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-neutral-600" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre de la Carta *
              </label>
              <input
                type="text"
                {...register('nombre', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres'
                  },
                  maxLength: {
                    value: 100,
                    message: 'El nombre no puede exceder 100 caracteres'
                  }
                })}
                className="input-field"
                placeholder="Ej: Desayuno, Almuerzo, Cena"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Descripción
              </label>
              <textarea
                {...register('descripcion', {
                  maxLength: {
                    value: 500,
                    message: 'La descripción no puede exceder 500 caracteres'
                  }
                })}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe brevemente qué incluye esta carta..."
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Horarios de Disponibilidad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Horario de Inicio *
                </label>
                <input
                  type="time"
                  {...register('horario_inicio', {
                    required: 'El horario de inicio es requerido'
                  })}
                  className="input-field"
                />
                {errors.horario_inicio && (
                  <p className="mt-1 text-sm text-red-600">{errors.horario_inicio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Horario de Fin *
                </label>
                <input
                  type="time"
                  {...register('horario_fin', {
                    required: 'El horario de fin es requerido',
                    validate: (value) => {
                      if (horarioInicio && value <= horarioInicio) {
                        return 'El horario de fin debe ser mayor al de inicio'
                      }
                      return true
                    }
                  })}
                  className="input-field"
                />
                {errors.horario_fin && (
                  <p className="mt-1 text-sm text-red-600">{errors.horario_fin.message}</p>
                )}
              </div>
            </div>

            {/* Validación visual de horarios */}
            {horarioInicio && horarioFin && (
              <div className={`p-3 rounded-lg ${
                horarioInicio < horarioFin 
                  ? 'bg-mexico-verde-50 border border-mexico-verde-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  horarioInicio < horarioFin 
                    ? 'text-mexico-verde-800' 
                    : 'text-red-800'
                }`}>
                  {horarioInicio < horarioFin 
                    ? `✅ Carta disponible de ${horarioInicio} a ${horarioFin}` 
                    : `❌ El horario de fin debe ser mayor al de inicio`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Estado</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="activa"
                {...register('activa')}
                className="w-4 h-4 text-mexico-verde-600 bg-neutral-100 border-neutral-300 rounded focus:ring-mexico-verde-500 focus:ring-2"
              />
              <label htmlFor="activa" className="text-sm font-medium text-neutral-700">
                Carta activa (disponible para los clientes)
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {cartaExistente ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                cartaExistente ? 'Actualizar Carta' : 'Crear Carta'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default FormularioCarta
