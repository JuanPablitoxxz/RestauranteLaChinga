-- CONFIGURACIÓN CORREGIDA PARA LA CHINGA RESTAURANTE
-- Ejecutar TODO este script en el Editor SQL de Supabase

-- =====================================================
-- 1. CREAR ESQUEMA DE TABLAS
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
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

-- Tabla de mesas
CREATE TABLE IF NOT EXISTS mesas (
  id SERIAL PRIMARY KEY,
  numero INTEGER UNIQUE NOT NULL,
  capacidad INTEGER NOT NULL,
  estado VARCHAR(20) DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada', 'mantenimiento')),
  mesero_id UUID REFERENCES usuarios(id),
  ubicacion VARCHAR(50),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cartas
CREATE TABLE IF NOT EXISTS cartas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  horario_inicio TIME NOT NULL,
  horario_fin TIME NOT NULL,
  activa BOOLEAN DEFAULT true,
  imagen_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de platos
CREATE TABLE IF NOT EXISTS platos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(500),
  carta_id UUID REFERENCES cartas(id),
  categoria VARCHAR(50),
  ingredientes TEXT[],
  alergenos TEXT[],
  disponible BOOLEAN DEFAULT true,
  tiempo_preparacion INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
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

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mesa_id INTEGER REFERENCES mesas(id),
  mesero_id UUID REFERENCES usuarios(id),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cobrado', 'cancelado')),
  total DECIMAL(10,2) DEFAULT 0,
  observaciones TEXT,
  tiempo_estimado INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS pedido_items (
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

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
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

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('info', 'warning', 'success', 'error')),
  leida BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuraciones
CREATE TABLE IF NOT EXISTS configuraciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(20) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. INSERTAR DATOS INICIALES
-- =====================================================

-- Limpiar datos existentes (opcional)
-- DELETE FROM platos;
-- DELETE FROM cartas;
-- DELETE FROM mesas;
-- DELETE FROM usuarios;

-- Insertar cartas
INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) VALUES
('Desayuno', 'Desayunos tradicionales mexicanos', '07:00', '11:00'),
('Almuerzo', 'Comida del mediodía', '12:00', '15:00'),
('Drinks Mañana', 'Bebidas y cocteles matutinos', '10:00', '14:00'),
('Drinks Tarde', 'Bebidas y cocteles vespertinos', '15:00', '19:00'),
('Cena', 'Cena y platos principales', '19:00', '23:00')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar mesas (24 mesas)
INSERT INTO mesas (numero, capacidad, ubicacion) VALUES
(1, 2, 'interior'), (2, 4, 'interior'), (3, 6, 'interior'), (4, 2, 'interior'),
(5, 4, 'interior'), (6, 6, 'interior'), (7, 2, 'interior'), (8, 4, 'interior'),
(9, 6, 'exterior'), (10, 2, 'exterior'), (11, 4, 'exterior'), (12, 6, 'exterior'),
(13, 2, 'exterior'), (14, 4, 'exterior'), (15, 6, 'vip'), (16, 2, 'vip'),
(17, 4, 'vip'), (18, 6, 'vip'), (19, 2, 'interior'), (20, 4, 'interior'),
(21, 6, 'interior'), (22, 2, 'exterior'), (23, 4, 'exterior'), (24, 6, 'exterior')
ON CONFLICT (numero) DO NOTHING;

-- Insertar usuarios (IMPORTANTE: Estos deben coincidir con los usuarios creados en Supabase Auth)
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) VALUES
('admin@lachinga.com', 'admin123', 'Juan', 'Administrador', 'admin', '7-15'),
('mesero1@lachinga.com', 'mesero123', 'Pedro', 'Mesero', 'mesero', '7-15'),
('cajero@lachinga.com', 'cajero123', 'María', 'Cajera', 'cajero', '7-15'),
('cocina@lachinga.com', 'cocina123', 'Carlos', 'Chef', 'cocina', '7-15'),
('cliente@lachinga.com', 'cliente123', 'Ana', 'Cliente', 'cliente', NULL)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. INSERTAR PLATOS (CORREGIDO - SIN SUBCONSULTAS)
-- =====================================================

-- Obtener IDs de cartas y insertar platos
DO $$
DECLARE
    desayuno_id UUID;
    almuerzo_id UUID;
    drinks_manana_id UUID;
    drinks_tarde_id UUID;
    cena_id UUID;
