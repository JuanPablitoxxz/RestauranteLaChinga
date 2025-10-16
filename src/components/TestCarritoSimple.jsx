import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCarrito } from './CarritoSimple'
import toast from 'react-hot-toast'

const TestCarritoSimple = () => {
  const { 
    items, 
    agregarItem, 
    getTotalItems, 
    getTotalPrecio,
    limpiarCarrito 
  } = useCarrito()

  const [testCount, setTestCount] = useState(0)

  const platoTest = {
    id: 999,
    nombre: 'Plato de Prueba',
    descripcion: 'Para probar el carrito',
    precio: 50.00,
    categoria: 'test',
    imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    disponible: true
  }

  const agregarPlatoTest = () => {
    console.log('=== INICIANDO TEST DEL CARRITO ===')
    console.log('Estado antes:', { items, totalItems: getTotalItems(), totalPrecio: getTotalPrecio() })
    
    agregarItem(platoTest)
    setTestCount(prev => prev + 1)
    
    console.log('Estado después:', { items, totalItems: getTotalItems(), totalPrecio: getTotalPrecio() })
    console.log('=== FIN TEST DEL CARRITO ===')
    
    toast.success(`Plato de prueba agregado (${testCount + 1})`)
  }

  const limpiar = () => {
    console.log('Limpiando carrito...')
    limpiarCarrito()
    setTestCount(0)
    toast.success('Carrito limpiado')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        🚨 TEST SIMPLE DEL CARRITO
      </h3>
      
      <div className="mb-3 space-y-1">
        <p className="text-sm text-red-700">
          <strong>Items en carrito:</strong> {getTotalItems()}
        </p>
        <p className="text-sm text-red-700">
          <strong>Total:</strong> ${getTotalPrecio().toFixed(2)}
        </p>
        <p className="text-sm text-red-700">
          <strong>Array items:</strong> {JSON.stringify(items, null, 2)}
        </p>
        <p className="text-sm text-red-700">
          <strong>Tests realizados:</strong> {testCount}
        </p>
      </div>

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={agregarPlatoTest}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Agregar Plato Test
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={limpiar}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Limpiar
        </motion.button>
      </div>
    </motion.div>
  )
}

export default TestCarritoSimple
