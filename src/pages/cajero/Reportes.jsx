import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { facturasMock, pedidosMock, mesasMock } from '../../data/mockData'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { format, startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const ReportesCajero = () => {
  const [periodo, setPeriodo] = useState('hoy') // Solo reportes del día
  const [tipoReporte, setTipoReporte] = useState('ventas') // ventas, mesas, pedidos

  // Obtener datos
  const { data: facturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => {
      console.log('📊 Obteniendo facturas para reportes...')
      
      // Combinar facturas mock con facturas enviadas por clientes
      const facturasEnviadasPorClientes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      const facturasParaReportes = JSON.parse(localStorage.getItem('facturasParaReportes') || '[]')
      
      console.log('📤 Facturas enviadas por clientes:', facturasEnviadasPorClientes.length)
      console.log('📊 Facturas para reportes:', facturasParaReportes.length)
      
      // Combinar todas las facturas
      const facturasCombinadas = [...facturasMock, ...facturasEnviadasPorClientes, ...facturasParaReportes]
      
      // Eliminar duplicados por ID
      const facturasUnicas = facturasCombinadas.filter((factura, index, self) => 
        index === self.findIndex(f => f.id === factura.id)
      )
      
      console.log('✅ Total facturas únicas para reportes:', facturasUnicas.length)
      return facturasUnicas
    },
    staleTime: 30 * 1000, // Reducir tiempo de caché
    refetchInterval: 10 * 1000 // Refrescar cada 10 segundos
  })

  const { data: pedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => pedidosMock,
    staleTime: 5 * 60 * 1000
  })

  const { data: mesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  const obtenerRangoFechas = () => {
    const hoy = new Date()
    // Solo reportes del día actual
    return {
      inicio: startOfDay(hoy),
      fin: endOfDay(hoy)
    }
  }

  const { inicio, fin } = obtenerRangoFechas()

  const filtrarDatosPorFecha = (datos) => {
    return datos?.filter(item => {
      const fechaItem = new Date(item.fechaCreacion || item.fechaPago || item.fecha_envio)
      return fechaItem >= inicio && fechaItem <= fin
    }) || []
  }

  const facturasFiltradas = filtrarDatosPorFecha(facturas)
  const pedidosFiltrados = filtrarDatosPorFecha(pedidos)

  const calcularEstadisticas = () => {
    const facturasPagadas = facturasFiltradas.filter(f => f.estado === 'pagada')
    
    const totalVentas = facturasPagadas.reduce((sum, f) => sum + f.total, 0)
    const totalFacturas = facturasPagadas.length
    const promedioTicket = totalFacturas > 0 ? totalVentas / totalFacturas : 0
    const totalPropinas = facturasPagadas.reduce((sum, f) => sum + f.propina, 0)

    return {
      totalVentas,
      totalFacturas,
      promedioTicket,
      totalPropinas
    }
  }

  const estadisticas = calcularEstadisticas()

  const obtenerDatosGraficoVentas = () => {
    const datos = []
    // Solo reportes por hora del día actual
    const horas = 24
    
    for (let i = horas - 1; i >= 0; i--) {
      const fecha = new Date()
      fecha.setHours(fecha.getHours() - i)
      
      const facturasDeLaHora = facturasFiltradas.filter(f => {
        const fechaFactura = new Date(f.fechaPago || f.fechaCreacion)
        return fechaFactura.getHours() === fecha.getHours()
      })
      
      const ventasDeLaHora = facturasDeLaHora.reduce((sum, f) => sum + f.total, 0)
      
      datos.push({
        fecha: `${fecha.getHours()}:00`,
        ventas: ventasDeLaHora,
        facturas: facturasDeLaHora.length
      })
    }
    
    return datos
  }

  const obtenerDatosGraficoMetodosPago = () => {
    const facturasPagadas = facturasFiltradas.filter(f => f.estado === 'pagada')
    const metodos = {}
    
    facturasPagadas.forEach(factura => {
      metodos[factura.metodoPago] = (metodos[factura.metodoPago] || 0) + factura.total
    })
    
    return Object.entries(metodos).map(([metodo, total]) => ({
      name: metodo.charAt(0).toUpperCase() + metodo.slice(1),
      value: total,
      color: metodo === 'efectivo' ? '#10B981' : 
             metodo === 'tarjeta' ? '#3B82F6' : '#8B5CF6'
    }))
  }

  const obtenerDatosGraficoMesas = () => {
    const ocupacionPorHora = {}
    
    // Simular datos de ocupación por hora
    for (let hora = 7; hora <= 23; hora++) {
      const mesasOcupadas = Math.floor(Math.random() * 15) + 5 // 5-20 mesas
      ocupacionPorHora[hora] = mesasOcupadas
    }
    
    return Object.entries(ocupacionPorHora).map(([hora, ocupadas]) => ({
      hora: `${hora}:00`,
      ocupadas,
      libres: 24 - ocupadas
    }))
  }

  const datosVentas = obtenerDatosGraficoVentas()
  const datosMetodosPago = obtenerDatosGraficoMetodosPago()
  const datosMesas = obtenerDatosGraficoMesas()

  const exportarReporte = () => {
    // Generar reporte del día en formato HTML profesional
    const fechaActual = new Date()
    const datos = {
      fecha: fechaActual.toLocaleDateString('es-ES'),
      estadisticas,
      facturas: facturasFiltradas,
      datosVentas,
      datosMetodosPago,
      fechaGeneracion: fechaActual.toISOString()
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte del Día - La Chinga</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .reporte-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #C62828, #2E7D32);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border-left: 4px solid #C62828;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #C62828;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h3 {
            color: #C62828;
            font-size: 18px;
            margin: 0 0 15px 0;
            border-bottom: 2px solid #C62828;
            padding-bottom: 5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .table th,
          .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .table th {
            background: #f8f9fa;
            color: #2E7D32;
            font-weight: bold;
          }
          .footer {
            background: #2E7D32;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="reporte-container">
          <div class="header">
            <h1>🇲🇽 LA CHINGA</h1>
            <p>Restaurante Mexicano Auténtico</p>
            <p>REPORTE DEL DÍA - ${datos.fecha}</p>
          </div>
          
          <div class="content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">$${datos.estadisticas.totalVentas.toLocaleString()}</div>
                <div class="stat-label">Total Ventas</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${datos.estadisticas.totalFacturas}</div>
                <div class="stat-label">Total Facturas</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">$${Math.round(datos.estadisticas.promedioTicket).toLocaleString()}</div>
                <div class="stat-label">Ticket Promedio</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">$${datos.estadisticas.totalPropinas.toLocaleString()}</div>
                <div class="stat-label">Total Propinas</div>
              </div>
            </div>

            <div class="section">
              <h3>📊 Resumen de Ventas por Hora</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Ventas</th>
                    <th>Facturas</th>
                  </tr>
                </thead>
                <tbody>
                  ${datos.datosVentas.filter(d => d.ventas > 0).map(d => `
                    <tr>
                      <td>${d.fecha}</td>
                      <td>$${d.ventas.toLocaleString()}</td>
                      <td>${d.facturas}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h3>💳 Ventas por Método de Pago</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Total</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  ${datos.datosMetodosPago.map(d => `
                    <tr>
                      <td>${d.name}</td>
                      <td>$${d.value.toLocaleString()}</td>
                      <td>${((d.value / datos.estadisticas.totalVentas) * 100).toFixed(1)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h3>🧾 Facturas del Día</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mesa</th>
                    <th>Total</th>
                    <th>Método</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${datos.facturas.map(f => `
                    <tr>
                      <td>#${f.id}</td>
                      <td>Mesa ${f.mesaId}</td>
                      <td>$${f.total.toLocaleString()}</td>
                      <td>${f.metodoPago}</td>
                      <td>${new Date(f.fechaCreacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>${f.estado}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="footer">
            <p>Reporte generado el ${fechaActual.toLocaleString('es-ES')}</p>
            <p>¡Gracias por usar el sistema de La Chinga!</p>
          </div>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-dia-${format(new Date(), 'yyyy-MM-dd')}.html`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Reporte del día exportado exitosamente')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-mexico-rojo-600 mb-2">
          Reportes del Día
        </h1>
        <p className="text-neutral-600">
          Análisis de ventas y rendimiento del día actual
        </p>
      </motion.div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Información del día */}
          <div className="flex items-center space-x-4">
            <div className="bg-mexico-verde-100 text-mexico-verde-800 px-4 py-2 rounded-lg">
              <span className="font-medium">
                📅 {format(new Date(), 'dd/MM/yyyy', { locale: es })} - {format(new Date(), 'EEEE', { locale: es })}
              </span>
            </div>
            <div className="text-sm text-neutral-600">
              Reporte en tiempo real del día actual
            </div>
          </div>

          {/* Botón exportar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportarReporte}
            className="bg-mexico-rojo-600 text-white px-6 py-2 rounded-lg hover:bg-mexico-rojo-700 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Exportar Reporte</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Estadísticas principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Total Ventas', 
            valor: `$${estadisticas.totalVentas.toLocaleString()}`, 
            color: 'bg-green-100 text-green-800',
            icono: CurrencyDollarIcon
          },
          { 
            label: 'Total Facturas', 
            valor: estadisticas.totalFacturas, 
            color: 'bg-blue-100 text-blue-800',
            icono: ChartBarIcon
          },
          { 
            label: 'Ticket Promedio', 
            valor: `$${Math.round(estadisticas.promedioTicket).toLocaleString()}`, 
            color: 'bg-purple-100 text-purple-800',
            icono: UserGroupIcon
          },
          { 
            label: 'Total Propinas', 
            valor: `$${estadisticas.totalPropinas.toLocaleString()}`, 
            color: 'bg-yellow-100 text-yellow-800',
            icono: CurrencyDollarIcon
          }
        ].map((stat, index) => {
          const IconoStat = stat.icono
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <IconoStat className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                  <p className="text-lg font-semibold text-neutral-800">{stat.valor}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas por tiempo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Ventas por Hora del Día
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosVentas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventas' ? `$${value.toLocaleString()}` : value,
                    name === 'ventas' ? 'Ventas' : 'Facturas'
                  ]}
                />
                <Bar dataKey="ventas" fill="#C62828" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico de métodos de pago */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Ventas por Método de Pago
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosMetodosPago}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosMetodosPago.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de ocupación de mesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Ocupación de Mesas por Hora
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosMesas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ocupadas" stroke="#C62828" strokeWidth={2} />
              <Line type="monotone" dataKey="libres" stroke="#2E7D32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Tabla de facturas recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Facturas Recientes
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-medium text-neutral-700">ID</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Mesa</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Método</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.slice(0, 10).map((factura) => (
                <tr key={factura.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 text-sm text-neutral-800">
                    #{factura.numero || factura.id}
                    {factura.enviada_por_cliente && (
                      <span className="ml-2 text-blue-600 text-xs">📤</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    Mesa {factura.mesa || factura.mesaId}
                    {factura.cliente && (
                      <div className="text-xs text-neutral-500">{factura.cliente}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-neutral-800">
                    ${(factura.total || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600 capitalize">
                    {factura.metodo_pago || factura.metodoPago || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {format(new Date(factura.fechaCreacion || factura.fecha_envio), 'dd/MM HH:mm', { locale: es })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      factura.estado === 'pagada' 
                        ? 'bg-green-100 text-green-800'
                        : factura.estado === 'pendiente_cobro'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {factura.estado === 'pendiente_cobro' ? 'Enviada por Cliente' : factura.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default ReportesCajero
