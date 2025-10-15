import { http, HttpResponse } from 'msw'
import { 
  usuariosMock, 
  mesasMock, 
  cartasMock, 
  reservasMock, 
  pedidosMock, 
  facturasMock,
  obtenerCartaActual,
  obtenerTurnoActual
} from '../data/mockData.js'

// Simular base de datos en memoria
let usuarios = [...usuariosMock]
let mesas = [...mesasMock]
let reservas = [...reservasMock]
let pedidos = [...pedidosMock]
let facturas = [...facturasMock]

export const handlers = [
  // Autenticación
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password, rol } = await request.json()
    
    const usuario = usuarios.find(u => 
      u.email === email && u.password === password && u.rol === rol
    )
    
    if (!usuario) {
      return HttpResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    const token = `mock-token-${Date.now()}`
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      turno: usuario.turno,
      mesasAsignadas: usuario.mesasAsignadas || [],
      avatar: `https://ui-avatars.com/api/?name=${usuario.nombre}&background=c62828&color=fff`
    }
    
    return HttpResponse.json({
      success: true,
      usuario: usuarioResponse,
      token
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // Usuarios
  http.get('/api/usuarios', () => {
    const usuariosResponse = usuarios.map(u => ({
      ...u,
      password: undefined // No enviar password
    }))
    return HttpResponse.json(usuariosResponse)
  }),

  http.post('/api/usuarios', async ({ request }) => {
    const nuevoUsuario = await request.json()
    const id = Math.max(...usuarios.map(u => u.id)) + 1
    
    const usuario = {
      id,
      ...nuevoUsuario,
      activo: true,
      fechaCreacion: new Date().toISOString()
    }
    
    usuarios.push(usuario)
    return HttpResponse.json(usuario, { status: 201 })
  }),

  http.put('/api/usuarios/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    
    const index = usuarios.findIndex(u => u.id === parseInt(id))
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    usuarios[index] = {
      ...usuarios[index],
      ...datosActualizados,
      fechaModificacion: new Date().toISOString()
    }
    
    return HttpResponse.json(usuarios[index])
  }),

  http.delete('/api/usuarios/:id', ({ params }) => {
    const { id } = params
    const index = usuarios.findIndex(u => u.id === parseInt(id))
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    usuarios.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // Mesas
  http.get('/api/mesas', () => {
    return HttpResponse.json(mesas)
  }),

  http.put('/api/mesas/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    
    const index = mesas.findIndex(m => m.id === parseInt(id))
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Mesa no encontrada' },
        { status: 404 }
      )
    }
    
    mesas[index] = {
      ...mesas[index],
      ...datosActualizados
    }
    
    return HttpResponse.json(mesas[index])
  }),

  // Cartas
  http.get('/api/cartas', () => {
    return HttpResponse.json(Object.values(cartasMock))
  }),

  http.get('/api/cartas/actual', () => {
    const cartaActual = obtenerCartaActual()
    return HttpResponse.json(cartaActual)
  }),

  http.get('/api/cartas/:id', ({ params }) => {
    const { id } = params
    const carta = cartasMock[id]
    
    if (!carta) {
      return HttpResponse.json(
        { error: 'Carta no encontrada' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(carta)
  }),

  // Reservas
  http.get('/api/reservas', () => {
    return HttpResponse.json(reservas)
  }),

  http.post('/api/reservas', async ({ request }) => {
    const nuevaReserva = await request.json()
    const id = Math.max(...reservas.map(r => r.id)) + 1
    
    const reserva = {
      id,
      ...nuevaReserva,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    }
    
    reservas.push(reserva)
    return HttpResponse.json(reserva, { status: 201 })
  }),

  http.put('/api/reservas/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    
    const index = reservas.findIndex(r => r.id === parseInt(id))
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }
    
    reservas[index] = {
      ...reservas[index],
      ...datosActualizados,
      fechaModificacion: new Date().toISOString()
    }
    
    return HttpResponse.json(reservas[index])
  }),

  http.delete('/api/reservas/:id', ({ params }) => {
    const { id } = params
    const index = reservas.findIndex(r => r.id === parseInt(id))
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }
    
    reservas.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // Pedidos
  http.get('/api/pedidos', () => {
    return HttpResponse.json(pedidos)
  }),

  http.post('/api/pedidos', async ({ request }) => {
    const nuevoPedido = await request.json()
    const id = Math.max(...pedidos.map(p => p.id)) + 1
    
    const pedido = {
      id,
      ...nuevoPedido,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    }
    
    pedidos.push(pedido)
    return HttpResponse.json(pedido, { status: 201 })
  }),

  http.put('/api/pedidos/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    
    const index = pedidos.findIndex(p => p.id === parseInt(id))
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }
    
    pedidos[index] = {
      ...pedidos[index],
      ...datosActualizados,
      fechaModificacion: new Date().toISOString()
    }
    
    return HttpResponse.json(pedidos[index])
  }),

  // Facturas
  http.get('/api/facturas', () => {
    return HttpResponse.json(facturas)
  }),

  http.post('/api/facturas', async ({ request }) => {
    const nuevaFactura = await request.json()
    const id = Math.max(...facturas.map(f => f.id)) + 1
    
    const factura = {
      id,
      ...nuevaFactura,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    }
    
    facturas.push(factura)
    return HttpResponse.json(factura, { status: 201 })
  }),

  http.put('/api/facturas/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    
    const index = facturas.findIndex(f => f.id === parseInt(id))
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }
    
    facturas[index] = {
      ...facturas[index],
      ...datosActualizados
    }
    
    return HttpResponse.json(facturas[index])
  }),

  // Dashboard/Estadísticas
  http.get('/api/dashboard/estadisticas', () => {
    const estadisticas = {
      mesasOcupadas: mesas.filter(m => m.estado === 'ocupada').length,
      mesasLibres: mesas.filter(m => m.estado === 'libre').length,
      ventasHoy: facturas
        .filter(f => {
          const hoy = new Date().toDateString()
          const fechaFactura = new Date(f.fechaCreacion).toDateString()
          return fechaFactura === hoy && f.estado === 'pagada'
        })
        .reduce((total, f) => total + f.total, 0),
      reservasHoy: reservas.filter(r => {
        const hoy = new Date().toDateString()
        const fechaReserva = new Date(r.fecha).toDateString()
        return fechaReserva === hoy
      }).length,
      pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      turnoActual: obtenerTurnoActual()
    }
    
    return HttpResponse.json(estadisticas)
  }),

  // Notificaciones
  http.get('/api/notificaciones', () => {
    const notificaciones = [
      {
        id: 1,
        tipo: 'pedido_nuevo',
        titulo: 'Nuevo pedido en Mesa 5',
        mensaje: 'El cliente ha realizado un pedido',
        leida: false,
        fecha: new Date(Date.now() - 300000).toISOString() // 5 min atrás
      },
      {
        id: 2,
        tipo: 'reserva_nueva',
        titulo: 'Nueva reserva',
        mensaje: 'Reserva para 4 personas a las 20:00',
        leida: false,
        fecha: new Date(Date.now() - 600000).toISOString() // 10 min atrás
      }
    ]
    
    return HttpResponse.json(notificaciones)
  })
]
