import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { facturasMock, pedidosMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  DocumentTextIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const FacturaCliente = () => {
  const { usuario } = useAuthStore()
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [isPagando, setIsPagando] = useState(false)

  // Obtener facturas del cliente
  const { data: facturasCliente, isLoading: isLoadingFacturas } = useQuery({
    queryKey: ['facturas-cliente', usuario?.id],
    queryFn: () => facturasMock.filter(f => f.clienteId === usuario?.id),
    staleTime: 5 * 60 * 1000
  })

  // Obtener pedidos del cliente
  const { data: pedidosCliente } = useQuery({
    queryKey: ['pedidos-cliente', usuario?.id],
    queryFn: () => pedidosMock.filter(p => p.clienteId === usuario?.id),
    staleTime: 5 * 60 * 1000
  })

  const facturaPendiente = facturasCliente?.find(f => f.estado === 'pendiente')
  const pedidoActual = pedidosCliente?.find(p => p.estado === 'listo' || p.estado === 'entregado')

  const obtenerEstadoFactura = (estado) => {
    switch (estado) {
      case 'pagada':
        return { 
          texto: 'Pagada', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icono: CheckCircleIcon 
        }
      case 'pendiente':
        return { 
          texto: 'Pendiente', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          icono: ClockIcon 
        }
      case 'cancelada':
        return { 
          texto: 'Cancelada', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icono: XCircleIcon 
        }
      default:
        return { 
          texto: 'Desconocido', 
          color: 'text-neutral-600', 
          bgColor: 'bg-neutral-100',
          icono: ClockIcon 
        }
    }
  }

  const procesarPago = async () => {
    if (!facturaPendiente) {
      toast.error('No hay factura pendiente')
      return
    }

    setIsPagando(true)

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('¡Pago procesado exitosamente!')
      
      // Aquí se actualizaría la factura en el backend
      console.log('Pago procesado:', {
        facturaId: facturaPendiente.id,
        metodoPago,
        monto: facturaPendiente.total
      })
      
    } catch (error) {
      toast.error('Error al procesar el pago')
    } finally {
      setIsPagando(false)
    }
  }

  const obtenerMetodoPagoIcono = (metodo) => {
    switch (metodo) {
      case 'efectivo':
        return BanknotesIcon
      case 'tarjeta':
        return CreditCardIcon
      case 'qr':
        return QrCodeIcon
      default:
        return CreditCardIcon
    }
  }

  if (isLoadingFacturas) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Mi Factura
        </h1>
        <p className="text-neutral-600">
          Gestiona tus pagos y facturas
        </p>
      </motion.div>

      {/* Factura pendiente */}
      {facturaPendiente ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary-800">
              Factura #{facturaPendiente.id}
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerEstadoFactura(facturaPendiente.estado).bgColor} ${obtenerEstadoFactura(facturaPendiente.estado).color}`}>
              {obtenerEstadoFactura(facturaPendiente.estado).texto}
            </div>
          </div>

          {/* Información de la factura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                Información del pedido
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Mesa:</span>
                  <span className="font-medium">Mesa {facturaPendiente.mesaId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fecha:</span>
                  <span className="font-medium">
                    {format(new Date(facturaPendiente.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Mesero:</span>
                  <span className="font-medium">Carlos Mendoza</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                Detalles del pago
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-medium">${facturaPendiente.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Propina:</span>
                  <span className="font-medium">${facturaPendiente.propina.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-neutral-200 pt-2">
                  <span className="text-neutral-800">Total:</span>
                  <span className="text-primary-800">${facturaPendiente.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items del pedido */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Items del pedido
            </h3>
            
            <div className="space-y-3">
              {pedidoActual?.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <div className="flex-1">
                    <span className="font-medium text-neutral-800">{item.nombre}</span>
                    <span className="text-neutral-600 ml-2">x{item.cantidad}</span>
                  </div>
                  <span className="font-medium text-neutral-800">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Método de pago
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'efectivo', label: 'Efectivo', icono: BanknotesIcon },
                { value: 'tarjeta', label: 'Tarjeta', icono: CreditCardIcon },
                { value: 'qr', label: 'QR', icono: QrCodeIcon }
              ].map((metodo) => {
                const IconoMetodo = metodo.icono
                return (
                  <motion.button
                    key={metodo.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMetodoPago(metodo.value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                      metodoPago === metodo.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <IconoMetodo className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
                    <span className="font-medium text-neutral-800">{metodo.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Botón de pago */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={procesarPago}
            disabled={isPagando}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
              isPagando
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {isPagando ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Procesando pago...
              </div>
            ) : (
              `Pagar $${facturaPendiente.total.toLocaleString()}`
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200"
        >
          <DocumentTextIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            No hay factura pendiente
          </h2>
          <p className="text-neutral-600 mb-6">
            Realiza un pedido para generar una factura
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            Ver Carta
          </motion.button>
        </motion.div>
      )}

      {/* Historial de facturas */}
      {facturasCliente && facturasCliente.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">
            Historial de Facturas
          </h2>

          <div className="space-y-4">
            {facturasCliente.map((factura, index) => {
              const estado = obtenerEstadoFactura(factura.estado)
              const EstadoIcono = estado.icono
              const MetodoIcono = obtenerMetodoPagoIcono(factura.metodoPago)
              
              return (
                <motion.div
                  key={factura.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <EstadoIcono className={`h-5 w-5 ${estado.color}`} />
                      <span className="font-semibold text-neutral-800">
                        Factura #{factura.id}
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-600">
                      {format(new Date(factura.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-neutral-800">
                        ${factura.total.toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-neutral-600">
                        <MetodoIcono className="h-4 w-4" />
                        <span className="capitalize">{factura.metodoPago}</span>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                      {estado.texto}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Información de pagos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-800 mb-2">
          Métodos de pago disponibles
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Efectivo:</strong> Pago en efectivo al mesero</li>
          <li>• <strong>Tarjeta:</strong> Débito o crédito (Visa, Mastercard)</li>
          <li>• <strong>QR:</strong> Pago móvil con código QR</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default FacturaCliente
