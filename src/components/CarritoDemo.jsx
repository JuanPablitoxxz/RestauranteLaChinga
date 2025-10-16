import { motion } from 'framer-motion'
import { useCarritoStore } from '../stores/carritoStore'
import toast from 'react-hot-toast'

const CarritoDemo = () => {
  const { agregarItem, limpiarCarrito } = useCarritoStore()

  const platosDemo = [
    {
      id: 1,
      nombre: 'Carnitas',
      descripcion: 'Carne de cerdo cocida lentamente con tortillas',
      precio: 130.00,
      categoria: 'cena',
      imagen: 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 2,
      nombre: 'Margarita Clásica',
      descripcion: 'Coctel de tequila con limón y sal',
      precio: 85.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      disponible: true
    },
    {
      id: 3,
      nombre: 'Agua de Horchata',
      descripcion: 'Bebida refrescante de arroz con canela',
      precio: 35.00,
      categoria: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      disponible: true
    }
  ]

  const agregarPlatosDemo = () => {
    limpiarCarrito()
    platosDemo.forEach(plato => {
      agregarItem(plato)
    })
    toast.success('Platos de ejemplo agregados al carrito')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-mexico-dorado-50 border border-mexico-dorado-200 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold text-mexico-dorado-800 mb-2">
        🍽️ Datos de Prueba
      </h3>
      <p className="text-sm text-mexico-dorado-700 mb-3">
        Agrega platos de ejemplo para probar la funcionalidad del carrito
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={agregarPlatosDemo}
        className="btn-secondary text-sm"
      >
        Agregar Platos de Ejemplo
      </motion.button>
    </motion.div>
  )
}

export default CarritoDemo