BEGIN
    -- Obtener IDs de las cartas
    SELECT id INTO desayuno_id FROM cartas WHERE nombre = 'Desayuno' LIMIT 1;
    SELECT id INTO almuerzo_id FROM cartas WHERE nombre = 'Almuerzo' LIMIT 1;
    SELECT id INTO drinks_manana_id FROM cartas WHERE nombre = 'Drinks Mañana' LIMIT 1;
    SELECT id INTO drinks_tarde_id FROM cartas WHERE nombre = 'Drinks Tarde' LIMIT 1;
    SELECT id INTO cena_id FROM cartas WHERE nombre = 'Cena' LIMIT 1;

    -- Insertar platos de desayuno
    IF desayuno_id IS NOT NULL THEN
        INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
        ('Chilaquiles Rojos', 'Tortillas fritas con salsa roja, crema, queso y cebolla', 85.00, desayuno_id, 'plato_principal'),
        ('Huevos Rancheros', 'Huevos estrellados con salsa ranchera, frijoles y tortillas', 75.00, desayuno_id, 'plato_principal'),
        ('Molletes', 'Pan tostado con frijoles, queso gratinado y pico de gallo', 65.00, desayuno_id, 'plato_principal')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insertar platos de almuerzo
    IF almuerzo_id IS NOT NULL THEN
        INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
        ('Enchiladas Verdes', 'Tortillas rellenas de pollo con salsa verde y crema', 120.00, almuerzo_id, 'plato_principal'),
        ('Tacos al Pastor', 'Tacos de cerdo marinado con piña y cebolla', 95.00, almuerzo_id, 'plato_principal'),
        ('Pozole Rojo', 'Sopa tradicional con carne de cerdo y maíz', 110.00, almuerzo_id, 'plato_principal')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insertar bebidas de la mañana
    IF drinks_manana_id IS NOT NULL THEN
        INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
        ('Agua de Horchata', 'Bebida refrescante de arroz con canela', 35.00, drinks_manana_id, 'bebida'),
        ('Jamaica', 'Agua fresca de flor de jamaica', 30.00, drinks_manana_id, 'bebida')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insertar bebidas de la tarde
    IF drinks_tarde_id IS NOT NULL THEN
        INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
        ('Margarita Clásica', 'Coctel de tequila con limón y sal', 85.00, drinks_tarde_id, 'bebida')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insertar platos de cena
    IF cena_id IS NOT NULL THEN
        INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
        ('Mole Poblano', 'Pollo en mole poblano con arroz y frijoles', 150.00, cena_id, 'plato_principal'),
        ('Carnitas', 'Carne de cerdo cocida lentamente con tortillas', 130.00, cena_id, 'plato_principal'),
        ('Pescado a la Veracruzana', 'Filete de pescado con salsa de tomate y aceitunas', 140.00, cena_id, 'plato_principal')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insertar configuraciones del sistema
INSERT INTO configuraciones (clave, valor, descripcion, tipo) VALUES
('restaurante_nombre', 'La Chinga', 'Nombre del restaurante', 'string'),
('restaurante_telefono', '+52 55 1234 5678', 'Teléfono del restaurante', 'string'),
('restaurante_direccion', 'Av. Revolución 123, CDMX', 'Dirección del restaurante', 'string'),
('max_mesas_por_mesero', '6', 'Máximo número de mesas por mesero', 'number'),
('horario_apertura', '07:00', 'Hora de apertura del restaurante', 'string'),
('horario_cierre', '23:00', 'Hora de cierre del restaurante', 'string')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- 4. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Índices para mesas
CREATE INDEX IF NOT EXISTS idx_mesas_estado ON mesas(estado);
CREATE INDEX IF NOT EXISTS idx_mesas_mesero ON mesas(mesero_id);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON reservas(cliente_id);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa ON pedidos(mesa_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_mesero ON pedidos(mesero_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(created_at);

-- =====================================================
-- 5. VERIFICAR CONFIGURACIÓN
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 'USUARIOS' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'MESAS', COUNT(*) FROM mesas
UNION ALL
SELECT 'CARTAS', COUNT(*) FROM cartas
UNION ALL
SELECT 'PLATOS', COUNT(*) FROM platos
UNION ALL
SELECT 'CONFIGURACIONES', COUNT(*) FROM configuraciones;
