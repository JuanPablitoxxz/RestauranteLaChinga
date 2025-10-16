import { useState, createContext, useContext } from 'react'

// Context simple para el carrito
const CarritoContext = createContext()

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([])
  const [observaciones, setObservaciones] = useState('')

  console.log('CarritoProvider - Estado actual:', { carrito, observaciones })

  const agregarItem = (plato) => {
    console.log('Agregando plato al carrito:', plato)
    setCarrito(prev => {
      const itemExistente = prev.find(item => item.id === plato.id)
      
      if (itemExistente) {
        const nuevoCarrito = prev.map(item =>
          item.id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
        console.log('Actualizando cantidad:', nuevoCarrito)
        return nuevoCarrito
      } else {
        const nuevoCarrito = [...prev, { ...plato, cantidad: 1 }]
        console.log('Agregando nuevo item:', nuevoCarrito)
        return nuevoCarrito
      }
    })
  }

  const quitarItem = (platoId) => {
    console.log('Quitando item del carrito:', platoId)
    setCarrito(prev => {
      const itemExistente = prev.find(item => item.id === platoId)
      
      if (itemExistente && itemExistente.cantidad > 1) {
        const nuevoCarrito = prev.map(item =>
          item.id === platoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        console.log('Reduciendo cantidad:', nuevoCarrito)
        return nuevoCarrito
      } else {
        const nuevoCarrito = prev.filter(item => item.id !== platoId)
        console.log('Eliminando item:', nuevoCarrito)
        return nuevoCarrito
      }
    })
  }

  const eliminarItem = (platoId) => {
    console.log('Eliminando completamente item:', platoId)
    setCarrito(prev => {
      const nuevoCarrito = prev.filter(item => item.id !== platoId)
      console.log('Item eliminado:', nuevoCarrito)
      return nuevoCarrito
    })
  }

  const actualizarCantidad = (platoId, nuevaCantidad) => {
    console.log('Actualizando cantidad:', platoId, nuevaCantidad)
    if (nuevaCantidad <= 0) {
      eliminarItem(platoId)
      return
    }
    
    setCarrito(prev => {
      const nuevoCarrito = prev.map(item =>
        item.id === platoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
      console.log('Cantidad actualizada:', nuevoCarrito)
      return nuevoCarrito
    })
  }

  const limpiarCarrito = () => {
    console.log('Limpiando carrito')
    setCarrito([])
    setObservaciones('')
  }

  // Getters
  const getTotalItems = () => {
    const total = carrito.reduce((total, item) => total + item.cantidad, 0)
    console.log('Total items calculado:', total)
    return total
  }

  const getTotalPrecio = () => {
    const total = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
    console.log('Total precio calculado:', total)
    return total
  }

  const getCantidadItem = (platoId) => {
    const item = carrito.find(item => item.id === platoId)
    const cantidad = item ? item.cantidad : 0
    console.log('Cantidad item', platoId, ':', cantidad)
    return cantidad
  }

  const value = {
    // Estado
    items: carrito,
    observaciones,
    
    // Acciones
    agregarItem,
    quitarItem,
    eliminarItem,
    actualizarCantidad,
    setObservaciones,
    limpiarCarrito,
    
    // Getters
    getTotalItems,
    getTotalPrecio,
    getCantidadItem
  }

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    console.error('useCarrito debe ser usado dentro de CarritoProvider')
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider')
  }
  console.log('useCarrito hook llamado, context:', context)
  return context
}
