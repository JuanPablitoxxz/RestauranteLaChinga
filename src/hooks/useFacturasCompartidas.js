import { useState, useEffect } from 'react'

// Hook personalizado para manejar facturas compartidas entre cliente y cajero
export const useFacturasCompartidas = () => {
  const [facturas, setFacturas] = useState([])

  // Función para obtener facturas del localStorage
  const obtenerFacturas = () => {
    try {
      const facturasPendientes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      const facturasReportes = JSON.parse(localStorage.getItem('facturasParaReportes') || '[]')
      
      console.log('🔍 useFacturasCompartidas - Raw facturasPendientes:', facturasPendientes)
      console.log('🔍 useFacturasCompartidas - Raw facturasReportes:', facturasReportes)
      
      // Combinar y eliminar duplicados
      const todasLasFacturas = [...facturasPendientes, ...facturasReportes]
      const facturasUnicas = todasLasFacturas.filter((factura, index, self) => 
        index === self.findIndex(f => f.id === factura.id)
      )
      
      console.log('🔍 useFacturasCompartidas - Facturas obtenidas:', facturasUnicas)
      console.log('🔍 useFacturasCompartidas - Número de facturas:', facturasUnicas.length)
      return facturasUnicas
    } catch (error) {
      console.error('❌ Error al obtener facturas:', error)
      return []
    }
  }

  // Función para agregar una nueva factura
  const agregarFactura = (nuevaFactura) => {
    try {
      console.log('📤 useFacturasCompartidas - Agregando factura:', nuevaFactura)
      
      // Obtener facturas existentes
      const facturasExistentes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      
      // Agregar nueva factura
      const facturasActualizadas = [...facturasExistentes, nuevaFactura]
      
      // Guardar en localStorage
      localStorage.setItem('facturasPendientesCajero', JSON.stringify(facturasActualizadas))
      localStorage.setItem('facturasParaReportes', JSON.stringify(facturasActualizadas))
      
      // Actualizar estado
      setFacturas(facturasActualizadas)
      
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('facturaEnviada', { 
        detail: { factura: nuevaFactura, total: facturasActualizadas.length }
      }))
      
      console.log('✅ useFacturasCompartidas - Factura agregada exitosamente')
      return true
    } catch (error) {
      console.error('❌ Error al agregar factura:', error)
      return false
    }
  }

  // Función para actualizar el estado de una factura
  const actualizarFactura = (facturaId, nuevosDatos) => {
    try {
      const facturasExistentes = JSON.parse(localStorage.getItem('facturasPendientesCajero') || '[]')
      const facturasActualizadas = facturasExistentes.map(factura => 
        factura.id === facturaId ? { ...factura, ...nuevosDatos } : factura
      )
      
      localStorage.setItem('facturasPendientesCajero', JSON.stringify(facturasActualizadas))
      localStorage.setItem('facturasParaReportes', JSON.stringify(facturasActualizadas))
      
      setFacturas(facturasActualizadas)
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('facturaActualizada', { 
        detail: { facturaId, nuevosDatos }
      }))
      
      return true
    } catch (error) {
      console.error('❌ Error al actualizar factura:', error)
      return false
    }
  }

  // Efecto para escuchar eventos personalizados
  useEffect(() => {
    const manejarFacturaEnviada = (event) => {
      console.log('📨 Evento facturaEnviada recibido:', event.detail)
      console.log('📨 Actualizando facturas en hook...')
      const nuevasFacturas = obtenerFacturas()
      console.log('📨 Nuevas facturas obtenidas:', nuevasFacturas.length)
      setFacturas(nuevasFacturas)
    }

    const manejarFacturaActualizada = (event) => {
      console.log('📨 Evento facturaActualizada recibido:', event.detail)
      console.log('📨 Actualizando facturas en hook...')
      const nuevasFacturas = obtenerFacturas()
      console.log('📨 Nuevas facturas obtenidas:', nuevasFacturas.length)
      setFacturas(nuevasFacturas)
    }

    const manejarSincronizacionForzada = (event) => {
      console.log('🔄 Evento forzarSincronizacion recibido:', event.detail)
      console.log('🔄 Forzando actualización de facturas...')
      const nuevasFacturas = obtenerFacturas()
      console.log('🔄 Facturas obtenidas en sincronización:', nuevasFacturas.length)
      setFacturas(nuevasFacturas)
    }

    // Agregar listeners
    window.addEventListener('facturaEnviada', manejarFacturaEnviada)
    window.addEventListener('facturaActualizada', manejarFacturaActualizada)
    window.addEventListener('forzarSincronizacion', manejarSincronizacionForzada)

    // Cargar facturas iniciales
    const facturasIniciales = obtenerFacturas()
    console.log('🔍 Hook inicializado con facturas:', facturasIniciales.length)
    setFacturas(facturasIniciales)

    // Cleanup
    return () => {
      window.removeEventListener('facturaEnviada', manejarFacturaEnviada)
      window.removeEventListener('facturaActualizada', manejarFacturaActualizada)
      window.removeEventListener('forzarSincronizacion', manejarSincronizacionForzada)
    }
  }, [])

  return {
    facturas,
    agregarFactura,
    actualizarFactura,
    obtenerFacturas
  }
}
