-- SETUP SIMPLE PARA LA CHINGA - SOLO LO ESENCIAL
-- Ejecutar este script en el Editor SQL de Supabase

-- =====================================================
-- 1. CREAR TABLAS BÁSICAS
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de platos
CREATE TABLE IF NOT EXISTS platos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  carta_id UUID REFERENCES cartas(id),
  categoria VARCHAR(50),
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. INSERTAR DATOS BÁSICOS
-- =====================================================

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
-- 3. INSERTAR PLATOS BÁSICOS
-- =====================================================

-- Insertar algunos platos básicos
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
-- Desayunos
('Chilaquiles Rojos', 'Tortillas fritas con salsa roja, crema, queso y cebolla', 85.00, (SELECT id FROM cartas WHERE nombre = 'Desayuno' LIMIT 1), 'plato_principal'),
('Huevos Rancheros', 'Huevos estrellados con salsa ranchera, frijoles y tortillas', 75.00, (SELECT id FROM cartas WHERE nombre = 'Desayuno' LIMIT 1), 'plato_principal'),

-- Almuerzos
('Enchiladas Verdes', 'Tortillas rellenas de pollo con salsa verde y crema', 120.00, (SELECT id FROM cartas WHERE nombre = 'Almuerzo' LIMIT 1), 'plato_principal'),
('Tacos al Pastor', 'Tacos de cerdo marinado con piña y cebolla', 95.00, (SELECT id FROM cartas WHERE nombre = 'Almuerzo' LIMIT 1), 'plato_principal'),

-- Bebidas
('Agua de Horchata', 'Bebida refrescante de arroz con canela', 35.00, (SELECT id FROM cartas WHERE nombre = 'Drinks Mañana' LIMIT 1), 'bebida'),
('Margarita Clásica', 'Coctel de tequila con limón y sal', 85.00, (SELECT id FROM cartas WHERE nombre = 'Drinks Tarde' LIMIT 1), 'bebida'),

-- Cenas
('Mole Poblano', 'Pollo en mole poblano con arroz y frijoles', 150.00, (SELECT id FROM cartas WHERE nombre = 'Cena' LIMIT 1), 'plato_principal'),
('Carnitas', 'Carne de cerdo cocida lentamente con tortillas', 130.00, (SELECT id FROM cartas WHERE nombre = 'Cena' LIMIT 1), 'plato_principal')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. CREAR ÍNDICES BÁSICOS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_mesas_estado ON mesas(estado);

-- =====================================================
-- 5. VERIFICAR CONFIGURACIÓN
-- =====================================================

SELECT 'USUARIOS' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'MESAS', COUNT(*) FROM mesas
UNION ALL
SELECT 'CARTAS', COUNT(*) FROM cartas
UNION ALL
SELECT 'PLATOS', COUNT(*) FROM platos;
