import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const usePlatosSimple = () => {
  return useQuery({
    queryKey: ['platos-simple'],
    queryFn: async () => {
      console.log('🔍 usePlatosSimple - Obteniendo platos de Supabase...')
      
      try {
        const { data, error } = await supabase
          .from('platos')
          .select('*')
          .eq('disponible', true)
          .order('nombre', { ascending: true })

        if (error) {
          console.error('❌ Error al obtener platos:', error)
          return []
        }

        console.log('✅ Platos obtenidos de Supabase:', data?.length || 0)
        return data || []
      } catch (error) {
        console.error('❌ Error en usePlatosSimple:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo reintentar una vez
    refetchOnWindowFocus: false
  })
}
