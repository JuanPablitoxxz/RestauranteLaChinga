import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://uykvleeyuxoqhnbnbcch.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a3ZsZWV5dXhvcWhuYm5iY2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTQ1OTQsImV4cCI6MjA3NjEzMDU5NH0.6YppDAzbklwy4y2ApR4-GQ9W8a_hkXS4gBRSMPStfCw'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones de autenticación
export const auth = {
  // Iniciar sesión
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Funciones de base de datos
export const db = {
  // Obtener mesas
  async getMesas() {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .order('numero')
    return { data, error }
  },

  // Obtener usuarios
  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('activo', true)
    return { data, error }
  },

  // Obtener cartas
  async getCartas() {
    const { data, error } = await supabase
      .from('cartas')
      .select('*')
      .eq('activa', true)
      .order('horario_inicio')
    return { data, error }
  },

  // Obtener platos por carta
  async getPlatos(cartaId) {
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('carta_id', cartaId)
      .eq('disponible', true)
      .order('nombre')
    return { data, error }
  },

  // Obtener reservas
  async getReservas() {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        cliente:usuarios(nombre, apellido, email),
        mesa:mesas(numero, capacidad)
      `)
      .order('fecha', { ascending: true })
    return { data, error }
  },

  // Obtener pedidos
  async getPedidos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        mesa:mesas(numero),
        mesero:usuarios(nombre, apellido)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Crear pedido
  async crearPedido(pedidoData) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert(pedidoData)
      .select()
    return { data, error }
  },

  // Actualizar estado de mesa
  async actualizarMesa(mesaId, estado, meseroId = null) {
    const { data, error } = await supabase
      .from('mesas')
      .update({ 
        estado, 
        mesero_id: meseroId,
        updated_at: new Date().toISOString()
      })
      .eq('id', mesaId)
    return { data, error }
  },

  // Crear reserva
  async crearReserva(reservaData) {
    const { data, error } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select()
    return { data, error }
  }
}

export default supabase
