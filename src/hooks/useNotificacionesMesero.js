import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useNotificacionesMesero = () => {
  const queryClient = useQueryClient()

  // Crear notificación para mesero específico
  const crearNotificacionMesero = useMutation({
    mutationFn: async ({ meseroId, tipo, titulo, mensaje, datos, prioridad = 'normal' }) => {
      console.log('🔔 Creando notificación para mesero:', meseroId, tipo)

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

      console.log('✅ Notificación creada exitosamente')
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacionesMesero'])
      toast.success('Notificación enviada al mesero')
    },
    onError: (error) => {
      console.error('❌ Error al crear notificación:', error)
      toast.error('Error al enviar notificación')
    }
  })

  // Crear notificación para todos los meseros del turno actual
  const crearNotificacionTurno = useMutation({
    mutationFn: async ({ turno, tipo, titulo, mensaje, datos, prioridad = 'normal' }) => {
      console.log('🔔 Creando notificación para turno:', turno, tipo)

      // Obtener todos los meseros del turno
      const { data: meseros, error: errorMeseros } = await supabase
        .from('usuarios')
        .select('id')
        .eq('rol', 'mesero')
        .eq('turno', turno)
        .eq('activo', true)

      if (errorMeseros) {
        console.error('❌ Error al obtener meseros del turno:', errorMeseros)
        throw errorMeseros
      }

      if (!meseros || meseros.length === 0) {
        console.log('⚠️ No hay meseros activos en el turno:', turno)
        return { success: true, notificacionesCreadas: 0 }
      }

      // Crear notificaciones para todos los meseros del turno
      const notificaciones = meseros.map(mesero => ({
        mesero_id: mesero.id,
        tipo,
        titulo,
        mensaje,
        datos: datos || {},
        prioridad
      }))

      const { error } = await supabase
        .from('notificaciones_meseros')
        .insert(notificaciones)

      if (error) {
        console.error('❌ Error al crear notificaciones:', error)
        throw error
      }

      console.log('✅ Notificaciones creadas para', meseros.length, 'meseros')
      return { success: true, notificacionesCreadas: meseros.length }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['notificacionesMesero'])
      toast.success(`Notificación enviada a ${data.notificacionesCreadas} meseros`)
    },
    onError: (error) => {
      console.error('❌ Error al crear notificaciones:', error)
      toast.error('Error al enviar notificaciones')
    }
  })

  // Crear notificación para mesero de una mesa específica
  const crearNotificacionMesa = useMutation({
    mutationFn: async ({ mesaId, tipo, titulo, mensaje, datos, prioridad = 'normal' }) => {
      console.log('🔔 Creando notificación para mesa:', mesaId, tipo)

      // Obtener el mesero asignado a la mesa
      const { data: asignacion, error: errorAsignacion } = await supabase
        .from('asignaciones_meseros')
        .select('mesero_id')
        .eq('mesa_id', mesaId)
        .eq('activa', true)
        .single()

      if (errorAsignacion || !asignacion) {
        console.error('❌ Error al obtener mesero de la mesa:', errorAsignacion)
        throw new Error('No hay mesero asignado a esta mesa')
      }

      // Crear la notificación
      const { error } = await supabase
        .from('notificaciones_meseros')
        .insert({
          mesero_id: asignacion.mesero_id,
          tipo,
          titulo,
          mensaje,
          datos: { mesaId, ...datos },
          prioridad
        })

      if (error) {
        console.error('❌ Error al crear notificación:', error)
        throw error
      }

      console.log('✅ Notificación creada para mesero de mesa:', mesaId)
      return { success: true, meseroId: asignacion.mesero_id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacionesMesero'])
      toast.success('Notificación enviada al mesero de la mesa')
    },
    onError: (error) => {
      console.error('❌ Error al crear notificación:', error)
      toast.error('Error al enviar notificación')
    }
  })

  // Funciones de conveniencia para tipos específicos de notificaciones
  const notificarPedidoNuevo = (mesaId, pedidoId, items) => {
    return crearNotificacionMesa.mutateAsync({
      mesaId,
      tipo: 'pedido_nuevo',
      titulo: `Nuevo pedido - Mesa ${mesaId}`,
      mensaje: `El cliente ha realizado un pedido con ${items} items`,
      datos: { pedidoId, items },
      prioridad: 'alta'
    })
  }

  const notificarClienteTermina = (mesaId) => {
    return crearNotificacionMesa.mutateAsync({
      mesaId,
      tipo: 'cliente_termina',
      titulo: `Cliente solicita cuenta - Mesa ${mesaId}`,
      mensaje: 'El cliente solicita la cuenta',
      datos: { mesaId },
      prioridad: 'alta'
    })
  }

  const notificarPedidoListo = (mesaId, pedidoId) => {
    return crearNotificacionMesa.mutateAsync({
      mesaId,
      tipo: 'pedido_listo',
      titulo: `Pedido listo - Mesa ${mesaId}`,
      mensaje: 'El pedido está listo para entregar',
      datos: { pedidoId },
      prioridad: 'normal'
    })
  }

  const notificarReservaNueva = (mesaId, reservaId, personas, hora) => {
    return crearNotificacionMesa.mutateAsync({
      mesaId,
      tipo: 'reserva_nueva',
      titulo: `Nueva reserva - Mesa ${mesaId}`,
      mensaje: `Reserva para ${personas} personas a las ${hora}`,
      datos: { reservaId, personas, hora },
      prioridad: 'normal'
    })
  }

  const notificarAlertaGeneral = (turno, mensaje) => {
    return crearNotificacionTurno.mutateAsync({
      turno,
      tipo: 'alerta_general',
      titulo: 'Alerta General',
      mensaje,
      prioridad: 'urgente'
    })
  }

  return {
    // Mutaciones principales
    crearNotificacionMesero: crearNotificacionMesero.mutateAsync,
    crearNotificacionTurno: crearNotificacionTurno.mutateAsync,
    crearNotificacionMesa: crearNotificacionMesa.mutateAsync,
    
    // Funciones de conveniencia
    notificarPedidoNuevo,
    notificarClienteTermina,
    notificarPedidoListo,
    notificarReservaNueva,
    notificarAlertaGeneral,
    
    // Estados de carga
    isCreatingNotification: crearNotificacionMesero.isPending,
    isCreatingTurnoNotification: crearNotificacionTurno.isPending,
    isCreatingMesaNotification: crearNotificacionMesa.isPending
  }
}
