import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useMeseroAsignaciones = () => {
  const { usuario } = useAuthStore()
  const queryClient = useQueryClient()

  // Obtener mesas asignadas al mesero actual
  const { data: mesasAsignadas, isLoading: isLoadingMesas } = useQuery({
    queryKey: ['mesasAsignadas', usuario?.id],
    queryFn: async () => {
      if (!usuario?.id || usuario.rol !== 'mesero') {
        return []
      }

      console.log('🔍 Obteniendo mesas asignadas para mesero:', usuario.id)

      const { data, error } = await supabase
        .from('asignaciones_meseros')
        .select(`
          *,
          mesas (
            id,
            numero,
            capacidad,
            estado,
            ubicacion,
            observaciones,
            created_at,
            updated_at
          )
        `)
        .eq('mesero_id', usuario.id)
        .eq('activa', true)
        .order('mesas(numero)')

      if (error) {
        console.error('❌ Error al obtener mesas asignadas:', error)
        throw error
      }

      console.log('✅ Mesas asignadas obtenidas:', data?.length || 0)
      
      // Transformar los datos para que sean más fáciles de usar
      const mesasTransformadas = data?.map(asignacion => ({
        ...asignacion.mesas,
        asignacion_id: asignacion.id,
        fecha_asignacion: asignacion.fecha_asignacion,
        turno: asignacion.turno
      })) || []

      return mesasTransformadas
    },
    enabled: !!usuario?.id && usuario.rol === 'mesero',
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 30 * 1000 // Refrescar cada 30 segundos
  })

  // Obtener notificaciones del mesero
  const { data: notificaciones, isLoading: isLoadingNotificaciones } = useQuery({
    queryKey: ['notificacionesMesero', usuario?.id],
    queryFn: async () => {
      if (!usuario?.id || usuario.rol !== 'mesero') {
        return []
      }

      console.log('🔔 Obteniendo notificaciones para mesero:', usuario.id)

      const { data, error } = await supabase
        .from('notificaciones_meseros')
        .select('*')
        .eq('mesero_id', usuario.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('❌ Error al obtener notificaciones:', error)
        throw error
      }

      console.log('✅ Notificaciones obtenidas:', data?.length || 0)
      return data || []
    },
    enabled: !!usuario?.id && usuario.rol === 'mesero',
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 10 * 1000 // Refrescar cada 10 segundos
  })

  // Mutación para marcar notificación como leída
  const marcarNotificacionLeida = useMutation({
    mutationFn: async (notificacionId) => {
      const { error } = await supabase
        .from('notificaciones_meseros')
        .update({ 
          leida: true, 
          leida_at: new Date().toISOString() 
        })
        .eq('id', notificacionId)

      if (error) {
        console.error('❌ Error al marcar notificación como leída:', error)
        throw error
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacionesMesero', usuario?.id])
    }
  })

  // Mutación para actualizar estado de mesa
  const actualizarEstadoMesa = useMutation({
    mutationFn: async ({ mesaId, nuevoEstado }) => {
      const { error } = await supabase
        .from('mesas')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', mesaId)

      if (error) {
        console.error('❌ Error al actualizar estado de mesa:', error)
        throw error
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mesasAsignadas', usuario?.id])
    }
  })

  // Crear notificación para mesero
  const crearNotificacion = useMutation({
    mutationFn: async ({ meseroId, tipo, titulo, mensaje, datos, prioridad = 'normal' }) => {
      const { error } = await supabase
        .from('notificaciones_meseros')
        .insert({
          mesero_id: meseroId,
          tipo,
          titulo,
          mensaje,
          datos: datos || {},
          prioridad
        })

      if (error) {
        console.error('❌ Error al crear notificación:', error)
        throw error
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacionesMesero'])
    }
  })

  // Estadísticas del mesero
  const estadisticas = {
    totalMesas: mesasAsignadas?.length || 0,
    mesasOcupadas: mesasAsignadas?.filter(m => m.estado === 'ocupada').length || 0,
    mesasLibres: mesasAsignadas?.filter(m => m.estado === 'libre').length || 0,
    mesasConPedido: mesasAsignadas?.filter(m => m.estado === 'con_pedido').length || 0,
    mesasPendientePago: mesasAsignadas?.filter(m => m.estado === 'pendiente_pago').length || 0,
    notificacionesNoLeidas: notificaciones?.filter(n => !n.leida).length || 0
  }

  return {
    // Datos
    mesasAsignadas,
    notificaciones,
    estadisticas,
    
    // Estados de carga
    isLoadingMesas,
    isLoadingNotificaciones,
    
    // Acciones
    marcarNotificacionLeida: marcarNotificacionLeida.mutateAsync,
    actualizarEstadoMesa: actualizarEstadoMesa.mutateAsync,
    crearNotificacion: crearNotificacion.mutateAsync,
    
    // Estados de mutaciones
    isUpdatingMesa: actualizarEstadoMesa.isPending,
    isMarkingNotification: marcarNotificacionLeida.isPending,
    isCreatingNotification: crearNotificacion.isPending
  }
}
