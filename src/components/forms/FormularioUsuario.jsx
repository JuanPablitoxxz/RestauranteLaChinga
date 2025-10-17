import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const FormularioUsuario = ({ isOpen, onClose, onUsuarioCreado }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  const rolSeleccionado = watch('rol')

  const roles = [
    { value: 'admin', label: 'Administrador', descripcion: 'Acceso completo al sistema' },
    { value: 'mesero', label: 'Mesero', descripcion: 'Gestionar mesas y pedidos' },
    { value: 'cajero', label: 'Cajero', descripcion: 'Gestionar cobros y reportes' },
    { value: 'cocina', label: 'Jefe de Cocina', descripcion: 'Gestionar pedidos de cocina' },
    { value: 'cliente', label: 'Cliente', descripcion: 'Acceso a carta y reservas' }
  ]

  const turnos = [
    { value: '7-15', label: 'Matutino (7:00 - 15:00)' },
    { value: '15-23', label: 'Vespertino (15:00 - 23:00)' }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Preparar datos para Supabase
      const usuarioData = {
        email: data.email,
        password_hash: `hash_${data.password}_${Date.now()}`,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        telefono: data.telefono || null,
        turno: data.turno || null,
        activo: true,
        es_temporal: false
      }

      // Insertar usuario en Supabase
      const { data: usuarioInsertado, error } = await supabase
        .from('usuarios')
        .insert([usuarioData])
        .select()
        .single()

      if (error) {
        console.error('Error al crear usuario:', error)
        toast.error('Error al crear el usuario en la base de datos')
        return
      }

      toast.success(`Usuario ${data.nombre} ${data.apellido} creado exitosamente`)
      onUsuarioCreado?.(usuarioInsertado)
      reset()
      onClose()
    } catch (error) {
      toast.error('Error al crear el usuario')
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
            <div className="w-10 h-10 bg-mexico-rojo-100 rounded-lg flex items-center justify-center">
              <UserPlusIcon className="h-6 w-6 text-mexico-rojo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Crear Nuevo Usuario</h2>
              <p className="text-sm text-neutral-600">Agregar un nuevo miembro al equipo</p>
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
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  {...register('nombre', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Solo se permiten letras y espacios'
                    }
                  })}
                  className="input-field"
                  placeholder="Ej: Juan"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  {...register('apellido', {
                    required: 'El apellido es requerido',
                    minLength: {
                      value: 2,
                      message: 'El apellido debe tener al menos 2 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Solo se permiten letras y espacios'
                    }
                  })}
                  className="input-field"
                  placeholder="Ej: Pérez"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un email válido'
                  }
                })}
                className="input-field"
                placeholder="Ej: usuario@lachinga.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono', {
                  pattern: {
                    value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                    message: 'Ingresa un teléfono válido'
                  }
                })}
                className="input-field"
                placeholder="Ej: +52 55 1234 5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Información Laboral</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rol *
              </label>
              <select
                {...register('rol', {
                  required: 'El rol es requerido'
                })}
                className="input-field"
              >
                <option value="">Selecciona un rol</option>
                {roles.map(rol => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label} - {rol.descripcion}
                  </option>
                ))}
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
              )}
            </div>

            {rolSeleccionado && rolSeleccionado !== 'cliente' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Turno *
                </label>
                <select
                  {...register('turno', {
                    required: rolSeleccionado !== 'cliente' ? 'El turno es requerido' : false
                  })}
                  className="input-field"
                >
                  <option value="">Selecciona un turno</option>
                  {turnos.map(turno => (
                    <option key={turno.value} value={turno.value}>
                      {turno.label}
                    </option>
                  ))}
                </select>
                {errors.turno && (
                  <p className="mt-1 text-sm text-red-600">{errors.turno.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contraseña Temporal *
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                  }
                })}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
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
                  Creando...
                </div>
              ) : (
                'Crear Usuario'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default FormularioUsuario
