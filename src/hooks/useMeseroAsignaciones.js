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

      // Si no hay mesas asignadas, usar datos mock para el mesero actual
      if (mesasTransformadas.length === 0) {
        console.log('⚠️ No hay mesas asignadas en Supabase, usando datos mock')
        const mesasMock = [
          { id: 1, numero: 1, capacidad: 2, estado: 'libre', ubicacion: 'interior' },
          { id: 2, numero: 2, capacidad: 4, estado: 'ocupada', ubicacion: 'interior' },
          { id: 3, numero: 3, capacidad: 2, estado: 'libre', ubicacion: 'terraza' },
          { id: 4, numero: 4, capacidad: 6, estado: 'con_pedido', ubicacion: 'interior' },
          { id: 5, numero: 5, capacidad: 4, estado: 'libre', ubicacion: 'terraza' },
          { id: 6, numero: 6, capacidad: 2, estado: 'pendiente_pago', ubicacion: 'interior' }
        ]
        return mesasMock
      }

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
      
      // Si no hay notificaciones, usar datos mock
      if (!data || data.length === 0) {
        console.log('⚠️ No hay notificaciones en Supabase, usando datos mock')
        const notificacionesMock = [
          {
            id: 1,
            tipo: 'pedido_nuevo',
            titulo: 'Nuevo pedido - Mesa 2',
            mensaje: 'El cliente ha realizado un pedido con 3 items',
            leida: false,
            prioridad: 'alta',
            created_at: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
            datos: { mesaId: 2, pedidoId: 1 }
          },
          {
            id: 2,
            tipo: 'cliente_termina',
            titulo: 'Cliente solicita cuenta - Mesa 4',
            mensaje: 'El cliente solicita la cuenta',
            leida: false,
            prioridad: 'alta',
            created_at: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
            datos: { mesaId: 4 }
          },
          {
            id: 3,
            tipo: 'pedido_listo',
            titulo: 'Pedido listo - Mesa 1',
            mensaje: 'El pedido está listo para entregar',
            leida: true,
            prioridad: 'normal',
            created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
            datos: { mesaId: 1, pedidoId: 3 }
          }
        ]
        return notificacionesMock
      }
      
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
