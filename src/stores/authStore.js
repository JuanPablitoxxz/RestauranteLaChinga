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
          
          // Buscar usuario en la tabla usuarios
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

          // Verificar contraseña (comparar con password_hash o password)
          const passwordValida = usuarioData.password === password || 
                                usuarioData.password_hash?.includes(password)
          
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

          // Verificar si el usuario está activo
          if (!usuarioData.activo) {
            set({ isLoading: false })
            return { success: false, error: 'Usuario inactivo' }
          }

          // Verificar si es usuario temporal y no ha expirado
          if (usuarioData.es_temporal && usuarioData.fecha_expiracion) {
            const fechaExpiracion = new Date(usuarioData.fecha_expiracion)
            const ahora = new Date()
            
            if (ahora > fechaExpiracion) {
              set({ isLoading: false })
              return { success: false, error: 'Credenciales temporales expiradas' }
            }
          }

          const usuario = {
            id: usuarioData.id,
            email: usuarioData.email,
            nombre: usuarioData.nombre,
            apellido: usuarioData.apellido,
            rol: usuarioData.rol,
            turno: usuarioData.turno,
            activo: usuarioData.activo,
            es_temporal: usuarioData.es_temporal,
            avatar: `https://ui-avatars.com/api/?name=${usuarioData.nombre}&background=c62828&color=fff`
          }
          
          set({
            usuario,
            token: `mock_token_${Date.now()}`, // Token mock para usuarios temporales
            rol: usuarioData.rol,
            isAuthenticated: true,
            isLoading: false
          })

          console.log('✅ Login exitoso:', usuario)
          return { success: true, usuario }
        } catch (error) {
          console.error('Error en login:', error)
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      logout: async () => {
        console.log('🚪 Cerrando sesión...')
        set({
          usuario: null,
          token: null,
          rol: null,
          turno: 'mañana',
          isAuthenticated: false,
          isLoading: false
        })
      },

      cambiarTurno: (nuevoTurno) => {
        set({ turno: nuevoTurno })
      },

      actualizarUsuario: (datosUsuario) => {
        const { usuario } = get()
        if (usuario) {
          set({
            usuario: { ...usuario, ...datosUsuario }
          })
        }
      },

      // Verificaciones de permisos
      tienePermiso: (permiso) => {
        const { rol } = get()
        const permisos = {
          cliente: ['ver_carta', 'hacer_pedido', 'reservar_mesa', 'ver_factura'],
          mesero: ['ver_mesas', 'gestionar_pedidos', 'ver_notificaciones'],
          cajero: ['gestionar_cobros', 'ver_reportes', 'gestionar_reservas'],
          admin: ['ver_dashboard', 'gestionar_usuarios', 'gestionar_mesas', 'gestionar_cartas', 'ver_alertas'],
          cocina: ['ver_pedidos', 'gestionar_cocina']
        }
        return permisos[rol]?.includes(permiso) || false
      },

      esRol: (rolRequerido) => {
        const { rol } = get()
        return rol === rolRequerido
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
