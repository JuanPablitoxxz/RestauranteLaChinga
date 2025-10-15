import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { mesasMock, reservasMock } from '../../data/mockData'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  MapPinIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const MesaCliente = () => {
  const { usuario } = useAuthStore()
  const [mesaAsignada, setMesaAsignada] = useState(null)

  // Obtener mesas
  const { data: mesas, isLoading: isLoadingMesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  // Obtener reservas del cliente
  const { data: reservasCliente, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reservas-cliente', usuario?.id],
    queryFn: () => reservasMock.filter(r => r.clienteId === usuario?.id),
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    // Simular asignación de mesa basada en reserva activa
    const reservaActiva = reservasCliente?.find(reserva => {
      const fechaReserva = new Date(reserva.fecha)
      const hoy = new Date()
      return fechaReserva.toDateString() === hoy.toDateString() && 
             reserva.estado === 'confirmada'
    })

    if (reservaActiva) {
      const mesa = mesas?.find(m => m.id === reservaActiva.mesaId)
      if (mesa) {
        setMesaAsignada({ ...mesa, reserva: reservaActiva })
      }
    }
  }, [mesas, reservasCliente])

  const obtenerEstadoMesa = (mesa) => {
    if (mesa.estado === 'libre') {
      return { 
        texto: 'Libre', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        icono: CheckCircleIcon 
      }
    } else if (mesa.estado === 'ocupada') {
      return { 
        texto: 'Ocupada', 
        color: 'text-primary-600', 
        bgColor: 'bg-primary-100',
        icono: UserGroupIcon 
      }
    } else if (mesa.estado === 'con_pedido') {
      return { 
        texto: 'Con Pedido', 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100',
        icono: ClockIcon 
      }
    } else if (mesa.estado === 'pendiente_pago') {
      return { 
        texto: 'Pendiente Pago', 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100',
        icono: ExclamationTriangleIcon 
      }
    } else {
      return { 
        texto: 'No disponible', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        icono: XCircleIcon 
      }
    }
  }

  const obtenerColorUbicacion = (ubicacion) => {
    const colores = {
      interior: 'bg-blue-100 text-blue-800',
      terraza: 'bg-green-100 text-green-800',
      jardin: 'bg-purple-100 text-purple-800'
    }
    return colores[ubicacion] || 'bg-neutral-100 text-neutral-800'
  }

  if (isLoadingMesas || isLoadingReservas) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Mi Mesa
        </h1>
        <p className="text-neutral-600">
          Información sobre tu mesa asignada
        </p>
      </motion.div>

      {/* Mesa asignada */}
      {mesaAsignada ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary-800">
              Mesa {mesaAsignada.numero}
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorUbicacion(mesaAsignada.ubicacion)}`}>
              {mesaAsignada.ubicacion}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de la mesa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Información de la mesa
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Capacidad:</span>
                  <span className="font-medium text-neutral-800">
                    {mesaAsignada.capacidad} personas
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Ubicación:</span>
                  <span className="font-medium text-neutral-800 capitalize">
                    {mesaAsignada.ubicacion}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-600">Estado:</span>
                  <span className={`font-medium ${obtenerEstadoMesa(mesaAsignada).color}`}>
                    {obtenerEstadoMesa(mesaAsignada).texto}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de la reserva */}
            {mesaAsignada.reserva && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Información de la reserva
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-neutral-600" />
                    <span className="text-neutral-600">Fecha:</span>
                    <span className="font-medium text-neutral-800">
                      {format(new Date(mesaAsignada.reserva.fecha), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-neutral-600" />
                    <span className="text-neutral-600">Hora:</span>
                    <span className="font-medium text-neutral-800">
                      {mesaAsignada.reserva.hora}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className="h-5 w-5 text-neutral-600" />
                    <span className="text-neutral-600">Personas:</span>
                    <span className="font-medium text-neutral-800">
                      {mesaAsignada.reserva.cantidadPersonas}
                    </span>
                  </div>

                  {mesaAsignada.reserva.observaciones && (
                    <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">
                        <strong>Observaciones:</strong> {mesaAsignada.reserva.observaciones}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                Ver Carta
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Llamar Mesero
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Solicitar Cuenta
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200"
        >
          <MapPinIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            No tienes mesa asignada
          </h2>
          <p className="text-neutral-600 mb-6">
            Haz una reserva para obtener una mesa o acércate a la recepción
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            Hacer Reserva
          </motion.button>
        </motion.div>
      )}

      {/* Mapa de mesas (vista general) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Mapa de Mesas
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mesas?.map((mesa, index) => {
            const estado = obtenerEstadoMesa(mesa)
            const EstadoIcono = estado.icono
            const esMiMesa = mesaAsignada?.id === mesa.id
            
            return (
              <motion.div
                key={mesa.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  esMiMesa
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {esMiMesa && (
                  <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    Tu mesa
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800 mb-2">
                    {mesa.numero}
                  </div>
                  
                  <div className="flex items-center justify-center mb-2">
                    <EstadoIcono className={`h-5 w-5 ${estado.color}`} />
                  </div>
                  
                  <div className="text-xs text-neutral-600 mb-1">
                    {mesa.capacidad} personas
                  </div>
                  
                  <div className="text-xs text-neutral-500 capitalize">
                    {mesa.ubicacion}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">
            Leyenda:
          </h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span>Libre</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-4 w-4 text-primary-600" />
              <span>Ocupada</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4 text-yellow-600" />
              <span>Con Pedido</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
              <span>Pendiente Pago</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MesaCliente
