import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Layouts
import LayoutPublico from './layouts/LayoutPublico'
import LayoutCliente from './layouts/LayoutCliente'
import LayoutMesero from './layouts/LayoutMesero'
import LayoutCajero from './layouts/LayoutCajero'
import LayoutAdmin from './layouts/LayoutAdmin'
import LayoutCocina from './layouts/LayoutCocina'

// Páginas públicas
import Login from './pages/Login'
import Register from './pages/Register'

// Páginas de cliente
import CartaCliente from './pages/cliente/Carta'
import MesaCliente from './pages/cliente/Mesa'
import PedidoCliente from './pages/cliente/Pedido'
import ReservaCliente from './pages/cliente/Reserva'
import FacturaCliente from './pages/cliente/Factura'

// Páginas de mesero
import MesasMesero from './pages/mesero/Mesas'
import PedidoMesero from './pages/mesero/Pedido'
import NotificacionesMesero from './pages/mesero/Notificaciones'

// Páginas de cajero
import CobrosCajero from './pages/cajero/Cobros'
import ReportesCajero from './pages/cajero/Reportes'
import ReservasCajero from './pages/cajero/Reservas'

// Páginas de cliente
import DashboardCliente from './pages/cliente/Dashboard'
import MiPedido from './pages/cliente/MiPedido'
import Factura from './pages/cliente/Factura'

// Páginas de admin
import DashboardAdmin from './pages/admin/DashboardSimple'
import UsuariosAdmin from './pages/admin/Usuarios'
import MesasAdmin from './pages/admin/MesasSimple'
import CartasAdmin from './pages/admin/Cartas'
import AlertasAdmin from './pages/admin/Alertas'

// Páginas de cocina
import PedidosCocina from './pages/cocina/Pedidos'
import AsignarCocina from './pages/cocina/Asignar'

// Componente de protección de rutas
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { isAuthenticated, rol } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Componente de redirección según rol
const RedireccionarPorRol = () => {
  const { rol } = useAuthStore()
  
  switch (rol) {
    case 'cliente':
      return <Navigate to="/cliente/carta" replace />
    case 'mesero':
      return <Navigate to="/mesero/mesas" replace />
    case 'cajero':
      return <Navigate to="/cajero/cobros" replace />
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />
    case 'cocina':
      return <Navigate to="/cocina/pedidos" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

function App() {
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            <LayoutPublico>
              <Login />
            </LayoutPublico>
          } />
          <Route path="/register" element={
            <LayoutPublico>
              <Register />
            </LayoutPublico>
          } />
          
          {/* Ruta raíz - redirección por rol */}
          <Route path="/" element={<RedireccionarPorRol />} />
          
          {/* Rutas de cliente */}
          <Route path="/cliente/*" element={
            <RutaProtegida rolesPermitidos={['cliente']}>
              <LayoutCliente>
                <Routes>
                  <Route path="carta" element={<CartaCliente />} />
                  <Route path="mesa" element={<MesaCliente />} />
                  <Route path="pedido" element={<PedidoCliente />} />
                  <Route path="reserva" element={<ReservaCliente />} />
                  <Route path="factura" element={<FacturaCliente />} />
                  <Route path="*" element={<Navigate to="/cliente/carta" replace />} />
                </Routes>
              </LayoutCliente>
            </RutaProtegida>
          } />
          
          {/* Rutas de mesero */}
          <Route path="/mesero/*" element={
            <RutaProtegida rolesPermitidos={['mesero']}>
              <LayoutMesero>
                <Routes>
                  <Route path="mesas" element={<MesasMesero />} />
                  <Route path="pedido/:id" element={<PedidoMesero />} />
                  <Route path="notificaciones" element={<NotificacionesMesero />} />
                  <Route path="*" element={<Navigate to="/mesero/mesas" replace />} />
                </Routes>
              </LayoutMesero>
            </RutaProtegida>
          } />
          
          {/* Rutas de cajero */}
          <Route path="/cajero/*" element={
            <RutaProtegida rolesPermitidos={['cajero']}>
              <LayoutCajero>
                <Routes>
                  <Route path="cobros" element={<CobrosCajero />} />
                  <Route path="reportes" element={<ReportesCajero />} />
                  <Route path="reservas" element={<ReservasCajero />} />
                  <Route path="*" element={<Navigate to="/cajero/cobros" replace />} />
                </Routes>
              </LayoutCajero>
            </RutaProtegida>
          } />
          
          {/* Rutas de cliente */}
          <Route path="/cliente/*" element={
            <RutaProtegida rolesPermitidos={['cliente']}>
              <LayoutCliente>
                <Routes>
                  <Route path="dashboard" element={<DashboardCliente />} />
                  <Route path="carta" element={<CartaCliente />} />
                  <Route path="pedido" element={<MiPedido />} />
                  <Route path="factura" element={<Factura />} />
                  <Route path="*" element={<Navigate to="/cliente/dashboard" replace />} />
                </Routes>
              </LayoutCliente>
            </RutaProtegida>
          } />
          
          {/* Rutas de admin */}
          <Route path="/admin/*" element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <LayoutAdmin>
                <Routes>
                  <Route path="dashboard" element={<DashboardAdmin />} />
                  <Route path="usuarios" element={<UsuariosAdmin />} />
                  <Route path="mesas" element={<MesasAdmin />} />
                  <Route path="cartas" element={<CartasAdmin />} />
                  <Route path="alertas" element={<AlertasAdmin />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </LayoutAdmin>
            </RutaProtegida>
          } />
          
          {/* Rutas de cocina */}
          <Route path="/cocina/*" element={
            <RutaProtegida rolesPermitidos={['cocina']}>
              <LayoutCocina>
                <Routes>
                  <Route path="pedidos" element={<PedidosCocina />} />
                  <Route path="asignar" element={<AsignarCocina />} />
                  <Route path="*" element={<Navigate to="/cocina/pedidos" replace />} />
                </Routes>
              </LayoutCocina>
            </RutaProtegida>
          } />
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <LayoutPublico>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-primary-800 mb-4">404</h1>
                  <p className="text-neutral-600 mb-8">Página no encontrada</p>
                  <Navigate to="/" replace />
                </div>
              </div>
            </LayoutPublico>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
