import { useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'

const LayoutCliente = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  const menuItems = [
    { path: '/cliente/carta', label: 'Carta', icon: '🍽️' },
    { path: '/cliente/mesa', label: 'Mi Mesa', icon: '🪑' },
    { path: '/cliente/pedido', label: 'Mi Pedido', icon: '🛒' },
    { path: '/cliente/reserva', label: 'Reservas', icon: '📅' },
    { path: '/cliente/factura', label: 'Factura', icon: '🧾' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-mexico-verde-50 to-mexico-dorado-50">
      <NavBar 
        onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
        sidebarAbierto={sidebarAbierto}
      />
      
      <div className="flex">
        <Sidebar 
          menuItems={menuItems}
          abierto={sidebarAbierto}
          onCerrar={() => setSidebarAbierto(false)}
        />
        
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 transition-all duration-300 ${
            sidebarAbierto ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default LayoutCliente
