import { motion } from 'framer-motion'
import { 
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const InfoMesaCliente = ({ mesa, reserva }) => {
  if (!mesa || !reserva) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <p className="text-neutral-600 text-center">
          Información de mesa no disponible
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-mexico-verde-100 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-mexico-verde-600">M{mesa.numero}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">
            Mesa {mesa.numero}
          </h3>
          <p className="text-sm text-neutral-600 capitalize">
            {mesa.ubicacion} • {mesa.capacidad} personas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información de la reserva */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-700">Información de la Reserva</h4>
          
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <ClockIcon className="h-4 w-4" />
            <span>
              {new Date(reserva.fecha).toLocaleDateString('es-ES')} a las {reserva.hora}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <UserGroupIcon className="h-4 w-4" />
            <span>{reserva.personas} personas</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <MapPinIcon className="h-4 w-4" />
            <span className="capitalize">{mesa.ubicacion}</span>
          </div>
        </div>

        {/* Estado de la mesa */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-700">Estado Actual</h4>
          
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              Mesa Asignada
            </span>
          </div>
          
          <div className="p-3 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200">
            <p className="text-xs text-mexico-verde-700">
              <strong>Bienvenido a La Chinga!</strong><br />
              Tu mesa está lista para disfrutar de nuestros sabores mexicanos.
            </p>
          </div>
        </div>
      </div>

      {reserva.observaciones && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-700 mb-1">Observaciones</h4>
          <p className="text-sm text-neutral-600">{reserva.observaciones}</p>
        </div>
      )}
    </motion.div>
  )
}

export default InfoMesaCliente
