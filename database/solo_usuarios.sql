-- SOLO USUARIOS - LO MÍNIMO NECESARIO
-- Ejecutar este script en el Editor SQL de Supabase

-- Crear tabla de usuarios si no existe
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

-- Insertar usuarios (solo si no existen)
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

-- Verificar que se insertaron los usuarios
SELECT email, nombre, apellido, rol FROM usuarios ORDER BY rol;
