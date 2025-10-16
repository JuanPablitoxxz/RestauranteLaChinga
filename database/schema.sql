-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA RESTAURANTE LA CHINGA
-- =====================================================
-- Sistema de gestión completo para restaurante mexicano
-- Incluye: usuarios, mesas, cartas, pedidos, reservas, facturas

-- =====================================================
-- 1. TABLA DE USUARIOS (Todos los roles)
-- =====================================================
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'mesero', 'cajero', 'cocina', 'cliente')),
  turno VARCHAR(10) CHECK (turno IN ('7-15', '15-23')),
  activo BOOLEAN DEFAULT true,
  telefono VARCHAR(20),
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABLA DE MESAS (24 mesas del restaurante)
-- =====================================================
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero INTEGER UNIQUE NOT NULL,
  capacidad INTEGER NOT NULL,
  estado VARCHAR(20) DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada', 'mantenimiento')),
  mesero_id UUID REFERENCES usuarios(id),
  ubicacion VARCHAR(50), -- 'interior', 'exterior', 'vip'
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABLA DE CARTAS/MENÚS (Por horarios)
-- =====================================================
CREATE TABLE cartas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  horario_inicio TIME NOT NULL,
  horario_fin TIME NOT NULL,
  activa BOOLEAN DEFAULT true,
  imagen_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABLA DE PLATOS (Items del menú)
-- =====================================================
CREATE TABLE platos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(500),
  carta_id UUID REFERENCES cartas(id),
  categoria VARCHAR(50), -- 'entrada', 'plato_principal', 'postre', 'bebida'
  ingredientes TEXT[],
  alergenos TEXT[],
  disponible BOOLEAN DEFAULT true,
  tiempo_preparacion INTEGER, -- minutos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABLA DE RESERVAS
-- =====================================================
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES usuarios(id),
  mesa_id INTEGER REFERENCES mesas(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  personas INTEGER NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada', 'no_show')),
  observaciones TEXT,
  codigo_reserva VARCHAR(10) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABLA DE PEDIDOS
-- =====================================================
CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mesa_id INTEGER REFERENCES mesas(id),
  mesero_id UUID REFERENCES usuarios(id),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cobrado', 'cancelado')),
  total DECIMAL(10,2) DEFAULT 0,
  observaciones TEXT,
  tiempo_estimado INTEGER, -- minutos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABLA DE ITEMS DEL PEDIDO
-- =====================================================
CREATE TABLE pedido_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  plato_id UUID REFERENCES platos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABLA DE FACTURAS
-- =====================================================
CREATE TABLE facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id),
  cajero_id UUID REFERENCES usuarios(id),
  total DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  impuestos DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(20) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'mixto')),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'cancelada')),
  numero_factura VARCHAR(20) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('info', 'warning', 'success', 'error')),
  leida BOOLEAN DEFAULT false,
  data JSONB, -- datos adicionales en formato JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABLA DE CONFIGURACIONES DEL SISTEMA
-- =====================================================
CREATE TABLE configuraciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(20) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Índices para mesas
CREATE INDEX idx_mesas_estado ON mesas(estado);
CREATE INDEX idx_mesas_mesero ON mesas(mesero_id);

-- Índices para reservas
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);

-- Índices para pedidos
CREATE INDEX idx_pedidos_mesa ON pedidos(mesa_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_mesero ON pedidos(mesero_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(created_at);

-- Índices para facturas
CREATE INDEX idx_facturas_estado ON facturas(estado);
CREATE INDEX idx_facturas_fecha ON facturas(created_at);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mesas_updated_at BEFORE UPDATE ON mesas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuraciones_updated_at BEFORE UPDATE ON configuraciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Usuarios del sistema: admin, meseros, cajeros, cocina y clientes';
COMMENT ON TABLE mesas IS '24 mesas del restaurante con estados y asignaciones';
COMMENT ON TABLE cartas IS 'Menús por horarios: desayuno, almuerzo, drinks, cena';
COMMENT ON TABLE platos IS 'Items individuales de cada carta/menú';
COMMENT ON TABLE reservas IS 'Reservas de mesas por clientes';
COMMENT ON TABLE pedidos IS 'Pedidos de clientes por mesa';
COMMENT ON TABLE pedido_items IS 'Items individuales dentro de cada pedido';
COMMENT ON TABLE facturas IS 'Facturas y cobros de pedidos';
COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones para usuarios';
COMMENT ON TABLE configuraciones IS 'Configuraciones del sistema del restaurante';
