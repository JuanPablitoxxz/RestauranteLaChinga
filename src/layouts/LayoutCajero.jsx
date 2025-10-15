import { useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'

const LayoutCajero = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(true)

  const menuItems = [
    { path: '/cajero/cobros', label: 'Cobros', icon: '💰' },
    { path: '/cajero/reportes', label: 'Reportes', icon: '📊' },
    { path: '/cajero/reservas', label: 'Reservas', icon: '📅' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
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

export default LayoutCajero
