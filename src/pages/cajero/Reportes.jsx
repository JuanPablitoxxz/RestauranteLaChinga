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
  const [periodo, setPeriodo] = useState('hoy') // hoy, semana, mes
  const [tipoReporte, setTipoReporte] = useState('ventas') // ventas, mesas, pedidos

  // Obtener datos
  const { data: facturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => facturasMock,
    staleTime: 5 * 60 * 1000
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
    
    switch (periodo) {
      case 'hoy':
        return {
          inicio: startOfDay(hoy),
          fin: endOfDay(hoy)
        }
      case 'semana':
        return {
          inicio: startOfDay(subWeeks(hoy, 1)),
          fin: endOfDay(hoy)
        }
      case 'mes':
        return {
          inicio: startOfDay(subMonths(hoy, 1)),
          fin: endOfDay(hoy)
        }
      default:
        return {
          inicio: startOfDay(hoy),
          fin: endOfDay(hoy)
        }
    }
  }

  const { inicio, fin } = obtenerRangoFechas()

  const filtrarDatosPorFecha = (datos) => {
    return datos?.filter(item => {
      const fechaItem = new Date(item.fechaCreacion || item.fechaPago)
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
    const dias = periodo === 'hoy' ? 24 : periodo === 'semana' ? 7 : 30
    
    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date()
      if (periodo === 'hoy') {
        fecha.setHours(fecha.getHours() - i)
      } else if (periodo === 'semana') {
        fecha.setDate(fecha.getDate() - i)
      } else {
        fecha.setDate(fecha.getDate() - i)
      }
      
      const facturasDelDia = facturasFiltradas.filter(f => {
        const fechaFactura = new Date(f.fechaPago || f.fechaCreacion)
        if (periodo === 'hoy') {
          return fechaFactura.getHours() === fecha.getHours()
        } else {
          return fechaFactura.toDateString() === fecha.toDateString()
        }
      })
      
      const ventasDelDia = facturasDelDia.reduce((sum, f) => sum + f.total, 0)
      
      datos.push({
        fecha: periodo === 'hoy' 
          ? `${fecha.getHours()}:00`
          : format(fecha, 'dd/MM', { locale: es }),
        ventas: ventasDelDia,
        facturas: facturasDelDia.length
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
    // Simular exportación
    const datos = {
      periodo,
      estadisticas,
      facturas: facturasFiltradas,
      fechaGeneracion: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-${periodo}-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
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
          Reportes y Análisis
        </h1>
        <p className="text-neutral-600">
          Análisis de ventas y rendimiento del restaurante
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
          {/* Selector de período */}
          <div className="flex space-x-2">
            {[
              { value: 'hoy', label: 'Hoy' },
              { value: 'semana', label: 'Última semana' },
              { value: 'mes', label: 'Último mes' }
            ].map((periodoOption) => (
              <motion.button
                key={periodoOption.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPeriodo(periodoOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  periodo === periodoOption.value
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {periodoOption.label}
              </motion.button>
            ))}
          </div>

          {/* Botón exportar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportarReporte}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Exportar</span>
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
            Ventas por {periodo === 'hoy' ? 'Hora' : 'Día'}
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
                  <td className="py-3 px-4 text-sm text-neutral-800">#{factura.id}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">Mesa {factura.mesaId}</td>
                  <td className="py-3 px-4 text-sm font-medium text-neutral-800">
                    ${factura.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600 capitalize">
                    {factura.metodoPago}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {format(new Date(factura.fechaCreacion), 'dd/MM HH:mm', { locale: es })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      factura.estado === 'pagada' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {factura.estado}
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
