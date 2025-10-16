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
          // Autenticación con Supabase
          const { data, error } = await auth.signIn(email, password)
          
          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          // Obtener datos del usuario desde la base de datos
          const { data: usuarioData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single()

          if (userError || !usuarioData) {
            set({ isLoading: false })
            return { success: false, error: 'Usuario no encontrado' }
          }

          // Verificar que el rol coincida
          if (usuarioData.rol !== rol) {
            set({ isLoading: false })
            return { success: false, error: 'Rol incorrecto' }
          }

          const usuario = {
            id: usuarioData.id,
            email: usuarioData.email,
            nombre: usuarioData.nombre,
            apellido: usuarioData.apellido,
            rol: usuarioData.rol,
            turno: usuarioData.turno,
            activo: usuarioData.activo,
            avatar: `https://ui-avatars.com/api/?name=${usuarioData.nombre}&background=c62828&color=fff`
          }
          
          set({
            usuario,
            token: data.session?.access_token,
            rol: usuarioData.rol,
            isAuthenticated: true,
            isLoading: false
          })

          return { success: true, usuario }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      logout: async () => {
        try {
          await auth.signOut()
        } catch (error) {
          console.error('Error al cerrar sesión:', error)
        }
        
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
