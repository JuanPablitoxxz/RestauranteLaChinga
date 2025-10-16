import { useCarrito } from './CarritoSimple'

const DiagnosticoCarrito = () => {
  const carritoContext = useCarrito()
  
  console.log('🔍 DiagnosticoCarrito - Context completo:', carritoContext)
  console.log('🔍 DiagnosticoCarrito - Items:', carritoContext.items)
  console.log('🔍 DiagnosticoCarrito - Número de items:', carritoContext.items?.length || 0)
  console.log('🔍 DiagnosticoCarrito - Total items (getter):', carritoContext.getTotalItems())
  console.log('🔍 DiagnosticoCarrito - Total precio (getter):', carritoContext.getTotalPrecio())

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        🔍 DIAGNÓSTICO DEL CARRITO
      </h3>
      
      <div className="space-y-2 text-sm">
        <p className="text-yellow-700">
          <strong>Items en context:</strong> {carritoContext.items?.length || 0}
        </p>
        <p className="text-yellow-700">
          <strong>Total items (getter):</strong> {carritoContext.getTotalItems()}
        </p>
        <p className="text-yellow-700">
          <strong>Total precio (getter):</strong> ${carritoContext.getTotalPrecio().toFixed(2)}
        </p>
        <p className="text-yellow-700">
          <strong>Items array:</strong> {JSON.stringify(carritoContext.items, null, 2)}
        </p>
        <p className="text-yellow-700">
          <strong>Context keys:</strong> {Object.keys(carritoContext).join(', ')}
        </p>
      </div>
    </div>
  )
}

export default DiagnosticoCarrito
