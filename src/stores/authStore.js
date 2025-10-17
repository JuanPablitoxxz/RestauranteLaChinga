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
          
          // TEMPORAL: Usar datos mock para usuarios de prueba mientras se arregla Supabase
          const usuariosMock = {
            'admin@lachinga.com': {
              password: 'admin123',
              usuario: {
                id: 'admin-001',
                email: 'admin@lachinga.com',
                nombre: 'Administrador',
                apellido: 'La Chinga',
                rol: 'admin',
                telefono: '+52 55 1234 5678',
                turno: 'mañana',
                activo: true,
                es_temporal: false
              }
            },
            'mesero@lachinga.com': {
              password: 'mesero123',
              usuario: {
                id: 'mesero-001',
                email: 'mesero@lachinga.com',
                nombre: 'Pedro',
                apellido: 'González',
                rol: 'mesero',
                telefono: '+52 55 2345 6789',
                turno: 'mañana',
                activo: true,
                es_temporal: false
              }
            },
            'cajero@lachinga.com': {
              password: 'cajero123',
              usuario: {
                id: 'cajero-001',
                email: 'cajero@lachinga.com',
                nombre: 'María',
                apellido: 'López',
                rol: 'cajero',
                telefono: '+52 55 3456 7890',
                turno: 'mañana',
                activo: true,
                es_temporal: false
              }
            },
            'cocina@lachinga.com': {
              password: 'cocina123',
              usuario: {
                id: 'cocina-001',
                email: 'cocina@lachinga.com',
                nombre: 'Roberto',
                apellido: 'Martínez',
                rol: 'cocina',
                telefono: '+52 55 4567 8901',
                turno: 'mañana',
                activo: true,
                es_temporal: false
              }
            },
            'cliente@lachinga.com': {
              password: 'cliente123',
              usuario: {
                id: 'cliente-001',
                email: 'cliente@lachinga.com',
                nombre: 'Ana',
                apellido: 'García',
                rol: 'cliente',
                telefono: '+52 55 5678 9012',
                turno: 'mañana',
                activo: true,
                es_temporal: false
              }
            }
          }
          
          // Verificar si es un usuario mock
          const usuarioMockData = usuariosMock[email]
          if (usuarioMockData && usuarioMockData.password === password && usuarioMockData.usuario.rol === rol) {
            console.log(`✅ Login exitoso con datos mock para ${rol}`)
            
            set({
              usuario: usuarioMockData.usuario,
              token: `mock-token-${rol}`,
              rol: rol,
              turno: usuarioMockData.usuario.turno,
              isAuthenticated: true,
              isLoading: false
            })
            
            return { success: true, usuario: usuarioMockData.usuario }
          }
          
          // Intentar con Supabase para usuarios reales
          try {
            const { data: usuarioData, error: userError } = await supabase
              .from('usuarios')
              .select('*')
              .eq('email', email)
              .single()

            if (userError) {
              console.error('Error al buscar usuario en Supabase:', userError)
              set({ isLoading: false })
              return { success: false, error: `Error al buscar usuario: ${userError.message}` }
            }

            if (!usuarioData) {
              console.error('Usuario no encontrado en Supabase:', email)
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

            // Login exitoso con Supabase
            console.log(`✅ Login exitoso con Supabase para ${rol}`)
            
            set({
              usuario: usuarioData,
              token: `supabase-token-${usuarioData.id}`,
              rol: usuarioData.rol,
              turno: usuarioData.turno || 'mañana',
              isAuthenticated: true,
              isLoading: false
            })
            
            return { success: true, usuario: usuarioData }
            
          } catch (supabaseError) {
            console.error('Error de conexión con Supabase:', supabaseError)
            set({ isLoading: false })
            return { success: false, error: 'Error de conexión con la base de datos' }
          }
          
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