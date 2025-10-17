import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const NotificacionesMesero = () => {
  const [filtro, setFiltro] = useState('todas') // todas, no_leidas, leidas
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      tipo: 'pedido_nuevo',
      titulo: 'Nuevo pedido - Mesa 2',
      mensaje: 'El cliente ha realizado un pedido con 3 items',
      leida: false,
      prioridad: 'alta',
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
      datos: { mesaId: 2, pedidoId: 1 }
    },
    {
      id: 2,
      tipo: 'cliente_termina',
      titulo: 'Cliente solicita cuenta - Mesa 4',
      mensaje: 'El cliente solicita la cuenta',
      leida: false,
      prioridad: 'alta',
      created_at: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
      datos: { mesaId: 4 }
    },
    {
      id: 3,
      tipo: 'pedido_listo',
      titulo: 'Pedido listo - Mesa 1',
      mensaje: 'El pedido está listo para entregar',
      leida: true,
      prioridad: 'normal',
      created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
      datos: { mesaId: 1, pedidoId: 3 }
    }
  ])

  const notificacionesFiltradas = notificaciones.filter(notif => {
    switch (filtro) {
      case 'no_leidas':
        return !notif.leida
      case 'leidas':
        return notif.leida
      default:
        return true
    }
  })

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length

  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'pedido_nuevo':
        return { icono: BellIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 'cliente_termina':
        return { icono: UserGroupIcon, color: 'text-green-600', bgColor: 'bg-green-100' }
      case 'reserva_nueva':
        return { icono: ClockIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' }
      case 'pedido_listo':
        return { icono: CheckCircleIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 'alerta':
        return { icono: ExclamationTriangleIcon, color: 'text-red-600', bgColor: 'bg-red-100' }
      default:
        return { icono: BellIcon, color: 'text-neutral-600', bgColor: 'bg-neutral-100' }
    }
  }

  const obtenerColorTipo = (tipo) => {
    switch (tipo) {
      case 'pedido_nuevo':
        return 'border-l-blue-500'
      case 'cliente_termina':
        return 'border-l-green-500'
      case 'reserva_nueva':
        return 'border-l-purple-500'
      case 'pedido_listo':
        return 'border-l-yellow-500'
      case 'alerta':
        return 'border-l-red-500'
      default:
        return 'border-l-neutral-500'
    }
  }

  const marcarComoLeida = (notificacionId) => {
    setNotificaciones(prev => 
      prev.map(notif => 
        notif.id === notificacionId 
          ? { ...notif, leida: true }
          : notif
      )
    )
    toast.success('Notificación marcada como leída')
  }

  const eliminarNotificacion = (notificacionId) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== notificacionId))
    toast.success('Notificación eliminada')
  }

  const limpiarTodas = () => {
    setNotificaciones([])
    toast.success('Todas las notificaciones eliminadas')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Notificaciones
        </h1>
        <p className="text-neutral-600">
          Gestiona las notificaciones de tus mesas
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
            {notificaciones.length}
          </div>
          <p className="text-sm text-neutral-600">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-2">
            {notificacionesNoLeidas}
          </div>
          <p className="text-sm text-neutral-600">No leídas</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
            {notificaciones.length - notificacionesNoLeidas}
          </div>
          <p className="text-sm text-neutral-600">Leídas</p>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'no_leidas', label: 'No leídas' },
          { key: 'leidas', label: 'Leídas' }
        ].map((filtroOption) => (
          <button
            key={filtroOption.key}
            onClick={() => setFiltro(filtroOption.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === filtroOption.key
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {filtroOption.label}
          </button>
        ))}
        
        <button
          onClick={limpiarTodas}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Limpiar todas
        </button>
      </motion.div>

      {/* Lista de notificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No hay notificaciones</p>
          </div>
        ) : (
          notificacionesFiltradas.map((notificacion, index) => {
            const iconoTipo = obtenerIconoTipo(notificacion.tipo)
            const IconoTipo = iconoTipo.icono
            const colorTipo = obtenerColorTipo(notificacion.tipo)
            
            return (
              <motion.div
                key={notificacion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${colorTipo} border border-neutral-200 p-4 ${
                  !notificacion.leida ? 'ring-2 ring-primary-100' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${iconoTipo.bgColor}`}>
                      <IconoTipo className={`h-5 w-5 ${iconoTipo.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-neutral-800">
                          {notificacion.titulo}
                        </h3>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-neutral-600 text-sm mb-2">
                        {notificacion.mensaje}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-neutral-500">
                        <span>
                          {format(new Date(notificacion.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notificacion.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          notificacion.prioridad === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notificacion.prioridad}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notificacion.leida && (
                      <button
                        onClick={() => marcarComoLeida(notificacion.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Marcar como leída"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => eliminarNotificacion(notificacion.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}

export default NotificacionesMesero