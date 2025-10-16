import { motion } from 'framer-motion'
import { useCarrito } from '../contexts/CarritoContext'
import toast from 'react-hot-toast'

const TestCarrito = () => {
  const { 
    items, 
    agregarItem, 
    getTotalItems, 
    getTotalPrecio,
    limpiarCarrito 
  } = useCarrito()

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
    console.log('Intentando agregar plato de prueba...')
    agregarItem(platoTest)
    toast.success('Plato de prueba agregado')
  }

  const limpiar = () => {
    limpiarCarrito()
    toast.success('Carrito limpiado')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        🧪 Test del Carrito
      </h3>
      
      <div className="mb-3">
        <p className="text-sm text-blue-700">
          Items en carrito: <strong>{getTotalItems()}</strong>
        </p>
        <p className="text-sm text-blue-700">
          Total: <strong>${getTotalPrecio().toFixed(2)}</strong>
        </p>
        <p className="text-sm text-blue-700">
          Items array: <strong>{JSON.stringify(items)}</strong>
        </p>
      </div>

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={agregarPlatoTest}
          className="btn-primary text-sm"
        >
          Agregar Plato Test
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={limpiar}
          className="btn-secondary text-sm"
        >
          Limpiar
        </motion.button>
      </div>
    </motion.div>
  )
}

export default TestCarrito
