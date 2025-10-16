import { createContext, useContext, useReducer } from 'react'

const CarritoContext = createContext()

// Acciones del carrito
const CARRITO_ACTIONS = {
  AGREGAR_ITEM: 'AGREGAR_ITEM',
  QUITAR_ITEM: 'QUITAR_ITEM',
  ELIMINAR_ITEM: 'ELIMINAR_ITEM',
  ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
  SET_OBSERVACIONES: 'SET_OBSERVACIONES',
  LIMPIAR_CARRITO: 'LIMPIAR_CARRITO'
}

// Reducer del carrito
const carritoReducer = (state, action) => {
  console.log('CarritoReducer:', action.type, action.payload)
  
  switch (action.type) {
    case CARRITO_ACTIONS.AGREGAR_ITEM:
      const itemExistente = state.items.find(item => item.id === action.payload.id)
      
      if (itemExistente) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, cantidad: 1 }]
        }
      }
      
    case CARRITO_ACTIONS.QUITAR_ITEM:
      const itemParaQuitar = state.items.find(item => item.id === action.payload)
      
      if (itemParaQuitar && itemParaQuitar.cantidad > 1) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload)
        }
      }
      
    case CARRITO_ACTIONS.ELIMINAR_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
      
    case CARRITO_ACTIONS.ACTUALIZAR_CANTIDAD:
      if (action.payload.cantidad <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: action.payload.cantidad }
            : item
        )
      }
      
    case CARRITO_ACTIONS.SET_OBSERVACIONES:
      return {
        ...state,
        observaciones: action.payload
      }
      
    case CARRITO_ACTIONS.LIMPIAR_CARRITO:
      return {
        ...state,
        items: [],
        observaciones: ''
      }
      
    default:
      return state
  }
}

// Estado inicial
const initialState = {
  items: [],
  observaciones: ''
}

// Provider del carrito
export const CarritoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, initialState)
  
  console.log('CarritoProvider state:', state)
  
  const agregarItem = (plato) => {
    console.log('Agregando item:', plato)
    dispatch({ type: CARRITO_ACTIONS.AGREGAR_ITEM, payload: plato })
  }
  
  const quitarItem = (platoId) => {
    console.log('Quitando item:', platoId)
    dispatch({ type: CARRITO_ACTIONS.QUITAR_ITEM, payload: platoId })
  }
  
  const eliminarItem = (platoId) => {
    console.log('Eliminando item:', platoId)
    dispatch({ type: CARRITO_ACTIONS.ELIMINAR_ITEM, payload: platoId })
  }
  
  const actualizarCantidad = (platoId, cantidad) => {
    console.log('Actualizando cantidad:', platoId, cantidad)
    dispatch({ 
      type: CARRITO_ACTIONS.ACTUALIZAR_CANTIDAD, 
      payload: { id: platoId, cantidad } 
    })
  }
  
  const setObservaciones = (observaciones) => {
    console.log('Set observaciones:', observaciones)
    dispatch({ type: CARRITO_ACTIONS.SET_OBSERVACIONES, payload: observaciones })
  }
  
  const limpiarCarrito = () => {
    console.log('Limpiando carrito')
    dispatch({ type: CARRITO_ACTIONS.LIMPIAR_CARRITO })
  }
  
  // Getters
  const getTotalItems = () => {
    const total = state.items.reduce((total, item) => total + item.cantidad, 0)
    console.log('Total items:', total)
    return total
  }
  
  const getTotalPrecio = () => {
    const total = state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
    console.log('Total precio:', total)
    return total
  }
  
  const getCantidadItem = (platoId) => {
    const item = state.items.find(item => item.id === platoId)
    const cantidad = item ? item.cantidad : 0
    console.log('Cantidad item', platoId, ':', cantidad)
    return cantidad
  }
  
  const value = {
    // Estado
    items: state.items,
    observaciones: state.observaciones,
    
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

// Hook para usar el carrito
export const useCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider')
  }
  return context
}
