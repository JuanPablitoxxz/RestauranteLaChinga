import { motion } from 'framer-motion'
import SupabaseTest from '../../components/SupabaseTest'

const DashboardAdminSimple = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-mexico-dorado-200">
        <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
          🇲🇽 Dashboard Administrativo
        </h1>
        <p className="text-mexico-tierra-600">
          Bienvenido al panel de control de La Chinga
        </p>
      </div>

      {/* KPIs Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { titulo: 'Mesas Ocupadas', valor: '12', total: '24', color: 'mexico-rojo' },
          { titulo: 'Ventas Hoy', valor: '$45,000', color: 'mexico-verde' },
          { titulo: 'Pedidos Pendientes', valor: '8', color: 'mexico-dorado' },
          { titulo: 'Reservas Hoy', valor: '15', color: 'mexico-tierra' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-lg p-6 border border-mexico-dorado-200"
          >
            <h3 className="text-sm font-medium text-neutral-600 mb-2">{kpi.titulo}</h3>
            <p className={`text-2xl font-bold text-${kpi.color}-600`}>{kpi.valor}</p>
            {kpi.total && (
              <div className="mt-2">
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`bg-${kpi.color}-600 h-2 rounded-full`}
                    style={{ width: `${(parseInt(kpi.valor) / parseInt(kpi.total)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{kpi.valor} de {kpi.total}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-mexico-dorado-200">
        <h2 className="text-xl font-semibold text-mexico-rojo-600 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icono: '👥', titulo: 'Usuarios', descripcion: 'Gestionar personal' },
            { icono: '🪑', titulo: 'Mesas', descripcion: 'Estado de mesas' },
            { icono: '🍽️', titulo: 'Cartas', descripcion: 'Menús y platos' },
            { icono: '⚠️', titulo: 'Alertas', descripcion: 'Configurar notificaciones' }
          ].map((accion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gradient-to-br from-mexico-verde-50 to-mexico-dorado-50 rounded-lg border border-mexico-verde-200 hover:border-mexico-verde-300 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{accion.icono}</div>
              <h3 className="font-semibold text-mexico-rojo-600">{accion.titulo}</h3>
              <p className="text-sm text-neutral-600">{accion.descripcion}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-mexico-dorado-200">
        <h2 className="text-xl font-semibold text-mexico-rojo-600 mb-4">
          Estado del Sistema
        </h2>
        <div className="space-y-3">
          {[
            { estado: 'Sistema', valor: 'Operativo', color: 'green' },
            { estado: 'Base de Datos', valor: 'Conectada', color: 'green' },
            { estado: 'API', valor: 'Funcionando', color: 'green' },
            { estado: 'Última Actualización', valor: 'Hace 2 minutos', color: 'blue' }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="font-medium text-neutral-700">{item.estado}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.color === 'green' ? 'bg-green-100 text-green-800' :
                item.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                'bg-neutral-100 text-neutral-800'
              }`}>
                {item.valor}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Prueba de conexión Supabase */}
      <SupabaseTest />
    </motion.div>
  )
}

export default DashboardAdminSimple
