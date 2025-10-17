import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [rolSeleccionado, setRolSeleccionado] = useState('cliente')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const roles = [
    { value: 'cliente', label: 'Cliente', descripcion: 'Ver carta y hacer pedidos' },
    { value: 'mesero', label: 'Mesero', descripcion: 'Gestionar mesas y pedidos' },
    { value: 'cajero', label: 'Cajero', descripcion: 'Gestionar cobros y reportes' },
    { value: 'admin', label: 'Administrador', descripcion: 'Gestión completa del sistema' },
    { value: 'cocina', label: 'Jefe de Cocina', descripcion: 'Gestionar pedidos de cocina' }
  ]


  const onSubmit = async (data) => {
    try {
      const resultado = await login(data.email, data.password, rolSeleccionado)
      
      if (resultado.success) {
        toast.success(`¡Bienvenido, ${resultado.usuario.nombre}!`)
        navigate('/')
      } else {
        toast.error(resultado.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-primary-800 rounded-full flex items-center justify-center mb-4"
          >
            <span className="text-white text-2xl font-bold">LC</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-mexico-rojo-600 font-mexico"
          >
            🇲🇽 La Chinga
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-neutral-600"
          >
            Inicia sesión en tu cuenta
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selector de rol */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Selecciona tu rol
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((rol) => (
                  <motion.button
                    key={rol.value}
                    type="button"
                    onClick={() => setRolSeleccionado(rol.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      rolSeleccionado === rol.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-medium text-neutral-800">{rol.label}</div>
                    <div className="text-sm text-neutral-500">{rol.descripcion}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Correo electrónico
              </label>
              <input
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="input-field mt-1"
                placeholder="tu@email.com"
                autoComplete="username"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  type={mostrarPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {mostrarPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>


            {/* Botón de envío */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-neutral-500"
        >
          <p>© 2024 La Chinga - Restaurante Mexicano. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
