import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  MapPinIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import InfoMesaCliente from '../../components/InfoMesaCliente'
import { useMenuDinamico } from '../../hooks/useMenuDinamico'

const DashboardCliente = () => {
  const navigate = useNavigate()
  
  // Hook para menús dinámicos
  const { menuActual, horaActual, obtenerNombreMenu, esHorarioValido } = useMenuDinamico()

  // Datos mock de la mesa y reserva del cliente
  const mesaCliente = {
    id: 5,
    numero: 5,
    capacidad: 4,
    ubicacion: 'interior',
    estado: 'ocupada'
  }

  const reservaCliente = {
    id: 1,
    fecha: '2024-01-16',
    hora: '19:00',
    personas: 4,
    mesa_id: 5,
    observaciones: 'Celebración de cumpleaños',
    cliente_nombre: 'María González'
  }

  const opcionesMenu = [
    {
      id: 'carta',
      titulo: 'Ver Carta',
      descripcion: 'Explora nuestro menú mexicano',
      icono: ShoppingCartIcon,
      color: 'mexico-verde',
      accion: () => navigate('/cliente/carta'),
      disponible: esHorarioValido
    },
    {
      id: 'pedido',
      titulo: 'Mi Pedido',
      descripcion: 'Revisa tu pedido actual',
      icono: ClockIcon,
      color: 'mexico-dorado',
      accion: () => navigate('/cliente/pedido'),
      disponible: true
    },
    {
      id: 'factura',
      titulo: 'Mi Factura',
      descripcion: 'Descarga tu factura',
      icono: DocumentTextIcon,
      color: 'mexico-rojo',
      accion: () => navigate('/cliente/factura'),
      disponible: true
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
          ¡Bienvenido a La Chinga! 🇲🇽
        </h1>
        <p className="text-neutral-600">
          Hola {reservaCliente.cliente_nombre}, tu mesa está lista
        </p>
      </motion.div>

      {/* Información de la mesa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <InfoMesaCliente mesa={mesaCliente} reserva={reservaCliente} />
      </motion.div>

      {/* Información del menú actual */}
      {esHorarioValido && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-mexico-verde-50 border border-mexico-verde-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-mexico-verde-600" />
              <div>
                <p className="text-sm font-medium text-mexico-verde-800">
                  Menú actual: {obtenerNombreMenu(menuActual)}
                </p>
                <p className="text-xs text-mexico-verde-700">
                  Hora: {horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Opciones del menú */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {opcionesMenu.map(opcion => {
          const Icono = opcion.icono
          const colorClasses = {
            'mexico-verde': 'bg-mexico-verde-100 text-mexico-verde-600 hover:bg-mexico-verde-200',
            'mexico-dorado': 'bg-mexico-dorado-100 text-mexico-dorado-600 hover:bg-mexico-dorado-200',
            'mexico-rojo': 'bg-mexico-rojo-100 text-mexico-rojo-600 hover:bg-mexico-rojo-200'
          }

          return (
            <motion.button
              key={opcion.id}
              onClick={opcion.accion}
              disabled={!opcion.disponible}
              whileHover={{ scale: opcion.disponible ? 1.02 : 1 }}
              whileTap={{ scale: opcion.disponible ? 0.98 : 1 }}
              className={`p-6 rounded-lg border-2 border-neutral-200 transition-all ${
                opcion.disponible 
                  ? 'hover:shadow-lg cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${colorClasses[opcion.color]}`}>
                  <Icono className="h-8 w-8" />
                </div>
                
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {opcion.titulo}
                </h3>
                
                <p className="text-sm text-neutral-600 mb-4">
                  {opcion.descripcion}
                </p>

                {!opcion.disponible && opcion.id === 'carta' && (
                  <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    Fuera del horario de servicio
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-neutral-50 rounded-lg border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">
          Información Importante
        </h3>
        <ul className="text-sm text-neutral-600 space-y-2">
          <li>• Tu acceso es válido solo para el día de hoy</li>
          <li>• Puedes hacer pedidos desde la carta cuando esté disponible</li>
          <li>• Revisa tu pedido en tiempo real</li>
          <li>• Descarga tu factura al finalizar</li>
          <li>• ¡Disfruta de nuestros sabores mexicanos! 🇲🇽</li>
        </ul>
      </motion.div>

    </div>
  )
}

export default DashboardCliente
