import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { mesasMock, facturasMock, reservasMock, pedidosMock } from '../../data/mockData'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const DashboardAdmin = () => {
  const [periodo, setPeriodo] = useState('hoy') // hoy, semana, mes

  // Obtener datos
  const { data: mesas } = useQuery({
    queryKey: ['mesas'],
    queryFn: () => mesasMock,
    staleTime: 5 * 60 * 1000
  })

  const { data: facturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => facturasMock,
    staleTime: 5 * 60 * 1000
  })

  const { data: reservas } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => reservasMock,
    staleTime: 5 * 60 * 1000
  })

  const { data: pedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => pedidosMock,
    staleTime: 5 * 60 * 1000
  })

  const calcularKPIs = () => {
    const mesasOcupadas = mesas?.filter(m => m.estado === 'ocupada').length || 0
    const mesasLibres = mesas?.filter(m => m.estado === 'libre').length || 0
    const mesasConPedido = mesas?.filter(m => m.estado === 'con_pedido').length || 0
    const mesasPendientePago = mesas?.filter(m => m.estado === 'pendiente_pago').length || 0

    const ventasHoy = facturas?.filter(f => {
      const hoy = new Date().toDateString()
      const fechaFactura = new Date(f.fechaCreacion).toDateString()
      return fechaFactura === hoy && f.estado === 'pagada'
    }).reduce((sum, f) => sum + f.total, 0) || 0

    const reservasHoy = reservas?.filter(r => {
      const hoy = new Date().toDateString()
      const fechaReserva = new Date(r.fecha).toDateString()
      return fechaReserva === hoy
    }).length || 0

    const pedidosPendientes = pedidos?.filter(p => p.estado === 'pendiente').length || 0
    const pedidosEnPreparacion = pedidos?.filter(p => p.estado === 'en_preparacion').length || 0

    return {
      mesasOcupadas,
      mesasLibres,
      mesasConPedido,
      mesasPendientePago,
      ventasHoy,
      reservasHoy,
      pedidosPendientes,
      pedidosEnPreparacion
    }
  }

  const kpis = calcularKPIs()

  const obtenerDatosGraficoVentas = () => {
    const datos = []
    const dias = periodo === 'hoy' ? 24 : periodo === 'semana' ? 7 : 30
    
    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date()
      if (periodo === 'hoy') {
        fecha.setHours(fecha.getHours() - i)
      } else {
        fecha.setDate(fecha.getDate() - i)
      }
      
      const facturasDelDia = facturas?.filter(f => {
        const fechaFactura = new Date(f.fechaPago || f.fechaCreacion)
        if (periodo === 'hoy') {
          return fechaFactura.getHours() === fecha.getHours()
        } else {
          return fechaFactura.toDateString() === fecha.toDateString()
        }
      }) || []
      
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

  const obtenerDatosGraficoMesas = () => {
    const estados = {}
    
    mesas?.forEach(mesa => {
      estados[mesa.estado] = (estados[mesa.estado] || 0) + 1
    })
    
    return Object.entries(estados).map(([estado, cantidad]) => ({
      name: estado === 'libre' ? 'Libres' :
            estado === 'ocupada' ? 'Ocupadas' :
            estado === 'con_pedido' ? 'Con Pedido' :
            estado === 'pendiente_pago' ? 'Pendiente Pago' : estado,
      value: cantidad,
      color: estado === 'libre' ? '#10B981' :
             estado === 'ocupada' ? '#C62828' :
             estado === 'con_pedido' ? '#F59E0B' :
             estado === 'pendiente_pago' ? '#EF4444' : '#6B7280'
    }))
  }

  const obtenerAlertas = () => {
    const alertas = []
    
    if (kpis.mesasOcupadas >= 20) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Alta ocupación',
        mensaje: 'Más del 80% de las mesas están ocupadas',
        icono: ExclamationTriangleIcon
      })
    }
    
    if (kpis.pedidosPendientes >= 5) {
      alertas.push({
        tipo: 'info',
        titulo: 'Pedidos pendientes',
        mensaje: `${kpis.pedidosPendientes} pedidos esperando ser procesados`,
        icono: ClockIcon
      })
    }
    
    if (kpis.reservasHoy === 0) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Sin reservas hoy',
        mensaje: 'No hay reservas confirmadas para hoy',
        icono: BellIcon
      })
    }
    
    return alertas
  }

  const alertas = obtenerAlertas()
  const datosVentas = obtenerDatosGraficoVentas()
  const datosMesas = obtenerDatosGraficoMesas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-neutral-600">
          Resumen general del restaurante
        </p>
      </motion.div>

      {/* Selector de período */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-1">
          {[
            { value: 'hoy', label: 'Hoy' },
            { value: 'semana', label: 'Esta semana' },
            { value: 'mes', label: 'Este mes' }
          ].map((periodoOption) => (
            <motion.button
              key={periodoOption.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPeriodo(periodoOption.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                periodo === periodoOption.value
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {periodoOption.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* KPIs principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Mesas Ocupadas', 
            valor: kpis.mesasOcupadas, 
            total: 24,
            color: 'bg-primary-100 text-primary-800',
            icono: UserGroupIcon
          },
          { 
            label: 'Ventas Hoy', 
            valor: `$${kpis.ventasHoy.toLocaleString()}`, 
            color: 'bg-green-100 text-green-800',
            icono: CurrencyDollarIcon
          },
          { 
            label: 'Reservas Hoy', 
            valor: kpis.reservasHoy, 
            color: 'bg-blue-100 text-blue-800',
            icono: CalendarIcon
          },
          { 
            label: 'Pedidos Pendientes', 
            valor: kpis.pedidosPendientes, 
            color: 'bg-yellow-100 text-yellow-800',
            icono: ClockIcon
          }
        ].map((kpi, index) => {
          const IconoKpi = kpi.icono
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <IconoKpi className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600">{kpi.label}</p>
                  <p className="text-lg font-semibold text-neutral-800">{kpi.valor}</p>
                  {kpi.total && (
                    <div className="w-full bg-neutral-200 rounded-full h-1 mt-2">
                      <div 
                        className="bg-primary-600 h-1 rounded-full" 
                        style={{ width: `${(kpi.valor / kpi.total) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-neutral-800">Alertas</h2>
          {alertas.map((alerta, index) => {
            const IconoAlerta = alerta.icono
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-lg border-l-4 ${
                  alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alerta.tipo === 'info' ? 'bg-blue-50 border-blue-400' :
                  'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconoAlerta className={`h-5 w-5 ${
                    alerta.tipo === 'warning' ? 'text-yellow-600' :
                    alerta.tipo === 'info' ? 'text-blue-600' :
                    'text-red-600'
                  }`} />
                  <div>
                    <h3 className="font-medium text-neutral-800">{alerta.titulo}</h3>
                    <p className="text-sm text-neutral-600">{alerta.mensaje}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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

        {/* Gráfico de estado de mesas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Estado de las Mesas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosMesas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosMesas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Resumen de actividades recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Actividades Recientes
        </h3>
        
        <div className="space-y-4">
          {[
            { 
              accion: 'Nueva factura', 
              detalle: 'Factura #3 por $45,000', 
              tiempo: 'Hace 5 minutos',
              icono: CheckCircleIcon,
              color: 'text-green-600'
            },
            { 
              accion: 'Reserva confirmada', 
              detalle: 'Mesa 8 para 4 personas a las 20:00', 
              tiempo: 'Hace 15 minutos',
              icono: CalendarIcon,
              color: 'text-blue-600'
            },
            { 
              accion: 'Pedido completado', 
              detalle: 'Pedido #2 entregado en Mesa 5', 
              tiempo: 'Hace 25 minutos',
              icono: CheckCircleIcon,
              color: 'text-green-600'
            },
            { 
              accion: 'Mesa liberada', 
              detalle: 'Mesa 12 ahora disponible', 
              tiempo: 'Hace 30 minutos',
              icono: UserGroupIcon,
              color: 'text-primary-600'
            }
          ].map((actividad, index) => {
            const IconoActividad = actividad.icono
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg"
              >
                <IconoActividad className={`h-5 w-5 ${actividad.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-neutral-800">{actividad.accion}</p>
                  <p className="text-sm text-neutral-600">{actividad.detalle}</p>
                </div>
                <span className="text-xs text-neutral-500">{actividad.tiempo}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardAdmin
