import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Datos mock del usuario
          const usuarioMock = {
            id: 1,
            email,
            nombre: email.split('@')[0],
            rol,
            turno: rol === 'cliente' ? null : (rol === 'mesero' || rol === 'cajero' ? 'mañana' : null),
            mesasAsignadas: rol === 'mesero' ? [1, 2, 3] : [],
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=c62828&color=fff`
          }

          const token = `mock-token-${Date.now()}`
          
          set({
            usuario: usuarioMock,
            token,
            rol,
            isAuthenticated: true,
            isLoading: false
          })

          return { success: true, usuario: usuarioMock }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
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
