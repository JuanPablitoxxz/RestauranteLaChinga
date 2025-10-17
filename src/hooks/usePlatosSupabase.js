import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const usePlatosSupabase = (cartaId = null) => {
  return useQuery({
    queryKey: ['platos', cartaId],
    queryFn: async () => {
      console.log('🔍 usePlatosSupabase - Obteniendo platos de Supabase...')
      
      let query = supabase
        .from('platos')
        .select(`
          *,
          cartas (
            id,
            nombre,
            horario_inicio,
            horario_fin
          )
        `)
        .eq('disponible', true)
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true })

      // Si se especifica una carta, filtrar por ella
      if (cartaId) {
        query = query.eq('carta_id', cartaId)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ Error al obtener platos:', error)
        throw error
      }

      console.log('✅ Platos obtenidos de Supabase:', data?.length || 0)
      console.log('📋 Platos:', data)
      
      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3
  })
}

export const useCartasSupabase = () => {
  return useQuery({
    queryKey: ['cartas'],
    queryFn: async () => {
      console.log('🔍 useCartasSupabase - Obteniendo cartas de Supabase...')
      
      const { data, error } = await supabase
        .from('cartas')
        .select('*')
        .eq('activa', true)
        .order('horario_inicio', { ascending: true })

      if (error) {
        console.error('❌ Error al obtener cartas:', error)
        throw error
      }

      console.log('✅ Cartas obtenidas de Supabase:', data?.length || 0)
      console.log('📋 Cartas:', data)
      
      return data || []
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 3
  })
}

export const usePlatosPorHora = () => {
  return useQuery({
    queryKey: ['platos-por-hora'],
    queryFn: async () => {
      console.log('🔍 usePlatosPorHora - Obteniendo platos por hora actual...')
      
      const horaActual = new Date()
      const hora = horaActual.getHours()
      const minutos = horaActual.getMinutes()
      const horaCompleta = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
      
      console.log('🕐 Hora actual:', horaCompleta)
      
      // Obtener cartas activas para la hora actual
      const { data: cartas, error: cartasError } = await supabase
        .from('cartas')
        .select('*')
        .eq('activa', true)
        .lte('horario_inicio', horaCompleta)
        .gte('horario_fin', horaCompleta)
        .order('horario_inicio', { ascending: true })

      if (cartasError) {
        console.error('❌ Error al obtener cartas por hora:', cartasError)
        throw cartasError
      }

      console.log('✅ Cartas activas para la hora actual:', cartas?.length || 0)
      console.log('📋 Cartas activas:', cartas)

      if (!cartas || cartas.length === 0) {
        console.log('⚠️ No hay cartas activas para la hora actual')
        return []
      }

      // Obtener platos de las cartas activas
      const cartaIds = cartas.map(carta => carta.id)
      
      const { data: platos, error: platosError } = await supabase
        .from('platos')
        .select(`
          *,
          cartas (
            id,
            nombre,
            horario_inicio,
            horario_fin
          )
        `)
        .in('carta_id', cartaIds)
        .eq('disponible', true)
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true })

      if (platosError) {
        console.error('❌ Error al obtener platos:', platosError)
        throw platosError
      }

      console.log('✅ Platos obtenidos para la hora actual:', platos?.length || 0)
      console.log('📋 Platos:', platos)
      
      return platos || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 3,
    refetchInterval: 5 * 60 * 1000 // Refrescar cada 5 minutos
  })
}
