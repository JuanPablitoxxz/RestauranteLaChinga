import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth, supabase } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      usuario: null,
      token: null,
      rol: null,
      turno: 'mañana', // 'mañana' o 'tarde'
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      login: async (email, password, rol) => {
        set({ isLoading: true })
        
        try {
          console.log('🔍 Intentando login con:', { email, rol })
          
          // Buscar usuario en Supabase
          const { data: usuarioData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single()

          if (userError) {
            console.error('Error al buscar usuario:', userError)
            set({ isLoading: false })
            return { success: false, error: `Error al buscar usuario: ${userError.message}` }
          }

          if (!usuarioData) {
            console.error('Usuario no encontrado:', email)
            set({ isLoading: false })
            return { success: false, error: 'Usuario no encontrado en la base de datos' }
          }

          // Verificar contraseña (comparar con password_hash)
          const passwordValida = usuarioData.password_hash === password
          
          if (!passwordValida) {
            console.error('Contraseña incorrecta para:', email)
            set({ isLoading: false })
            return { success: false, error: 'Contraseña incorrecta' }
          }

          // Verificar que el rol coincida
          if (usuarioData.rol !== rol) {
            set({ isLoading: false })
            return { success: false, error: 'Rol incorrecto' }
          }

          // Login exitoso
          console.log(`✅ Login exitoso para ${rol}`)
          
          set({
            usuario: usuarioData,
            token: `supabase-token-${usuarioData.id}`,
            rol: usuarioData.rol,
            turno: usuarioData.turno || 'mañana',
            isAuthenticated: true,
            isLoading: false
          })
          
          return { success: true, usuario: usuarioData }
          
        } catch (error) {
          console.error('Error en login:', error)
          set({ isLoading: false })
          return { success: false, error: 'Error interno del sistema' }
        }
      },

      logout: () => {
        console.log('🔪 Cerrando sesión...')
        set({
          usuario: null,
          token: null,
          rol: null,
          turno: 'mañana',
          isAuthenticated: false,
          isLoading: false
        })
      },

      // Verificar si el usuario está autenticado
      verificarAutenticacion: () => {
        const { isAuthenticated, usuario } = get()
        return isAuthenticated && usuario !== null
      },

      // Obtener información del usuario actual
      obtenerUsuario: () => {
        return get().usuario
      },

      // Cambiar turno
      cambiarTurno: (nuevoTurno) => {
        set({ turno: nuevoTurno })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        rol: state.rol,
        turno: state.turno,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)