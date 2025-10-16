-- SETUP FINAL PARA LA CHINGA - SIN CONFLICTOS
-- Ejecutar este script en el Editor SQL de Supabase

-- =====================================================
-- 1. LIMPIAR DATOS EXISTENTES (OPCIONAL)
-- =====================================================

-- Descomenta estas líneas si quieres limpiar datos existentes
-- DELETE FROM platos;
-- DELETE FROM cartas;
-- DELETE FROM mesas;
-- DELETE FROM usuarios;

-- =====================================================
-- 2. CREAR TABLAS BÁSICAS
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
-- 3. INSERTAR DATOS BÁSICOS (SIN ON CONFLICT)
-- =====================================================

-- Insertar cartas (solo si no existen)
INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) 
SELECT 'Desayuno', 'Desayunos tradicionales mexicanos', '07:00', '11:00'
WHERE NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Desayuno');

INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) 
SELECT 'Almuerzo', 'Comida del mediodía', '12:00', '15:00'
WHERE NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Almuerzo');

INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) 
SELECT 'Drinks Mañana', 'Bebidas y cocteles matutinos', '10:00', '14:00'
WHERE NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Drinks Mañana');

INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) 
SELECT 'Drinks Tarde', 'Bebidas y cocteles vespertinos', '15:00', '19:00'
WHERE NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Drinks Tarde');

INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) 
SELECT 'Cena', 'Cena y platos principales', '19:00', '23:00'
WHERE NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Cena');

-- Insertar mesas (solo si no existen)
INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 1, 2, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 1);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 2, 4, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 2);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 3, 6, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 3);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 4, 2, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 4);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 5, 4, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 5);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 6, 6, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 6);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 7, 2, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 7);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 8, 4, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 8);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 9, 6, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 9);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 10, 2, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 10);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 11, 4, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 11);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 12, 6, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 12);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 13, 2, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 13);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 14, 4, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 14);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 15, 6, 'vip' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 15);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 16, 2, 'vip' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 16);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 17, 4, 'vip' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 17);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 18, 6, 'vip' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 18);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 19, 2, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 19);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 20, 4, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 20);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 21, 6, 'interior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 21);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 22, 2, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 22);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 23, 4, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 23);

INSERT INTO mesas (numero, capacidad, ubicacion) 
SELECT 24, 6, 'exterior' WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 24);

-- Insertar usuarios (IMPORTANTE: Estos deben coincidir con los usuarios creados en Supabase Auth)
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) 
SELECT 'admin@lachinga.com', 'admin123', 'Juan', 'Administrador', 'admin', '7-15'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@lachinga.com');

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) 
SELECT 'mesero1@lachinga.com', 'mesero123', 'Pedro', 'Mesero', 'mesero', '7-15'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'mesero1@lachinga.com');

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) 
SELECT 'cajero@lachinga.com', 'cajero123', 'María', 'Cajera', 'cajero', '7-15'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'cajero@lachinga.com');

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) 
SELECT 'cocina@lachinga.com', 'cocina123', 'Carlos', 'Chef', 'cocina', '7-15'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'cocina@lachinga.com');

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) 
SELECT 'cliente@lachinga.com', 'cliente123', 'Ana', 'Cliente', 'cliente', NULL
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'cliente@lachinga.com');

-- =====================================================
-- 4. INSERTAR PLATOS BÁSICOS
-- =====================================================

-- Insertar platos de desayuno
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Chilaquiles Rojos', 'Tortillas fritas con salsa roja, crema, queso y cebolla', 85.00, 
       (SELECT id FROM cartas WHERE nombre = 'Desayuno' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Chilaquiles Rojos');

INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Huevos Rancheros', 'Huevos estrellados con salsa ranchera, frijoles y tortillas', 75.00, 
       (SELECT id FROM cartas WHERE nombre = 'Desayuno' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Huevos Rancheros');

-- Insertar platos de almuerzo
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Enchiladas Verdes', 'Tortillas rellenas de pollo con salsa verde y crema', 120.00, 
       (SELECT id FROM cartas WHERE nombre = 'Almuerzo' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Enchiladas Verdes');

INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Tacos al Pastor', 'Tacos de cerdo marinado con piña y cebolla', 95.00, 
       (SELECT id FROM cartas WHERE nombre = 'Almuerzo' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Tacos al Pastor');

-- Insertar bebidas
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Agua de Horchata', 'Bebida refrescante de arroz con canela', 35.00, 
       (SELECT id FROM cartas WHERE nombre = 'Drinks Mañana' LIMIT 1), 'bebida'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Agua de Horchata');

INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Margarita Clásica', 'Coctel de tequila con limón y sal', 85.00, 
       (SELECT id FROM cartas WHERE nombre = 'Drinks Tarde' LIMIT 1), 'bebida'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Margarita Clásica');

-- Insertar platos de cena
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Mole Poblano', 'Pollo en mole poblano con arroz y frijoles', 150.00, 
       (SELECT id FROM cartas WHERE nombre = 'Cena' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Mole Poblano');

INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) 
SELECT 'Carnitas', 'Carne de cerdo cocida lentamente con tortillas', 130.00, 
       (SELECT id FROM cartas WHERE nombre = 'Cena' LIMIT 1), 'plato_principal'
WHERE NOT EXISTS (SELECT 1 FROM platos WHERE nombre = 'Carnitas');

-- =====================================================
-- 5. CREAR ÍNDICES BÁSICOS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_mesas_estado ON mesas(estado);

-- =====================================================
-- 6. VERIFICAR CONFIGURACIÓN
-- =====================================================

SELECT 'USUARIOS' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'MESAS', COUNT(*) FROM mesas
UNION ALL
SELECT 'CARTAS', COUNT(*) FROM cartas
UNION ALL
SELECT 'PLATOS', COUNT(*) FROM platos;
