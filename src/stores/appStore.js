import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // Estado de la aplicación
  sidebarAbierto: true,
  tema: 'claro',
  notificaciones: [],
  carrito: [],
  mesaSeleccionada: null,
  reservaActual: null,
  pedidoActual: null,

  // Acciones de UI
  toggleSidebar: () => set((state) => ({ sidebarAbierto: !state.sidebarAbierto })),
  cerrarSidebar: () => set({ sidebarAbierto: false }),
  abrirSidebar: () => set({ sidebarAbierto: true }),

  // Gestión de notificaciones
  agregarNotificacion: (notificacion) => {
    const id = Date.now()
    const nuevaNotificacion = {
      id,
      timestamp: new Date(),
      leida: false,
      ...notificacion
    }
    
    set((state) => ({
      notificaciones: [nuevaNotificacion, ...state.notificaciones]
    }))

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      get().removerNotificacion(id)
    }, 5000)

    return id
  },

  removerNotificacion: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.filter(n => n.id !== id)
    }))
  },

  marcarComoLeida: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.map(n =>
        n.id === id ? { ...n, leida: true } : n
      )
    }))
  },

  limpiarNotificaciones: () => set({ notificaciones: [] }),

  // Gestión del carrito
  agregarAlCarrito: (item) => {
    set((state) => {
      const itemExistente = state.carrito.find(i => i.id === item.id)
      
      if (itemExistente) {
        return {
          carrito: state.carrito.map(i =>
            i.id === item.id
              ? { ...i, cantidad: i.cantidad + (item.cantidad || 1) }
              : i
          )
        }
      } else {
        return {
          carrito: [...state.carrito, { ...item, cantidad: item.cantidad || 1 }]
        }
      }
    })
  },

  removerDelCarrito: (itemId) => {
    set((state) => ({
      carrito: state.carrito.filter(item => item.id !== itemId)
    }))
  },

  actualizarCantidad: (itemId, cantidad) => {
    if (cantidad <= 0) {
      get().removerDelCarrito(itemId)
      return
    }

    set((state) => ({
      carrito: state.carrito.map(item =>
        item.id === itemId ? { ...item, cantidad } : item
      )
    }))
  },

  limpiarCarrito: () => set({ carrito: [] }),

  // Gestión de mesa
  seleccionarMesa: (mesa) => set({ mesaSeleccionada: mesa }),
  limpiarMesa: () => set({ mesaSeleccionada: null }),

  // Gestión de reserva
  establecerReserva: (reserva) => set({ reservaActual: reserva }),
  limpiarReserva: () => set({ reservaActual: null }),

  // Gestión de pedido
  establecerPedido: (pedido) => set({ pedidoActual: pedido }),
  limpiarPedido: () => set({ pedidoActual: null }),

  // Calcular total del carrito
  getTotalCarrito: () => {
    const { carrito } = get()
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  },

  // Obtener cantidad total de items
  getCantidadTotalCarrito: () => {
    const { carrito } = get()
    return carrito.reduce((total, item) => total + item.cantidad, 0)
  }
}))
