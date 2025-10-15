import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Sidebar = ({ menuItems, abierto, onCerrar }) => {
  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: abierto ? 0 : -256,
          opacity: abierto ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-neutral-200 z-30 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-800">Menú</h2>
            <button
              onClick={onCerrar}
              className="p-1 rounded-lg hover:bg-neutral-100 transition-colors duration-200 lg:hidden"
            >
              <XMarkIcon className="h-5 w-5 text-neutral-600" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => {
                      // Cerrar sidebar en móvil al hacer clic
                      if (window.innerWidth < 1024) {
                        onCerrar()
                      }
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 text-center">
              <p>La Chinga Restaurant</p>
              <p>v1.0.0</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay para móvil */}
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onCerrar}
        />
      )}
    </>
  )
}

export default Sidebar
