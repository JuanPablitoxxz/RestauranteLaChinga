import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { facturasMock, pedidosMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { 
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ReceiptPercentIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const CobrosCajero = () => {
  const queryClient = useQueryClient()
  const [filtro, setFiltro] = useState('pendientes') // pendientes, pagadas, todas
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [busqueda, setBusqueda] = useState('')
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null)
  const [mostrarModalPago, setMostrarModalPago] = useState(false)

  // Obtener facturas
  const { data: facturas, isLoading: isLoadingFacturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => facturasMock,
    staleTime: 5 * 60 * 1000
  })

  // Obtener pedidos
  const { data: pedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => pedidosMock,
    staleTime: 5 * 60 * 1000
  })

  // Filtrar facturas
  const facturasFiltradas = facturas?.filter(factura => {
    const cumpleFiltro = filtro === 'todas' || factura.estado === filtro
    const cumpleBusqueda = busqueda === '' || 
      factura.id.toString().includes(busqueda) ||
      factura.mesaId.toString().includes(busqueda)
    
    return cumpleFiltro && cumpleBusqueda
  }) || []

  // Mutación para procesar pago
  const procesarPagoMutation = useMutation({
    mutationFn: async ({ facturaId, metodoPago }) => {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, reciboId: Date.now() }
    },
    onSuccess: () => {
      toast.success('Pago procesado exitosamente')
      setMostrarModalPago(false)
      setFacturaSeleccionada(null)
      queryClient.invalidateQueries(['facturas'])
    },
    onError: () => {
      toast.error('Error al procesar el pago')
    }
  })

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
          icono: ExclamationTriangleIcon 
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

  const procesarPago = async () => {
    if (!facturaSeleccionada) return

    await procesarPagoMutation.mutateAsync({
      facturaId: facturaSeleccionada.id,
      metodoPago
    })
  }

  const obtenerPedidoFactura = (factura) => {
    return pedidos?.find(p => p.id === factura.pedidoId)
  }

  const calcularEstadisticas = () => {
    const total = facturas?.length || 0
    const pendientes = facturas?.filter(f => f.estado === 'pendiente').length || 0
    const pagadas = facturas?.filter(f => f.estado === 'pagada').length || 0
    const totalVentas = facturas?.filter(f => f.estado === 'pagada')
      .reduce((sum, f) => sum + f.total, 0) || 0

    return { total, pendientes, pagadas, totalVentas }
  }

  const estadisticas = calcularEstadisticas()

  if (isLoadingFacturas) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
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
          Gestión de Cobros
        </h1>
        <p className="text-neutral-600">
          Procesa pagos y gestiona facturas
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
            label: 'Total Facturas', 
            valor: estadisticas.total, 
            color: 'bg-blue-100 text-blue-800' 
          },
          { 
            label: 'Pendientes', 
            valor: estadisticas.pendientes, 
            color: 'bg-yellow-100 text-yellow-800' 
          },
          { 
            label: 'Pagadas', 
            valor: estadisticas.pagadas, 
            color: 'bg-green-100 text-green-800' 
          },
          { 
            label: 'Total Ventas', 
            valor: `$${estadisticas.totalVentas.toLocaleString()}`, 
            color: 'bg-primary-100 text-primary-800' 
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

      {/* Filtros y búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'pagadas', label: 'Pagadas' },
              { value: 'todas', label: 'Todas' }
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

          {/* Búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por ID o mesa..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de facturas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {facturasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <ReceiptPercentIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No hay facturas
            </h2>
            <p className="text-neutral-600">
              {filtro === 'todas' 
                ? 'No hay facturas registradas'
                : `No hay facturas ${filtro === 'pendientes' ? 'pendientes' : 'pagadas'}`
              }
            </p>
          </div>
        ) : (
          facturasFiltradas.map((factura, index) => {
            const estado = obtenerEstadoFactura(factura.estado)
            const EstadoIcono = estado.icono
            const MetodoIcono = obtenerMetodoPagoIcono(factura.metodoPago)
            const pedido = obtenerPedidoFactura(factura)
            
            return (
              <motion.div
                key={factura.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-800">
                        #{factura.id}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        Factura #{factura.id}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Mesa {factura.mesaId} • {format(new Date(factura.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bgColor} ${estado.color}`}>
                    <div className="flex items-center space-x-2">
                      <EstadoIcono className="h-4 w-4" />
                      <span>{estado.texto}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Información del pedido */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Pedido</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <p>ID: #{factura.pedidoId}</p>
                      <p>Items: {pedido?.items?.length || 0}</p>
                      <p>Mesero: Carlos Mendoza</p>
                    </div>
                  </div>

                  {/* Detalles del pago */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Pago</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${factura.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Propina:</span>
                        <span>${factura.propina.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-neutral-800">
                        <span>Total:</span>
                        <span>${factura.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Método</h4>
                    <div className="flex items-center space-x-2">
                      <MetodoIcono className="h-5 w-5 text-neutral-600" />
                      <span className="text-sm text-neutral-600 capitalize">
                        {factura.metodoPago}
                      </span>
                    </div>
                    {factura.fechaPago && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Pagado: {format(new Date(factura.fechaPago), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-3">
                  {factura.estado === 'pendiente' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFacturaSeleccionada(factura)
                        setMostrarModalPago(true)
                      }}
                      className="btn-primary"
                    >
                      Procesar Pago
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                  >
                    Ver Detalles
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                  >
                    Imprimir Recibo
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Modal de pago */}
      {mostrarModalPago && facturaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModalPago(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              Procesar Pago - Factura #{facturaSeleccionada.id}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total a pagar:</span>
                  <span className="text-primary-800">
                    ${facturaSeleccionada.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-3">
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
                        className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                          metodoPago === metodo.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <IconoMetodo className="h-6 w-6 mx-auto mb-1 text-neutral-600" />
                        <span className="text-xs font-medium text-neutral-800">{metodo.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarModalPago(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={procesarPago}
                disabled={procesarPagoMutation.isPending}
                className={`flex-1 ${
                  procesarPagoMutation.isPending
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {procesarPagoMutation.isPending ? 'Procesando...' : 'Confirmar Pago'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CobrosCajero
