-- CONFIGURACIÓN DE USUARIOS PARA SUPABASE AUTH
-- Este script debe ejecutarse DESPUÉS de crear los usuarios en Supabase Auth

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

-- 3. INSERTAR PLATOS DE EJEMPLO
INSERT INTO platos (nombre, descripcion, precio, carta_id, categoria) VALUES
-- Desayunos
('Chilaquiles Rojos', 'Tortillas fritas con salsa roja, crema, queso y cebolla', 85.00, (SELECT id FROM cartas WHERE nombre = 'Desayuno'), 'plato_principal'),
('Huevos Rancheros', 'Huevos estrellados con salsa ranchera, frijoles y tortillas', 75.00, (SELECT id FROM cartas WHERE nombre = 'Desayuno'), 'plato_principal'),
('Molletes', 'Pan tostado con frijoles, queso gratinado y pico de gallo', 65.00, (SELECT id FROM cartas WHERE nombre = 'Desayuno'), 'plato_principal'),

-- Almuerzos
('Enchiladas Verdes', 'Tortillas rellenas de pollo con salsa verde y crema', 120.00, (SELECT id FROM cartas WHERE nombre = 'Almuerzo'), 'plato_principal'),
('Tacos al Pastor', 'Tacos de cerdo marinado con piña y cebolla', 95.00, (SELECT id FROM cartas WHERE nombre = 'Almuerzo'), 'plato_principal'),
('Pozole Rojo', 'Sopa tradicional con carne de cerdo y maíz', 110.00, (SELECT id FROM cartas WHERE nombre = 'Almuerzo'), 'plato_principal'),

-- Bebidas
('Agua de Horchata', 'Bebida refrescante de arroz con canela', 35.00, (SELECT id FROM cartas WHERE nombre = 'Drinks Mañana'), 'bebida'),
('Jamaica', 'Agua fresca de flor de jamaica', 30.00, (SELECT id FROM cartas WHERE nombre = 'Drinks Mañana'), 'bebida'),
('Margarita Clásica', 'Coctel de tequila con limón y sal', 85.00, (SELECT id FROM cartas WHERE nombre = 'Drinks Tarde'), 'bebida'),

-- Cenas
('Mole Poblano', 'Pollo en mole poblano con arroz y frijoles', 150.00, (SELECT id FROM cartas WHERE nombre = 'Cena'), 'plato_principal'),
('Carnitas', 'Carne de cerdo cocida lentamente con tortillas', 130.00, (SELECT id FROM cartas WHERE nombre = 'Cena'), 'plato_principal'),
('Pescado a la Veracruzana', 'Filete de pescado con salsa de tomate y aceitunas', 140.00, (SELECT id FROM cartas WHERE nombre = 'Cena'), 'plato_principal');

-- 4. CONFIGURACIONES DEL SISTEMA
INSERT INTO configuraciones (clave, valor, descripcion, tipo) VALUES
('restaurante_nombre', 'La Chinga', 'Nombre del restaurante', 'string'),
('restaurante_telefono', '+52 55 1234 5678', 'Teléfono del restaurante', 'string'),
('restaurante_direccion', 'Av. Revolución 123, CDMX', 'Dirección del restaurante', 'string'),
('max_mesas_por_mesero', '6', 'Máximo número de mesas por mesero', 'number'),
('horario_apertura', '07:00', 'Hora de apertura del restaurante', 'string'),
('horario_cierre', '23:00', 'Hora de cierre del restaurante', 'string');
