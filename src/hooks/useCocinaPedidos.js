import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useCocinaPedidos = () => {
  const queryClient = useQueryClient()
  
  // Estado local para los pedidos (para actualizaciones en tiempo real)
  const [pedidosLocales, setPedidosLocales] = useState(null)

  // Mock de pedidos de cocina
  const pedidosMock = [
    {
      id: 1,
      numero: 'PED-001',
      mesa: 2,
      mesero: 'Pedro González',
      cliente: 'María García',
      items: [
        { nombre: 'Tacos al Pastor', cantidad: 3, precio: 45, observaciones: 'Sin cebolla' },
        { nombre: 'Quesadilla de Pollo', cantidad: 1, precio: 35, observaciones: 'Extra queso' },
        { nombre: 'Coca Cola', cantidad: 2, precio: 25, observaciones: 'Sin hielo' }
      ],
      estado: 'pendiente',
      prioridad: 'normal',
      tiempoEstimado: 20,
      fechaCreacion: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
      cocineroAsignado: null,
      observaciones: 'Cliente alérgico a mariscos'
    },
    {
      id: 2,
      numero: 'PED-002',
      mesa: 4,
      mesero: 'Ana López',
      cliente: 'Carlos Ruiz',
      items: [
        { nombre: 'Burrito de Carne', cantidad: 1, precio: 55, observaciones: 'Picante' },
        { nombre: 'Ensalada César', cantidad: 1, precio: 40, observaciones: 'Sin crutones' }
      ],
      estado: 'en_preparacion',
      prioridad: 'alta',
      tiempoEstimado: 15,
      fechaCreacion: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
      cocineroAsignado: 'Chef Roberto',
      observaciones: 'Urgente - cliente con prisa'
    },
    {
      id: 3,
      numero: 'PED-003',
      mesa: 1,
      mesero: 'Luis Martínez',
      cliente: 'Sofia Herrera',
      items: [
        { nombre: 'Chiles Rellenos', cantidad: 2, precio: 65, observaciones: 'Sin picante' },
        { nombre: 'Arroz Blanco', cantidad: 1, precio: 20, observaciones: 'Extra arroz' }
      ],
      estado: 'listo',
      prioridad: 'normal',
      tiempoEstimado: 25,
      fechaCreacion: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
      cocineroAsignado: 'Chef María',
      observaciones: 'Listo para entregar'
    },
    {
      id: 4,
      numero: 'PED-004',
      mesa: 6,
      mesero: 'Pedro González',
      cliente: 'Roberto Silva',
      items: [
        { nombre: 'Pozole', cantidad: 1, precio: 50, observaciones: 'Extra carne' },
        { nombre: 'Tostadas', cantidad: 3, precio: 30, observaciones: 'Bien tostadas' }
      ],
      estado: 'pendiente',
      prioridad: 'alta',
      tiempoEstimado: 30,
      fechaCreacion: new Date(Date.now() - 120000).toISOString(), // 2 min atrás
      cocineroAsignado: null,
      observaciones: 'Cliente VIP'
    }
  ]

  // Mock de cocineros
  const cocinerosMock = [
    { id: 1, nombre: 'Chef Roberto', especialidad: 'Platos Principales', activo: true, pedidosAsignados: 1 },
    { id: 2, nombre: 'Chef María', especialidad: 'Entradas y Ensaladas', activo: true, pedidosAsignados: 1 },
    { id: 3, nombre: 'Chef Carlos', especialidad: 'Postres', activo: true, pedidosAsignados: 0 },
    { id: 4, nombre: 'Chef Ana', especialidad: 'Bebidas y Cocteles', activo: false, pedidosAsignados: 0 }
  ]

  // Obtener pedidos
  const { data: pedidos, isLoading: isLoadingPedidos } = useQuery({
    queryKey: ['pedidosCocina'],
    queryFn: async () => {
      console.log('🍳 Obteniendo pedidos de cocina...')
      
      // Inicializar estado local si no existe
      if (!pedidosLocales) {
        setPedidosLocales(pedidosMock)
      }
      
      return pedidosLocales || pedidosMock
    },
    staleTime: 5 * 60 * 1000
  })

  // Obtener cocineros
  const { data: cocineros, isLoading: isLoadingCocineros } = useQuery({
    queryKey: ['cocineros'],
    queryFn: async () => {
      console.log('👨‍🍳 Obteniendo cocineros...')
      return cocinerosMock
    },
    staleTime: 10 * 60 * 1000
  })

  // Mutación para cambiar estado de pedido
  const cambiarEstadoPedido = useMutation({
    mutationFn: async ({ pedidoId, nuevoEstado }) => {
      console.log('🔄 Cambiando estado de pedido:', pedidoId, 'a', nuevoEstado)
      
      // Actualizar estado local inmediatamente
      setPedidosLocales(prevPedidos => {
        if (!prevPedidos) return prevPedidos
        
        return prevPedidos.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, estado: nuevoEstado }
            : pedido
        )
      })
      
      // Si el pedido está listo, mostrar notificación local
      if (nuevoEstado === 'listo') {
        const pedido = (pedidosLocales || pedidosMock).find(p => p.id === pedidoId)
        if (pedido) {
          console.log('🔔 Pedido listo:', pedido.numero, 'Mesa:', pedido.mesa)
          toast.success(`Pedido ${pedido.numero} listo para Mesa ${pedido.mesa}`)
        }
      }
      
      // Simular actualización en servidor
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Estado de pedido actualizado exitosamente')
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidosCocina'])
      toast.success('Estado de pedido actualizado')
    }
  })

  // Mutación para asignar pedido a cocinero
  const asignarPedido = useMutation({
    mutationFn: async ({ pedidoId, cocineroId }) => {
      console.log('👨‍🍳 Asignando pedido:', pedidoId, 'a cocinero:', cocineroId)
      
      // Actualizar estado local inmediatamente
      setPedidosLocales(prevPedidos => {
        if (!prevPedidos) return prevPedidos
        
        return prevPedidos.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, cocineroAsignado: cocinerosMock.find(c => c.id === cocineroId)?.nombre, estado: 'en_preparacion' }
            : pedido
        )
      })
      
      // Simular actualización en servidor
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Pedido asignado exitosamente')
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidosCocina'])
      queryClient.invalidateQueries(['cocineros'])
      toast.success('Pedido asignado exitosamente')
    }
  })

  // Mutación para desasignar pedido
  const desasignarPedido = useMutation({
    mutationFn: async ({ pedidoId }) => {
      console.log('❌ Desasignando pedido:', pedidoId)
      
      // Actualizar estado local inmediatamente
      setPedidosLocales(prevPedidos => {
        if (!prevPedidos) return prevPedidos
        
        return prevPedidos.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, cocineroAsignado: null, estado: 'pendiente' }
            : pedido
        )
      })
      
      // Simular actualización en servidor
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Pedido desasignado exitosamente')
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidosCocina'])
      queryClient.invalidateQueries(['cocineros'])
      toast.success('Pedido desasignado exitosamente')
    }
  })

  return {
    // Datos
    pedidos: pedidos || [],
    cocineros: cocineros || [],
    
    // Estados de carga
    isLoadingPedidos,
    isLoadingCocineros,
    
    // Mutaciones
    cambiarEstadoPedido,
    asignarPedido,
    desasignarPedido,
    
    // Estados de mutaciones
    isChangingState: cambiarEstadoPedido.isPending,
    isAssigning: asignarPedido.isPending,
    isUnassigning: desasignarPedido.isPending
  }
}
