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
  MagnifyingGlassIcon,
  PrinterIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon
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
  const [mostrarModalCancelacion, setMostrarModalCancelacion] = useState(false)
  const [motivoCancelacion, setMotivoCancelacion] = useState('')

  // Obtener facturas
  const { data: facturas, isLoading: isLoadingFacturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => {
      console.log('🔍 Obteniendo facturas para cajero...')
      
      // Verificar todas las claves de localStorage
      console.log('🔍 Todas las claves localStorage:', Object.keys(localStorage))
      
      // Obtener facturas enviadas por clientes
      const facturasEnviadasPorClientes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      console.log('📤 Facturas enviadas por clientes:', facturasEnviadasPorClientes)
      console.log('📤 Detalle de facturas enviadas:', JSON.stringify(facturasEnviadasPorClientes, null, 2))
      
      // Verificar localStorage directamente
      const rawData = localStorage.getItem('facturasPendientesCajero')
      console.log('🔍 Raw localStorage data:', rawData)
      
      // También verificar otras claves posibles
      const facturasAlternativas = JSON.parse(localStorage.getItem('facturasParaReportes') || '[]')
      console.log('📊 Facturas alternativas:', facturasAlternativas)
      
      // SIEMPRE crear factura de prueba para testing
      console.log('🧪 Creando factura de prueba SIEMPRE...')
      const facturasDePrueba = [{
        id: Date.now(),
        numero: 'FAC-TEST-001',
        cliente: 'Cliente de Prueba',
        mesa: 5,
        mesero: 'Mesero de Prueba',
        total: 250.00,
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        items: [
          { id: 1, nombre: 'Taco de Prueba', cantidad: 2, precio: 25.00, subtotal: 50.00 }
        ],
        subtotal: 200.00,
        iva: 32.00,
        propina: 18.00,
        metodo_pago: 'efectivo',
        estado: 'pendiente_cobro',
        enviada_por_cliente: true,
        fecha_envio: new Date().toISOString(),
        fechaCreacion: new Date().toISOString(),
        mesaId: 5,
        pedidoId: Date.now()
      }]
      
      // SIEMPRE guardar factura de prueba
      localStorage.setItem('facturasPendientesCajero', JSON.stringify(facturasDePrueba))
      console.log('✅ Factura de prueba SIEMPRE creada y guardada')
      
      // Combinar todas las facturas
      const facturasCombinadas = [...facturasMock, ...facturasEnviadasPorClientes, ...facturasAlternativas, ...facturasDePrueba]
      console.log('📋 Total facturas combinadas:', facturasCombinadas.length)
      console.log('📋 Facturas mock:', facturasMock.length)
      console.log('📋 Facturas enviadas:', facturasEnviadasPorClientes.length)
      console.log('📋 Facturas alternativas:', facturasAlternativas.length)
      console.log('📋 Facturas de prueba:', facturasDePrueba.length)
      
      // Ordenar por fecha de creación (más recientes primero)
      const facturasOrdenadas = facturasCombinadas.sort((a, b) => {
        const fechaA = new Date(a.fechaCreacion || a.fecha_envio || Date.now())
        const fechaB = new Date(b.fechaCreacion || b.fecha_envio || Date.now())
        return fechaB - fechaA
      })
      
      console.log('✅ Facturas ordenadas:', facturasOrdenadas)
      console.log('✅ Facturas con estado pendiente_cobro:', facturasOrdenadas.filter(f => f.estado === 'pendiente_cobro'))
      return facturasOrdenadas
    },
    staleTime: 5 * 1000, // Reducir aún más el tiempo de caché
    refetchInterval: 5 * 1000 // Refrescar cada 5 segundos
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
      
      // Actualizar factura en localStorage
      const facturasPendientes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      const facturaIndex = facturasPendientes.findIndex(f => f.id === facturaId)
      
      if (facturaIndex !== -1) {
        // Marcar como pagada
        facturasPendientes[facturaIndex].estado = 'pagada'
        facturasPendientes[facturaIndex].fechaPago = new Date().toISOString()
        facturasPendientes[facturaIndex].metodoPago = metodoPago
        
        // Actualizar localStorage
        localStorage.setItem('facturasPendientesCajero', JSON.stringify(facturasPendientes))
        
        // También actualizar en reportes
        const facturasParaReportes = JSON.parse(localStorage.getItem('facturasParaReportes') || '[]')
        const reporteIndex = facturasParaReportes.findIndex(f => f.id === facturaId)
        
        if (reporteIndex !== -1) {
          facturasParaReportes[reporteIndex].estado = 'pagada'
          facturasParaReportes[reporteIndex].procesada = true
          facturasParaReportes[reporteIndex].fechaPago = new Date().toISOString()
          facturasParaReportes[reporteIndex].metodoPago = metodoPago
          localStorage.setItem('facturasParaReportes', JSON.stringify(facturasParaReportes))
        }
        
        console.log('✅ Factura procesada y actualizada en localStorage')
      }
      
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
      case 'pendiente_cobro':
        return { 
          texto: 'Enviada por Cliente', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          icono: PaperAirplaneIcon 
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

  // Función para generar factura de cancelación profesional
  const generarFacturaCancelacion = (factura) => {
    const fechaActual = new Date()
    const numeroCancelacion = `CANC-${Date.now()}`
    
    const facturaCancelacion = {
      numero: numeroCancelacion,
      fecha: fechaActual.toLocaleDateString('es-ES'),
      hora: fechaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      facturaOriginal: factura.id,
      motivo: motivoCancelacion,
      total: factura.total,
      subtotal: factura.subtotal,
      propina: factura.propina,
      iva: factura.iva || 0,
      mesa: factura.mesaId,
      cajero: 'Cajero Actual', // Aquí se obtendría del contexto de usuario
      items: factura.items || []
    }

    // Generar HTML para la factura de cancelación
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura de Cancelación - ${numeroCancelacion}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .factura-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #C62828, #2E7D32);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h3 {
            color: #C62828;
            font-size: 16px;
            margin: 0 0 10px 0;
            border-bottom: 2px solid #C62828;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info-row strong {
            color: #2E7D32;
          }
          .total-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
            color: #C62828;
            margin-bottom: 10px;
          }
          .motivo {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 10px;
            margin-top: 15px;
          }
          .motivo h4 {
            margin: 0 0 5px 0;
            color: #856404;
            font-size: 14px;
          }
          .motivo p {
            margin: 0;
            color: #856404;
            font-size: 13px;
          }
          .footer {
            background: #2E7D32;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 12px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .items-table th,
          .items-table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .items-table th {
            background: #f8f9fa;
            color: #2E7D32;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="factura-container">
          <div class="header">
            <h1>🇲🇽 LA CHINGA</h1>
            <p>Restaurante Mexicano Auténtico</p>
            <p>FACTURA DE CANCELACIÓN</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Información de Cancelación</h3>
              <div class="info-row">
                <span>Número de Cancelación:</span>
                <strong>${facturaCancelacion.numero}</strong>
              </div>
              <div class="info-row">
                <span>Factura Original:</span>
                <strong>#${facturaCancelacion.facturaOriginal}</strong>
              </div>
              <div class="info-row">
                <span>Fecha:</span>
                <strong>${facturaCancelacion.fecha}</strong>
              </div>
              <div class="info-row">
                <span>Hora:</span>
                <strong>${facturaCancelacion.hora}</strong>
              </div>
              <div class="info-row">
                <span>Mesa:</span>
                <strong>${facturaCancelacion.mesa}</strong>
              </div>
              <div class="info-row">
                <span>Cajero:</span>
                <strong>${facturaCancelacion.cajero}</strong>
              </div>
            </div>

            ${facturaCancelacion.items.length > 0 ? `
            <div class="section">
              <h3>🍽️ Items Cancelados</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${facturaCancelacion.items.map(item => `
                    <tr>
                      <td>${item.nombre}</td>
                      <td>${item.cantidad}</td>
                      <td>$${item.precio.toFixed(2)}</td>
                      <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>$${facturaCancelacion.subtotal.toFixed(2)}</span>
              </div>
              ${facturaCancelacion.iva > 0 ? `
              <div class="total-row">
                <span>IVA (16%):</span>
                <span>$${facturaCancelacion.iva.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row">
                <span>Propina:</span>
                <span>$${facturaCancelacion.propina.toFixed(2)}</span>
              </div>
              <div class="total-row" style="border-top: 2px solid #C62828; padding-top: 10px;">
                <span>TOTAL CANCELADO:</span>
                <span>$${facturaCancelacion.total.toFixed(2)}</span>
              </div>
            </div>

            <div class="motivo">
              <h4>📝 Motivo de Cancelación:</h4>
              <p>${facturaCancelacion.motivo || 'No especificado'}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>¡Gracias por visitar La Chinga!</p>
            <p>Este documento es válido como comprobante de cancelación</p>
            <p>Generado el ${fechaActual.toLocaleString('es-ES')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    return { facturaCancelacion, htmlContent }
  }

  // Función para imprimir factura de cancelación
  const imprimirFacturaCancelacion = (factura) => {
    const { htmlContent } = generarFacturaCancelacion(factura)
    
    const ventanaImpresion = window.open('', '_blank')
    ventanaImpresion.document.write(htmlContent)
    ventanaImpresion.document.close()
    
    // Esperar a que se cargue el contenido y luego imprimir
    ventanaImpresion.onload = () => {
      ventanaImpresion.print()
      ventanaImpresion.close()
    }
    
    toast.success('Factura de cancelación generada')
  }

  // Función para descargar factura de cancelación como PDF
  const descargarFacturaCancelacion = (factura) => {
    const { htmlContent } = generarFacturaCancelacion(factura)
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cancelacion-${factura.id}-${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Factura de cancelación descargada')
  }

  // Función para cancelar factura
  const cancelarFactura = async () => {
    if (!facturaSeleccionada || !motivoCancelacion.trim()) {
      toast.error('Por favor ingresa un motivo de cancelación')
      return
    }

    try {
      // Aquí se haría la llamada a la API para cancelar la factura
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generar y mostrar la factura de cancelación
      imprimirFacturaCancelacion(facturaSeleccionada)
      
      toast.success('Factura cancelada exitosamente')
      setMostrarModalCancelacion(false)
      setFacturaSeleccionada(null)
      setMotivoCancelacion('')
      
      // Actualizar la lista de facturas
      queryClient.invalidateQueries(['facturas'])
    } catch (error) {
      toast.error('Error al cancelar la factura')
    }
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
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
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
            label: 'Enviadas por Cliente', 
            valor: facturas?.filter(f => f.estado === 'pendiente_cobro').length || 0, 
            color: 'bg-purple-100 text-purple-800' 
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
              { value: 'pendiente_cobro', label: 'Enviadas por Cliente' },
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

          {/* Búsqueda y refrescar */}
          <div className="flex space-x-3">
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log('🔄 Refrescando manualmente...')
                queryClient.invalidateQueries(['facturas'])
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refrescar</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log('📤 Simulando envío de factura desde cliente...')
                const nuevaFactura = {
                  id: Date.now(),
                  numero: `FAC-${Date.now()}`,
                  cliente: 'Cliente Simulado',
                  mesa: Math.floor(Math.random() * 24) + 1,
                  mesero: 'Mesero Simulado',
                  total: Math.floor(Math.random() * 500) + 100,
                  fecha: new Date().toLocaleDateString('es-ES'),
                  hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                  items: [
                    { id: 1, nombre: 'Taco Simulado', cantidad: 2, precio: 25.00, subtotal: 50.00 }
                  ],
                  subtotal: 200.00,
                  iva: 32.00,
                  propina: 18.00,
                  metodo_pago: 'efectivo',
                  estado: 'pendiente_cobro',
                  enviada_por_cliente: true,
                  fecha_envio: new Date().toISOString(),
                  fechaCreacion: new Date().toISOString(),
                  mesaId: Math.floor(Math.random() * 24) + 1,
                  pedidoId: Date.now()
                }
                
                // Agregar a localStorage
                const facturasExistentes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
                facturasExistentes.push(nuevaFactura)
                localStorage.setItem('facturasPendientesCajero', JSON.stringify(facturasExistentes))
                
                console.log('✅ Factura simulada agregada:', nuevaFactura)
                queryClient.invalidateQueries(['facturas'])
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Simular Cliente</span>
            </motion.button>
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
                        Factura #{factura.numero || factura.id}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Mesa {factura.mesa || factura.mesaId} • {format(new Date(factura.fechaCreacion || factura.fecha_envio), 'dd/MM/yyyy HH:mm', { locale: es })}
                        {factura.enviada_por_cliente && (
                          <span className="ml-2 text-blue-600 font-medium">• Enviada por cliente</span>
                        )}
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
                      <p>ID: #{factura.pedidoId || 'N/A'}</p>
                      <p>Items: {factura.items?.length || pedido?.items?.length || 0}</p>
                      <p>Mesero: {factura.mesero || 'Carlos Mendoza'}</p>
                      {factura.cliente && (
                        <p>Cliente: {factura.cliente}</p>
                      )}
                    </div>
                  </div>

                  {/* Detalles del pago */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-2">Pago</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${(factura.subtotal || 0).toLocaleString()}</span>
                      </div>
                      {factura.iva > 0 && (
                        <div className="flex justify-between">
                          <span>IVA (16%):</span>
                          <span>${(factura.iva || 0).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Propina:</span>
                        <span>${(factura.propina || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-neutral-800">
                        <span>Total:</span>
                        <span>${(factura.total || 0).toLocaleString()}</span>
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
                <div className="flex flex-wrap gap-2">
                  {(factura.estado === 'pendiente' || factura.estado === 'pendiente_cobro') && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFacturaSeleccionada(factura)
                          setMostrarModalPago(true)
                        }}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Procesar Pago</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFacturaSeleccionada(factura)
                          setMostrarModalCancelacion(true)
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancelar</span>
                      </motion.button>
                    </>
                  )}
                  
                  {factura.estado === 'pagada' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => imprimirFacturaCancelacion(factura)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <PrinterIcon className="h-4 w-4" />
                        <span>Imprimir</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => descargarFacturaCancelacion(factura)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span>Descargar</span>
                      </motion.button>
                    </>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>Ver Detalles</span>
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

      {/* Modal de cancelación */}
      {mostrarModalCancelacion && facturaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModalCancelacion(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-600">
                Cancelar Factura #{facturaSeleccionada.id}
              </h3>
              <button
                onClick={() => setMostrarModalCancelacion(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between text-lg font-semibold text-red-800">
                  <span>Total a cancelar:</span>
                  <span>${facturaSeleccionada.total.toLocaleString()}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Mesa {facturaSeleccionada.mesaId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Motivo de cancelación *
                </label>
                <textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Describe el motivo de la cancelación..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Importante:</strong> Esta acción generará una factura de cancelación profesional que se imprimirá automáticamente.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarModalCancelacion(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={cancelarFactura}
                disabled={!motivoCancelacion.trim()}
                className={`flex-1 ${
                  !motivoCancelacion.trim()
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                } px-4 py-2 rounded-lg transition-colors`}
              >
                Confirmar Cancelación
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CobrosCajero
