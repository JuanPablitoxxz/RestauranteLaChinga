import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Probando...')
  const [mesas, setMesas] = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Probar conexión básica
        const { data, error } = await supabase
          .from('mesas')
          .select('*')
          .limit(5)

        if (error) {
          setConnectionStatus(`❌ Error: ${error.message}`)
          return
        }

        setConnectionStatus('✅ Conectado a Supabase')
        setMesas(data || [])

        // Probar usuarios
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select('*')
          .limit(5)

        if (!usuariosError) {
          setUsuarios(usuariosData || [])
        }

      } catch (err) {
        setConnectionStatus(`❌ Error de conexión: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-mexico-dorado-200">
      <h2 className="text-xl font-semibold text-mexico-rojo-600 mb-4">
        🔗 Estado de Conexión Supabase
      </h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-neutral-50 rounded-lg">
          <p className="font-medium">Estado:</p>
          <p className="text-sm">{connectionStatus}</p>
        </div>

        {mesas.length > 0 && (
          <div className="p-3 bg-mexico-verde-50 rounded-lg">
            <p className="font-medium text-mexico-verde-800">Mesas encontradas:</p>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {mesas.map(mesa => (
                <div key={mesa.id} className="text-center p-2 bg-white rounded border">
                  <p className="font-semibold">Mesa {mesa.numero}</p>
                  <p className="text-xs text-neutral-600">{mesa.capacidad} personas</p>
                  <p className="text-xs text-mexico-verde-600">{mesa.estado}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {usuarios.length > 0 && (
          <div className="p-3 bg-mexico-dorado-50 rounded-lg">
            <p className="font-medium text-mexico-dorado-800">Usuarios encontrados:</p>
            <div className="space-y-1 mt-2">
              {usuarios.map(usuario => (
                <div key={usuario.id} className="text-sm bg-white p-2 rounded border">
                  <span className="font-medium">{usuario.nombre} {usuario.apellido}</span>
                  <span className="text-neutral-600"> - {usuario.rol}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupabaseTest
