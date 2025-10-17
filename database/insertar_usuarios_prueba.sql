-- =====================================================
-- INSERTAR USUARIOS DE PRUEBA - LA CHINGA
-- =====================================================

-- Insertar usuarios de prueba si no existen
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno, activo, telefono) VALUES
-- Administrador
('admin@lachinga.com', 'admin123', 'Administrador', 'La Chinga', 'admin', '7-15', true, '+52 55 1234 5678'),

-- Mesero
('mesero@lachinga.com', 'mesero123', 'Pedro', 'González', 'mesero', '7-15', true, '+52 55 2345 6789'),

-- Cajero
('cajero@lachinga.com', 'cajero123', 'María', 'López', 'cajero', '7-15', true, '+52 55 3456 7890'),

-- Jefe de Cocina
('cocina@lachinga.com', 'cocina123', 'Roberto', 'Martínez', 'cocina', '7-15', true, '+52 55 4567 8901'),

-- Cliente de prueba
('cliente@lachinga.com', 'cliente123', 'Ana', 'García', 'cliente', '7-15', true, '+52 55 5678 9012'),

-- Clientes adicionales
('juan.perez@email.com', 'cliente123', 'Juan', 'Pérez', 'cliente', '7-15', true, '+52 55 1111 2222'),
('maria.rodriguez@email.com', 'cliente123', 'María', 'Rodríguez', 'cliente', '7-15', true, '+52 55 3333 4444'),
('carlos.lopez@email.com', 'cliente123', 'Carlos', 'López', 'cliente', '7-15', true, '+52 55 5555 6666'),
('lucia.martinez@email.com', 'cliente123', 'Lucía', 'Martínez', 'cliente', '7-15', true, '+52 55 7777 8888'),
('diego.hernandez@email.com', 'cliente123', 'Diego', 'Hernández', 'cliente', '7-15', true, '+52 55 9999 0000'),

-- Meseros adicionales
('mesero2@lachinga.com', 'mesero123', 'Luis', 'Fernández', 'mesero', '15-23', true, '+52 55 1111 3333'),
('mesero3@lachinga.com', 'mesero123', 'Carmen', 'Vega', 'mesero', '7-15', true, '+52 55 2222 4444'),

-- Cajeros adicionales
('cajero2@lachinga.com', 'cajero123', 'Fernando', 'Castro', 'cajero', '15-23', true, '+52 55 3333 5555'),

-- Cocineros adicionales
('cocina2@lachinga.com', 'cocina123', 'Isabel', 'Morales', 'cocina', '15-23', true, '+52 55 4444 6666')

ON CONFLICT (email) DO NOTHING;

-- Verificar usuarios insertados
SELECT 
    email,
    nombre,
    apellido,
    rol,
    turno,
    activo
FROM usuarios
ORDER BY rol, nombre;
