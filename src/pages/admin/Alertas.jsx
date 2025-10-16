import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import FormularioAlerta from '../../components/forms/FormularioAlerta'

const AlertasAdmin = () => {
  const [mostrarFormularioAlerta, setMostrarFormularioAlerta] = useState(false)
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      nombre: 'Alta Ocupación de Mesas',
      descripcion: 'Notificar cuando más del 80% de las mesas estén ocupadas',
      tipo: 'warning',
      activa: true,
      umbral: 80,
      metrica: 'porcentaje_mesas_ocupadas'
    },
    {
      id: 2,
      nombre: 'Pedidos Pendientes',
      descripcion: 'Notificar cuando haya más de 5 pedidos pendientes',
      tipo: 'info',
      activa: true,
      umbral: 5,
      metrica: 'pedidos_pendientes'
    },
    {
      id: 3,
      nombre: 'Sin Reservas',
      descripcion: 'Notificar cuando no haya reservas confirmadas para el día',
      tipo: 'warning',
      activa: false,
      umbral: 0,
      metrica: 'reservas_confirmadas_hoy'
    },
    {
      id: 4,
      nombre: 'Tiempo de Espera Alto',
      descripcion: 'Notificar cuando un pedido lleve más de 30 minutos esperando',
      tipo: 'error',
      activa: true,
      umbral: 30,
      metrica: 'tiempo_espera_pedidos'
    }
  ])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null)
  const [accionModal, setAccionModal] = useState('crear') // crear, editar

  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'warning':
        return { icono: ExclamationTriangleIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 'info':
        return { icono: InformationCircleIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 'error':
        return { icono: XCircleIcon, color: 'text-red-600', bgColor: 'bg-red-100' }
      case 'success':
        return { icono: CheckCircleIcon, color: 'text-green-600', bgColor: 'bg-green-100' }
      default:
        return { icono: BellIcon, color: 'text-neutral-600', bgColor: 'bg-neutral-100' }
    }
  }

  const obtenerNombreTipo = (tipo) => {
    const nombres = {
      warning: 'Advertencia',
      info: 'Información',
      error: 'Error',
      success: 'Éxito'
    }
    return nombres[tipo] || tipo
  }

  const toggleAlerta = (alertaId) => {
    setAlertas(prev => prev.map(alerta => 
      alerta.id === alertaId 
        ? { ...alerta, activa: !alerta.activa }
        : alerta
    ))
  }

  const eliminarAlerta = (alertaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta alerta?')) {
      setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId))
    }
  }

  const calcularEstadisticas = () => {
    const total = alertas.length
    const activas = alertas.filter(a => a.activa).length
    const inactivas = alertas.filter(a => !a.activa).length
    const porTipo = alertas.reduce((acc, alerta) => {
      acc[alerta.tipo] = (acc[alerta.tipo] || 0) + 1
      return acc
    }, {})

    return { total, activas, inactivas, porTipo }
  }

  const estadisticas = calcularEstadisticas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Configuración de Alertas
        </h1>
        <p className="text-neutral-600">
          Gestiona las alertas y notificaciones del sistema
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Total Alertas', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Activas', 
            valor: estadisticas.activas, 
            color: 'bg-green-100 text-green-800' 
          },
          { 
            label: 'Inactivas', 
            valor: estadisticas.inactivas, 
            color: 'bg-red-100 text-red-800' 
          },
          { 
            label: 'Advertencias', 
            valor: estadisticas.porTipo.warning || 0, 
            color: 'bg-yellow-100 text-yellow-800' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stat.color} mb-2`}>
              {stat.valor}
            </div>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Botón crear alerta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMostrarFormularioAlerta(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nueva Alerta</span>
        </motion.button>
      </motion.div>

      {/* Lista de alertas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {alertas.map((alerta, index) => {
          const iconoTipo = obtenerIconoTipo(alerta.tipo)
          const IconoTipo = iconoTipo.icono
          
          return (
            <motion.div
              key={alerta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${iconoTipo.bgColor}`}>
                    <IconoTipo className={`h-6 w-6 ${iconoTipo.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 text-lg">
                      {alerta.nombre}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {alerta.descripcion}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alerta.activa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {alerta.activa ? 'Activa' : 'Inactiva'}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAlerta(alerta.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                      title={alerta.activa ? 'Desactivar' : 'Activar'}
                    >
                      {alerta.activa ? (
                        <ChevronRightIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ChevronLeftIcon className="h-5 w-5 text-neutral-400" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAccionModal('editar')
                        setAlertaSeleccionada(alerta)
                        setMostrarModal(true)
                      }}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      title="Editar alerta"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => eliminarAlerta(alerta.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Eliminar alerta"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Detalles de la alerta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Configuración</h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div><strong>Tipo:</strong> {obtenerNombreTipo(alerta.tipo)}</div>
                    <div><strong>Umbral:</strong> {alerta.umbral}</div>
                    <div><strong>Métrica:</strong> {alerta.metrica}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Estado</h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div className="flex items-center space-x-2">
                      <span>Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alerta.activa 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {alerta.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div>Última activación: Nunca</div>
                    <div>Veces activada: 0</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Notificaciones</h4>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <div>Destinatarios: Admin, Meseros</div>
                    <div>Frecuencia: Inmediata</div>
                    <div>Canales: Sistema, Email</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modal de alerta */}
      {mostrarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              {accionModal === 'crear' ? 'Crear Nueva Alerta' : 'Editar Alerta'}
            </h3>

            <div className="space-y-4">
              <p className="text-neutral-600">
                {accionModal === 'crear' 
                  ? 'Formulario para crear nueva alerta'
                  : 'Formulario para editar alerta existente'
                }
              </p>
              <p className="text-sm text-neutral-500">
                Esta funcionalidad se implementaría con un formulario completo
                para crear/editar alertas con validaciones y configuración avanzada.
              </p>
              
              {alertaSeleccionada && (
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Alerta seleccionada: {alertaSeleccionada.nombre}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {alertaSeleccionada.descripcion}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-800 mb-2">
          Tipos de Alertas Disponibles
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Advertencia:</strong> Situaciones que requieren atención</li>
          <li>• <strong>Información:</strong> Notificaciones informativas</li>
          <li>• <strong>Error:</strong> Situaciones críticas que requieren acción inmediata</li>
          <li>• <strong>Éxito:</strong> Confirmaciones de acciones completadas</li>
        </ul>
      </motion.div>

      {/* Formulario de Alerta */}
      <FormularioAlerta
        isOpen={mostrarFormularioAlerta}
        onClose={() => setMostrarFormularioAlerta(false)}
        onAlertaCreada={(nuevaAlerta) => {
          // Aquí se actualizaría la lista de alertas
          console.log('Alerta creada:', nuevaAlerta)
        }}
      />
    </div>
  )
}

export default AlertasAdmin
