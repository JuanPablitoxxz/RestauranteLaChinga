import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

const NavBar = ({ onToggleSidebar, sidebarAbierto }) => {
  const { usuario, rol, turno, logout } = useAuthStore()
  const { notificaciones, limpiarNotificaciones } = useAppStore()
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const [menuNotificacionesAbierto, setMenuNotificacionesAbierto] = useState(false)

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length

  const obtenerColorRol = (rol) => {
    const colores = {
      cliente: 'bg-blue-100 text-blue-800',
      mesero: 'bg-green-100 text-green-800',
      cajero: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-purple-100 text-purple-800',
      cocina: 'bg-orange-100 text-orange-800'
    }
    return colores[rol] || 'bg-neutral-100 text-neutral-800'
  }

  const obtenerNombreRol = (rol) => {
    const nombres = {
      cliente: 'Cliente',
      mesero: 'Mesero',
      cajero: 'Cajero',
      admin: 'Administrador',
      cocina: 'Jefe de Cocina'
    }
    return nombres[rol] || rol
  }

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Lado izquierdo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
            >
              <Bars3Icon className="h-6 w-6 text-neutral-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-800">La Chinga</h1>
                <p className="text-xs text-neutral-500">Restaurante</p>
              </div>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex items-center space-x-4">
            {/* Selector de turno (solo para roles que lo necesitan) */}
            {turno && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">Turno:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  turno === 'mañana' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {turno === 'mañana' ? 'Mañana (7-15h)' : 'Tarde (15-23h)'}
                </span>
              </div>
            )}

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setMenuNotificacionesAbierto(!menuNotificacionesAbierto)}
                className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6 text-neutral-600" />
                {notificacionesNoLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificacionesNoLeidas}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {menuNotificacionesAbierto && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                >
                  <div className="p-4 border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-800">Notificaciones</h3>
                      {notificacionesNoLeidas > 0 && (
                        <button
                          onClick={limpiarNotificaciones}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notificaciones.length === 0 ? (
                      <div className="p-4 text-center text-neutral-500">
                        No hay notificaciones
                      </div>
                    ) : (
                      notificaciones.map((notificacion) => (
                        <div
                          key={notificacion.id}
                          className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 ${
                            !notificacion.leida ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-800">
                                {notificacion.titulo}
                              </p>
                              <p className="text-sm text-neutral-600 mt-1">
                                {notificacion.mensaje}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {new Date(notificacion.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              >
                <img
                  src={usuario?.avatar}
                  alt={usuario?.nombre}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-neutral-800">
                    {usuario?.nombre}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {obtenerNombreRol(rol)}
                  </p>
                </div>
                <UserCircleIcon className="h-5 w-5 text-neutral-600" />
              </button>

              {/* Dropdown de usuario */}
              {menuUsuarioAbierto && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                >
                  <div className="p-4 border-b border-neutral-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={usuario?.avatar}
                        alt={usuario?.nombre}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-neutral-800">
                          {usuario?.nombre}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {usuario?.email}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${obtenerColorRol(rol)}`}>
                          {obtenerNombreRol(rol)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar menús */}
      {(menuUsuarioAbierto || menuNotificacionesAbierto) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setMenuUsuarioAbierto(false)
            setMenuNotificacionesAbierto(false)
          }}
        />
      )}
    </nav>
  )
}

export default NavBar
