import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCarritoStore = create(
  persist(
    (set, get) => ({
      // Estado del carrito
      items: [],
      observaciones: '',
      mesaSeleccionada: null,
      
      // Acciones del carrito
      agregarItem: (plato) => {
        const items = get().items
        const itemExistente = items.find(item => item.id === plato.id)
        
        if (itemExistente) {
          set({
            items: items.map(item =>
              item.id === plato.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            )
          })
        } else {
          set({
            items: [...items, { ...plato, cantidad: 1 }]
          })
        }
      },
      
      quitarItem: (platoId) => {
        const items = get().items
        const itemExistente = items.find(item => item.id === platoId)
        
        if (itemExistente && itemExistente.cantidad > 1) {
          set({
            items: items.map(item =>
              item.id === platoId
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
            )
          })
        } else {
          set({
            items: items.filter(item => item.id !== platoId)
          })
        }
      },
      
      eliminarItem: (platoId) => {
        set({
          items: get().items.filter(item => item.id !== platoId)
        })
      },
      
      actualizarCantidad: (platoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
          get().eliminarItem(platoId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === platoId
              ? { ...item, cantidad: nuevaCantidad }
              : item
          )
        })
      },
      
      setObservaciones: (observaciones) => {
        set({ observaciones })
      },
      
      setMesaSeleccionada: (mesa) => {
        set({ mesaSeleccionada: mesa })
      },
      
      limpiarCarrito: () => {
        set({
          items: [],
          observaciones: '',
          mesaSeleccionada: null
        })
      },
      
      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0)
      },
      
      getTotalPrecio: () => {
        return get().items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
      },
      
      getCantidadItem: (platoId) => {
        const item = get().items.find(item => item.id === platoId)
        return item ? item.cantidad : 0
      }
    }),
    {
      name: 'carrito-storage', // nombre único para localStorage
      partialize: (state) => ({
        items: state.items,
        observaciones: state.observaciones,
        mesaSeleccionada: state.mesaSeleccionada
      })
    }
  )
)
