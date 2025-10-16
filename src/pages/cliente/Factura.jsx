import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  PrinterIcon,
  DownloadIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Factura = () => {
  const [isGenerandoPDF, setIsGenerandoPDF] = useState(false)

  // Datos mock de la factura
  const facturaData = {
    numero: 'FAC-2024-001',
    fecha: new Date().toLocaleDateString('es-ES'),
    hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    mesa: 5,
    mesero: 'Pedro González',
    cliente: 'María García',
    items: [
      {
        id: 1,
        nombre: 'Chilaquiles Rojos',
        cantidad: 2,
        precio: 85.00,
        subtotal: 170.00
      },
      {
        id: 2,
        nombre: 'Agua de Horchata',
        cantidad: 1,
        precio: 35.00,
        subtotal: 35.00
      },
      {
        id: 3,
        nombre: 'Tacos al Pastor',
        cantidad: 1,
        precio: 95.00,
        subtotal: 95.00
      }
    ],
    subtotal: 300.00,
    iva: 48.00,
    propina: 30.00,
    total: 378.00,
    metodo_pago: 'Efectivo',
    estado: 'pagada'
  }

  const generarPDF = async () => {
    setIsGenerandoPDF(true)
    
    try {
      // Simular generación de PDF
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Factura generada y descargada exitosamente')
    } catch (error) {
      toast.error('Error al generar la factura')
    } finally {
      setIsGenerandoPDF(false)
    }
  }

  const imprimirFactura = () => {
    window.print()
    toast.success('Enviando a impresión...')
  }

  const compartirFactura = () => {
    if (navigator.share) {
      navigator.share({
        title: `Factura ${facturaData.numero} - La Chinga`,
        text: `Factura de ${facturaData.total} pesos del restaurante La Chinga`,
        url: window.location.href
      }).then(() => {
        toast.success('Factura compartida exitosamente')
      }).catch(() => {
        toast.error('Error al compartir la factura')
      })
    } else {
      // Fallback: copiar al portapapeles
      const textoFactura = `Factura ${facturaData.numero}\nTotal: $${facturaData.total}\nFecha: ${facturaData.fecha}`
      navigator.clipboard.writeText(textoFactura).then(() => {
        toast.success('Información de la factura copiada al portapapeles')
      })
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-mexico-rojo-600 font-mexico mb-2">
          Mi Factura 🇲🇽
        </h1>
        <p className="text-neutral-600">
          Revisa y descarga tu factura
        </p>
      </motion.div>

      {/* Factura */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden"
      >
        {/* Header de la factura */}
        <div className="bg-gradient-to-r from-mexico-rojo-600 to-mexico-verde-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-mexico">🇲🇽 La Chinga</h2>
              <p className="text-mexico-dorado-200">Restaurante Mexicano</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-mexico-dorado-200">Factura</p>
              <p className="text-xl font-bold">{facturaData.numero}</p>
            </div>
          </div>
        </div>

        {/* Información de la factura */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Información del restaurante */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Restaurante</h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Av. Principal 123, Ciudad de México</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>+52 55 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>info@lachinga.com</span>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Cliente</h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <p><strong>Nombre:</strong> {facturaData.cliente}</p>
                <p><strong>Mesa:</strong> {facturaData.mesa}</p>
                <p><strong>Mesero:</strong> {facturaData.mesero}</p>
                <p><strong>Fecha:</strong> {facturaData.fecha}</p>
                <p><strong>Hora:</strong> {facturaData.hora}</p>
              </div>
            </div>
          </div>

          {/* Tabla de items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">Detalle del Pedido</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Item</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-700">Cantidad</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-700">Precio</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {facturaData.items.map(item => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-neutral-800">{item.nombre}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-neutral-600">
                        {item.cantidad}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-600">
                        ${item.precio.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-neutral-800">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t border-neutral-200 pt-4">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="text-neutral-800">${facturaData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">IVA (16%):</span>
                <span className="text-neutral-800">${facturaData.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Propina:</span>
                <span className="text-neutral-800">${facturaData.propina.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-neutral-200 pt-2">
                <span className="text-neutral-800">Total:</span>
                <span className="text-mexico-rojo-600">${facturaData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Estado de pago */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Pago realizado exitosamente
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Método de pago: {facturaData.metodo_pago}
            </p>
          </div>
        </div>

        {/* Footer de la factura */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-600">
            ¡Gracias por visitar La Chinga! 🇲🇽
          </p>
          <p className="text-center text-xs text-neutral-500 mt-1">
            Esta factura es válida para efectos fiscales
          </p>
        </div>
      </motion.div>

      {/* Botones de acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex flex-wrap gap-3 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generarPDF}
          disabled={isGenerandoPDF}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerandoPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generando...</span>
            </>
          ) : (
            <>
              <DownloadIcon className="h-4 w-4" />
              <span>Descargar PDF</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={imprimirFactura}
          className="btn-secondary flex items-center space-x-2"
        >
          <PrinterIcon className="h-4 w-4" />
          <span>Imprimir</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={compartirFactura}
          className="btn-success flex items-center space-x-2"
        >
          <ShareIcon className="h-4 w-4" />
          <span>Compartir</span>
        </motion.button>
      </motion.div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-mexico-verde-50 rounded-lg border border-mexico-verde-200 p-4"
      >
        <h3 className="text-lg font-semibold text-mexico-verde-800 mb-2">
          Información Importante
        </h3>
        <ul className="text-sm text-mexico-verde-700 space-y-1">
          <li>• Esta factura es válida para efectos fiscales</li>
          <li>• Conserva este comprobante para futuras referencias</li>
          <li>• Si tienes alguna consulta, contacta al restaurante</li>
          <li>• ¡Esperamos verte pronto en La Chinga! 🇲🇽</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default Factura