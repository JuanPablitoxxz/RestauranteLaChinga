import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const FormularioAlerta = ({ isOpen, onClose, onAlertaCreada, alertaExistente = null }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: alertaExistente || {
      titulo: '',
      mensaje: '',
      tipo: 'info',
      activa: true,
      condiciones: {
        mesas_ocupadas: false,
        mesas_ocupadas_porcentaje: 80,
        ventas_diarias: false,
        ventas_diarias_monto: 10000,
        reservas_pendientes: false,
        reservas_pendientes_cantidad: 5
      }
    }
  })

  const tipoSeleccionado = watch('tipo')

  const tiposAlerta = [
    { value: 'info', label: 'Informativa', color: 'blue', descripcion: 'Información general' },
    { value: 'warning', label: 'Advertencia', color: 'yellow', descripcion: 'Situación que requiere atención' },
    { value: 'success', label: 'Éxito', color: 'green', descripcion: 'Confirmación de acción exitosa' },
    { value: 'error', label: 'Error', color: 'red', descripcion: 'Problema que requiere acción inmediata' }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Validaciones adicionales
      if (data.condiciones.mesas_ocupadas && data.condiciones.mesas_ocupadas_porcentaje < 1) {
        toast.error('El porcentaje de mesas ocupadas debe ser mayor a 0')
        setIsLoading(false)
        return
      }

      if (data.condiciones.ventas_diarias && data.condiciones.ventas_diarias_monto < 1) {
        toast.error('El monto de ventas debe ser mayor a 0')
        setIsLoading(false)
        return
      }

      if (data.condiciones.reservas_pendientes && data.condiciones.reservas_pendientes_cantidad < 1) {
        toast.error('La cantidad de reservas debe ser mayor a 0')
        setIsLoading(false)
        return
      }

      // Aquí iría la llamada a la API para crear/actualizar la alerta
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mensaje = alertaExistente ? 'Alerta actualizada exitosamente' : 'Alerta creada exitosamente'
      toast.success(mensaje)
      onAlertaCreada?.(data)
      reset()
      onClose()
    } catch (error) {
      toast.error('Error al procesar la alerta')
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-mexico-dorado-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-mexico-dorado-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                {alertaExistente ? 'Editar Alerta' : 'Crear Nueva Alerta'}
              </h2>
              <p className="text-sm text-neutral-600">
                {alertaExistente ? 'Modificar configuración de la alerta' : 'Configurar una nueva alerta del sistema'}
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
                Título de la Alerta *
              </label>
              <input
                type="text"
                {...register('titulo', {
                  required: 'El título es requerido',
                  minLength: {
                    value: 5,
                    message: 'El título debe tener al menos 5 caracteres'
                  },
                  maxLength: {
                    value: 100,
                    message: 'El título no puede exceder 100 caracteres'
                  }
                })}
                className="input-field"
                placeholder="Ej: Mesas casi llenas, Ventas altas, etc."
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mensaje *
              </label>
              <textarea
                {...register('mensaje', {
                  required: 'El mensaje es requerido',
                  minLength: {
                    value: 10,
                    message: 'El mensaje debe tener al menos 10 caracteres'
                  },
                  maxLength: {
                    value: 500,
                    message: 'El mensaje no puede exceder 500 caracteres'
                  }
                })}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe qué significa esta alerta y qué acción se debe tomar..."
              />
              {errors.mensaje && (
                <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de Alerta *
              </label>
              <select
                {...register('tipo', {
                  required: 'El tipo es requerido'
                })}
                className="input-field"
              >
                <option value="">Selecciona un tipo</option>
                {tiposAlerta.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label} - {tipo.descripcion}
                  </option>
                ))}
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>
          </div>

          {/* Condiciones de Activación */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Condiciones de Activación</h3>
            <p className="text-sm text-neutral-600">
              Configura cuándo se debe activar esta alerta
            </p>

            {/* Mesas Ocupadas */}
            <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="mesas_ocupadas"
                  {...register('condiciones.mesas_ocupadas')}
                  className="w-4 h-4 text-mexico-verde-600 bg-neutral-100 border-neutral-300 rounded focus:ring-mexico-verde-500 focus:ring-2"
                />
                <label htmlFor="mesas_ocupadas" className="text-sm font-medium text-neutral-700">
                  Alertar cuando las mesas ocupadas superen un porcentaje
                </label>
              </div>
              
              {watch('condiciones.mesas_ocupadas') && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Porcentaje de mesas ocupadas
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      {...register('condiciones.mesas_ocupadas_porcentaje', {
                        min: { value: 1, message: 'Mínimo 1%' },
                        max: { value: 100, message: 'Máximo 100%' }
                      })}
                      className="input-field w-24"
                      min="1"
                      max="100"
                    />
                    <span className="text-sm text-neutral-600">%</span>
                  </div>
                  {errors.condiciones?.mesas_ocupadas_porcentaje && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.condiciones.mesas_ocupadas_porcentaje.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Ventas Diarias */}
            <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="ventas_diarias"
                  {...register('condiciones.ventas_diarias')}
                  className="w-4 h-4 text-mexico-verde-600 bg-neutral-100 border-neutral-300 rounded focus:ring-mexico-verde-500 focus:ring-2"
                />
                <label htmlFor="ventas_diarias" className="text-sm font-medium text-neutral-700">
                  Alertar cuando las ventas diarias superen un monto
                </label>
              </div>
              
              {watch('condiciones.ventas_diarias') && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Monto mínimo de ventas
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">$</span>
                    <input
                      type="number"
                      {...register('condiciones.ventas_diarias_monto', {
                        min: { value: 1, message: 'Mínimo $1' }
                      })}
                      className="input-field w-32"
                      min="1"
                      step="0.01"
                    />
                  </div>
                  {errors.condiciones?.ventas_diarias_monto && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.condiciones.ventas_diarias_monto.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Reservas Pendientes */}
            <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="reservas_pendientes"
                  {...register('condiciones.reservas_pendientes')}
                  className="w-4 h-4 text-mexico-verde-600 bg-neutral-100 border-neutral-300 rounded focus:ring-mexico-verde-500 focus:ring-2"
                />
                <label htmlFor="reservas_pendientes" className="text-sm font-medium text-neutral-700">
                  Alertar cuando las reservas pendientes superen una cantidad
                </label>
              </div>
              
              {watch('condiciones.reservas_pendientes') && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Cantidad máxima de reservas pendientes
                  </label>
                  <input
                    type="number"
                    {...register('condiciones.reservas_pendientes_cantidad', {
                      min: { value: 1, message: 'Mínimo 1 reserva' }
                    })}
                    className="input-field w-24"
                    min="1"
                  />
                  {errors.condiciones?.reservas_pendientes_cantidad && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.condiciones.reservas_pendientes_cantidad.message}
                    </p>
                  )}
                </div>
              )}
            </div>
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
                Alerta activa (monitoreando condiciones)
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
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {alertaExistente ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                alertaExistente ? 'Actualizar Alerta' : 'Crear Alerta'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default FormularioAlerta
