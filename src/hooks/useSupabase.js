import { useState, useEffect } from 'react'
import { supabase, auth, db } from '../lib/supabase'

// Hook para autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await auth.signIn(email, password)
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signOut
  }
}

// Hook para datos de mesas
export const useMesas = () => {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getMesas()
        if (error) throw error
        setMesas(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMesas()
  }, [])

  const actualizarMesa = async (mesaId, estado, meseroId = null) => {
    try {
      const { data, error } = await db.actualizarMesa(mesaId, estado, meseroId)
      if (error) throw error
      
      // Actualizar estado local
      setMesas(prev => prev.map(mesa => 
        mesa.id === mesaId 
          ? { ...mesa, estado, mesero_id: meseroId }
          : mesa
      ))
      
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  return { mesas, loading, error, actualizarMesa }
}

// Hook para datos de usuarios
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getUsuarios()
        if (error) throw error
        setUsuarios(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  return { usuarios, loading, error }
}

// Hook para datos de cartas
export const useCartas = () => {
  const [cartas, setCartas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getCartas()
        if (error) throw error
        setCartas(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCartas()
  }, [])

  return { cartas, loading, error }
}

// Hook para datos de platos
export const usePlatos = (cartaId) => {
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cartaId) {
      setPlatos([])
      setLoading(false)
      return
    }

    const fetchPlatos = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getPlatos(cartaId)
        if (error) throw error
        setPlatos(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlatos()
  }, [cartaId])

  return { platos, loading, error }
}

// Hook para datos de reservas
export const useReservas = () => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getReservas()
        if (error) throw error
        setReservas(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReservas()
  }, [])

  const crearReserva = async (reservaData) => {
    try {
      const { data, error } = await db.crearReserva(reservaData)
      if (error) throw error
      
      // Actualizar estado local
      setReservas(prev => [data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  return { reservas, loading, error, crearReserva }
}

// Hook para datos de pedidos
export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true)
        const { data, error } = await db.getPedidos()
        if (error) throw error
        setPedidos(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const crearPedido = async (pedidoData) => {
    try {
      const { data, error } = await db.crearPedido(pedidoData)
      if (error) throw error
      
      // Actualizar estado local
      setPedidos(prev => [data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  return { pedidos, loading, error, crearPedido }
}
