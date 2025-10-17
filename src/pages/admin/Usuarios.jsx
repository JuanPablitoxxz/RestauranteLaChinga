import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuariosMock } from '../../data/mockData'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { 
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import FormularioUsuario from '../../components/forms/FormularioUsuario'

const UsuariosAdmin = () => {
  const queryClient = useQueryClient()
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [accionModal, setAccionModal] = useState('ver') // ver, editar, crear
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false)

  // Obtener usuarios
  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('fecha_creacion', { ascending: false })
      
      if (error) {
        console.error('Error al obtener usuarios:', error)
        return usuariosMock // Fallback a datos mock
      }
      
      return data || []
    },
    staleTime: 5 * 60 * 1000
  })

  // Filtrar usuarios
  const usuariosFiltrados = usuarios?.filter(usuario => {
    const cumpleBusqueda = busqueda === '' || 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    
    const cumpleRol = filtroRol === 'todos' || usuario.rol === filtroRol
    
    return cumpleBusqueda && cumpleRol
  }) || []

  // Mutación para eliminar usuario
  const eliminarUsuarioMutation = useMutation({
    mutationFn: async (usuarioId) => {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioId)

      if (error) {
        console.error('Error al eliminar usuario:', error)
        throw error
      }

      return { success: true }
    },
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente')
      queryClient.invalidateQueries(['usuarios'])
    },
    onError: () => {
      toast.error('Error al eliminar el usuario')
    }
  })

  const obtenerColorRol = (rol) => {
    const colores = {
      admin: 'bg-purple-100 text-purple-800',
      mesero: 'bg-green-100 text-green-800',
      cajero: 'bg-yellow-100 text-yellow-800',
      cocina: 'bg-orange-100 text-orange-800',
      cliente: 'bg-blue-100 text-blue-800'
    }
    return colores[rol] || 'bg-neutral-100 text-neutral-800'
  }

  const obtenerNombreRol = (rol) => {
    const nombres = {
      admin: 'Administrador',
      mesero: 'Mesero',
      cajero: 'Cajero',
      cocina: 'Jefe de Cocina',
      cliente: 'Cliente'
    }
    return nombres[rol] || rol
  }

  const eliminarUsuario = async (usuarioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      await eliminarUsuarioMutation.mutateAsync(usuarioId)
    }
  }

  const calcularEstadisticas = () => {
    const total = usuarios?.length || 0
    const porRol = usuarios?.reduce((acc, usuario) => {
      acc[usuario.rol] = (acc[usuario.rol] || 0) + 1
      return acc
    }, {}) || {}

    return { total, porRol }
  }

  const estadisticas = calcularEstadisticas()

  if (isLoadingUsuarios) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="loading-skeleton h-64 w-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-neutral-600">
          Administra los usuarios del sistema
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary-800 mb-1">
            {estadisticas.total}
          </div>
          <div className="text-sm text-neutral-600">Total</div>
        </div>
        
        {Object.entries(estadisticas.porRol).map(([rol, cantidad]) => (
          <div key={rol} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
            <div className="text-2xl font-bold text-primary-800 mb-1">
              {cantidad}
            </div>
            <div className="text-sm text-neutral-600 capitalize">
              {obtenerNombreRol(rol)}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'admin', label: 'Administradores' },
              { value: 'mesero', label: 'Meseros' },
              { value: 'cajero', label: 'Cajeros' },
              { value: 'cocina', label: 'Cocina' },
              { value: 'cliente', label: 'Clientes' }
            ].map((filtroOption) => (
              <motion.button
                key={filtroOption.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFiltroRol(filtroOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filtroRol === filtroOption.value
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {filtroOption.label}
              </motion.button>
            ))}
          </div>

          {/* Búsqueda y botón crear */}
          <div className="flex space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMostrarFormularioUsuario(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <UserPlusIcon className="h-4 w-4" />
              <span>Nuevo Usuario</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Lista de usuarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
            <UserGroupIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No hay usuarios
            </h2>
            <p className="text-neutral-600">
              {busqueda || filtroRol !== 'todos' 
                ? 'No se encontraron usuarios con los filtros aplicados'
                : 'No hay usuarios registrados en el sistema'
              }
            </p>
          </div>
        ) : (
          usuariosFiltrados.map((usuario, index) => (
            <motion.div
              key={usuario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-800">
                      {usuario.nombre.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {usuario.nombre}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {usuario.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorRol(usuario.rol)}`}>
                        {obtenerNombreRol(usuario.rol)}
                      </span>
                      {usuario.turno && (
                        <span className="text-xs text-neutral-500">
                          Turno: {usuario.turno}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAccionModal('ver')
                      setUsuarioSeleccionado(usuario)
                      setMostrarModal(true)
                    }}
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                    title="Ver detalles"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAccionModal('editar')
                      setUsuarioSeleccionado(usuario)
                      setMostrarModal(true)
                    }}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Editar usuario"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => eliminarUsuario(usuario.id)}
                    disabled={eliminarUsuarioMutation.isPending}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    title="Eliminar usuario"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{usuario.email}</span>
                  </div>
                  
                  {usuario.mesasAsignadas && usuario.mesasAsignadas.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span>Mesas asignadas: {usuario.mesasAsignadas.join(', ')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      usuario.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal de usuario */}
      {mostrarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              {accionModal === 'crear' ? 'Crear Usuario' :
               accionModal === 'editar' ? 'Editar Usuario' :
               'Detalles del Usuario'}
            </h3>

            {accionModal === 'ver' && usuarioSeleccionado ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary-800">
                      {usuarioSeleccionado.nombre.charAt(0)}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-800">
                    {usuarioSeleccionado.nombre}
                  </h4>
                  <p className="text-neutral-600">{usuarioSeleccionado.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Rol:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorRol(usuarioSeleccionado.rol)}`}>
                      {obtenerNombreRol(usuarioSeleccionado.rol)}
                    </span>
                  </div>
                  
                  {usuarioSeleccionado.turno && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Turno:</span>
                      <span className="text-neutral-800 capitalize">{usuarioSeleccionado.turno}</span>
                    </div>
                  )}
                  
                  {usuarioSeleccionado.mesasAsignadas && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Mesas asignadas:</span>
                      <span className="text-neutral-800">{usuarioSeleccionado.mesasAsignadas.join(', ')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      usuarioSeleccionado.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuarioSeleccionado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Fecha de creación:</span>
                    <span className="text-neutral-800">
                      {new Date(usuarioSeleccionado.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-600">
                  {accionModal === 'crear' 
                    ? 'Formulario para crear nuevo usuario'
                    : 'Formulario para editar usuario'
                  }
                </p>
                <p className="text-sm text-neutral-500">
                  Esta funcionalidad se implementaría con un formulario completo
                  para crear/editar usuarios con validaciones.
                </p>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Formulario de Usuario */}
      <FormularioUsuario
        isOpen={mostrarFormularioUsuario}
        onClose={() => setMostrarFormularioUsuario(false)}
        onUsuarioCreado={(nuevoUsuario) => {
          // Aquí se actualizaría la lista de usuarios
          queryClient.invalidateQueries(['usuarios'])
          toast.success('Usuario creado exitosamente')
        }}
      />
    </div>
  )
}

export default UsuariosAdmin
