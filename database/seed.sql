-- DATOS INICIALES PARA LA CHINGA RESTAURANTE
-- Ejecutar después de schema.sql

-- 1. INSERTAR CARTAS
INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin) VALUES
('Desayuno', 'Desayunos tradicionales mexicanos', '07:00', '11:00'),
('Almuerzo', 'Comida del mediodía', '12:00', '15:00'),
('Drinks Mañana', 'Bebidas y cocteles matutinos', '10:00', '14:00'),
('Drinks Tarde', 'Bebidas y cocteles vespertinos', '15:00', '19:00'),
('Cena', 'Cena y platos principales', '19:00', '23:00');

-- 2. INSERTAR MESAS (24 mesas)
INSERT INTO mesas (numero, capacidad, ubicacion) VALUES
(1, 2, 'interior'), (2, 4, 'interior'), (3, 6, 'interior'), (4, 2, 'interior'),
(5, 4, 'interior'), (6, 6, 'interior'), (7, 2, 'interior'), (8, 4, 'interior'),
(9, 6, 'exterior'), (10, 2, 'exterior'), (11, 4, 'exterior'), (12, 6, 'exterior'),
(13, 2, 'exterior'), (14, 4, 'exterior'), (15, 6, 'vip'), (16, 2, 'vip'),
(17, 4, 'vip'), (18, 6, 'vip'), (19, 2, 'interior'), (20, 4, 'interior'),
(21, 6, 'interior'), (22, 2, 'exterior'), (23, 4, 'exterior'), (24, 6, 'exterior');

-- 3. USUARIOS DE PRUEBA (usar bcrypt para passwords en producción)
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) VALUES
('admin@lachinga.com', 'admin123', 'Juan', 'Administrador', 'admin', '7-15'),
('mesero1@lachinga.com', 'mesero123', 'Pedro', 'Mesero', 'mesero', '7-15'),
('cajero@lachinga.com', 'cajero123', 'María', 'Cajera', 'cajero', '7-15'),
('cocina@lachinga.com', 'cocina123', 'Carlos', 'Chef', 'cocina', '7-15'),
('cliente@lachinga.com', 'cliente123', 'Ana', 'Cliente', 'cliente', NULL);

