import { create } from 'zustand'

export const useCarritoStore = create((set, get) => ({
  // Estado del carrito
  items: [],
  observaciones: '',
  mesaSeleccionada: null,
  
  // Acciones del carrito
  agregarItem: (plato) => {
    console.log('Agregando plato:', plato)
    const items = get().items
    const itemExistente = items.find(item => item.id === plato.id)
    
    if (itemExistente) {
      const nuevosItems = items.map(item =>
        item.id === plato.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
      console.log('Actualizando cantidad:', nuevosItems)
      set({ items: nuevosItems })
    } else {
      const nuevosItems = [...items, { ...plato, cantidad: 1 }]
      console.log('Agregando nuevo item:', nuevosItems)
      set({ items: nuevosItems })
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
    const total = get().items.reduce((total, item) => total + item.cantidad, 0)
    console.log('Total items:', total, 'Items:', get().items)
    return total
  },
  
  getTotalPrecio: () => {
    const total = get().items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
    console.log('Total precio:', total, 'Items:', get().items)
    return total
  },
  
  getCantidadItem: (platoId) => {
    const item = get().items.find(item => item.id === platoId)
    const cantidad = item ? item.cantidad : 0
    console.log('Cantidad item', platoId, ':', cantidad)
    return cantidad
  }
}))
