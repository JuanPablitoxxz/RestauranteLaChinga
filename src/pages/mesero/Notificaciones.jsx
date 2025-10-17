import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../stores/appStore'
import { useMeseroAsignaciones } from '../../hooks/useMeseroAsignaciones'
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
  const { notificaciones: notificacionesLocales, marcarComoLeida, removerNotificacion, limpiarNotificaciones } = useAppStore()
  const queryClient = useQueryClient()
  const [filtro, setFiltro] = useState('todas') // todas, no_leidas, leidas

  // Usar el hook personalizado para obtener notificaciones del mesero
  const {
    notificaciones: notificacionesServidor,
    isLoadingNotificaciones,
    marcarNotificacionLeida,
    isMarkingNotification
  } = useMeseroAsignaciones()

  // Combinar notificaciones locales y del servidor
  const todasLasNotificaciones = [
    ...notificacionesLocales,
    ...(notificacionesServidor || [])
  ].sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp))

  const notificacionesFiltradas = todasLasNotificaciones.filter(notif => {
    switch (filtro) {
      case 'no_leidas':
        return !notif.leida
      case 'leidas':
        return notif.leida
      default:
        return true
    }
  })

  const notificacionesNoLeidas = todasLasNotificaciones.filter(n => !n.leida).length

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

  const marcarComoLeidaHandler = async (notificacionId) => {
    try {
      // Intentar marcar como leída en el servidor primero
      if (notificacionesServidor?.some(n => n.id === notificacionId)) {
        await marcarNotificacionLeida(notificacionId)
      } else {
        // Si es una notificación local, usar el store local
        marcarComoLeida(notificacionId)
      }
      toast.success('Notificación marcada como leída')
    } catch (error) {
      toast.error('Error al marcar notificación como leída')
      console.error('Error:', error)
    }
  }

  const eliminarNotificacion = (notificacionId) => {
    removerNotificacion(notificacionId)
    toast.success('Notificación eliminada')
  }

  const limpiarTodas = () => {
    limpiarNotificaciones()
    toast.success('Todas las notificaciones han sido limpiadas')
  }

  const marcarTodasComoLeidas = () => {
    todasLasNotificaciones.forEach(notif => {
      if (!notif.leida) {
        marcarComoLeida(notif.id)
      }
    })
    toast.success('Todas las notificaciones marcadas como leídas')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            Notificaciones
          </h1>
          <p className="text-neutral-600">
            Mantente al día con las actividades del restaurante
          </p>
        </div>

        {notificacionesNoLeidas > 0 && (
          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {notificacionesNoLeidas} no leídas
          </div>
        )}
      </motion.div>

      {/* Filtros y acciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { value: 'todas', label: 'Todas' },
              { value: 'no_leidas', label: 'No leídas' },
              { value: 'leidas', label: 'Leídas' }
            ].map((filtroOption) => (
              <motion.button
                key={filtroOption.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFiltro(filtroOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filtro === filtroOption.value
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {filtroOption.label}
              </motion.button>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={marcarTodasComoLeidas}
              disabled={notificacionesNoLeidas === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                notificacionesNoLeidas === 0
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Marcar todas como leídas
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={limpiarTodas}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-all duration-200"
            >
              Limpiar todas
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Lista de notificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <BellIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No hay notificaciones
            </h2>
            <p className="text-neutral-600">
              {filtro === 'todas' 
                ? 'No tienes notificaciones por el momento'
                : `No hay notificaciones ${filtro === 'no_leidas' ? 'no leídas' : 'leídas'}`
              }
            </p>
          </div>
        ) : (
          notificacionesFiltradas.map((notificacion, index) => {
            const iconoTipo = obtenerIconoTipo(notificacion.tipo)
            const IconoTipo = iconoTipo.icono
            
            return (
              <motion.div
                key={notificacion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${obtenerColorTipo(notificacion.tipo)} border border-neutral-200 p-6 ${
                  !notificacion.leida ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icono */}
                  <div className={`p-3 rounded-lg ${iconoTipo.bgColor}`}>
                    <IconoTipo className={`h-6 w-6 ${iconoTipo.color}`} />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-800 mb-1">
                          {notificacion.titulo}
                        </h3>
                        <p className="text-neutral-600 mb-2">
                          {notificacion.mensaje}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <span>
                            {format(new Date(notificacion.timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                          {!notificacion.leida && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              Nueva
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-2">
                        {!notificacion.leida && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => marcarComoLeidaHandler(notificacion.id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Marcar como leída"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </motion.button>
                        )}
                        
                        {notificacion.leida && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => marcarComoLeidaHandler(notificacion.id)}
                            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                            title="Marcar como no leída"
                          >
                            <EyeSlashIcon className="h-4 w-4" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => eliminarNotificacion(notificacion.id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                          title="Eliminar notificación"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Acciones específicas por tipo */}
                    {notificacion.datos && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="flex space-x-2">
                          {notificacion.tipo === 'pedido_nuevo' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn-primary text-sm"
                            >
                              Ver Pedido
                            </motion.button>
                          )}
                          
                          {notificacion.tipo === 'cliente_termina' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn-success text-sm"
                            >
                              Procesar Cuenta
                            </motion.button>
                          )}
                          
                          {notificacion.tipo === 'reserva_nueva' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn-secondary text-sm"
                            >
                              Ver Reserva
                            </motion.button>
                          )}
                          
                          {notificacion.tipo === 'pedido_listo' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn-primary text-sm"
                            >
                              Entregar Pedido
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Estadísticas
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-800">
              {todasLasNotificaciones.length}
            </div>
            <div className="text-sm text-neutral-600">Total</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notificacionesNoLeidas}
            </div>
            <div className="text-sm text-neutral-600">No leídas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {todasLasNotificaciones.filter(n => n.leida).length}
            </div>
            <div className="text-sm text-neutral-600">Leídas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {todasLasNotificaciones.filter(n => n.tipo === 'pedido_nuevo').length}
            </div>
            <div className="text-sm text-neutral-600">Pedidos</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotificacionesMesero
