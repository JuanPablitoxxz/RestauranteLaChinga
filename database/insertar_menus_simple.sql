-- =====================================================
-- INSERTAR DATOS DE MENÚS MEXICANOS - LA CHINGA
-- =====================================================

-- Insertar cartas si no existen
INSERT INTO cartas (id, nombre, descripcion, horario_inicio, horario_fin, activa) VALUES
-- DESAYUNOS (7:00 - 11:00)
('carta-desayunos', 'Desayunos Mexicanos', 'Los mejores desayunos tradicionales de México', '07:00', '11:00', true),

-- ALMUERZOS (11:00 - 15:00)  
('carta-almuerzos', 'Almuerzos Tradicionales', 'Platos fuertes y especialidades mexicanas', '11:00', '15:00', true),

-- BEBIDAS MATUTINAS (7:00 - 15:00)
('carta-bebidas-matutinas', 'Bebidas Matutinas', 'Café, jugos y bebidas para empezar el día', '07:00', '15:00', true),

-- CENAS (15:00 - 23:00)
('carta-cenas', 'Cenas Especiales', 'Especialidades para la cena', '15:00', '23:00', true),

-- BEBIDAS VESPERTINAS (15:00 - 23:00)
('carta-bebidas-vespertinas', 'Bebidas Vespertinas', 'Cócteles, cervezas y bebidas para la noche', '15:00', '23:00', true),

-- POSTRES (Todo el día)
('carta-postres', 'Postres Mexicanos', 'Dulces tradicionales y postres especiales', '07:00', '23:00', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DESAYUNOS MEXICANOS (7:00 - 11:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Huevos y Desayunos
('desayuno-001', 'Huevos Rancheros', 'Huevos estrellados sobre tortillas con salsa ranchera, frijoles refritos y queso fresco', 85.00, 'Desayuno', true, 'carta-desayunos'),
('desayuno-002', 'Chilaquiles Rojos', 'Tortillas doradas con salsa roja, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, 'carta-desayunos'),
('desayuno-003', 'Chilaquiles Verdes', 'Tortillas doradas con salsa verde, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, 'carta-desayunos'),
('desayuno-004', 'Mollejas de Pollo', 'Mollejas de pollo en salsa verde con cebolla, cilantro y tortillas calientes', 120.00, 'Desayuno', true, 'carta-desayunos'),
('desayuno-005', 'Huevos a la Mexicana', 'Huevos revueltos con jitomate, cebolla, chile serrano y cilantro', 75.00, 'Desayuno', true, 'carta-desayunos'),
('desayuno-006', 'Machaca con Huevo', 'Carne seca deshebrada con huevo, jitomate, cebolla y chile verde', 110.00, 'Desayuno', true, 'carta-desayunos')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ALMUERZOS TRADICIONALES (11:00 - 15:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Sopas y Caldos
('almuerzo-001', 'Pozole Rojo', 'Pozole tradicional con carne de cerdo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, 'carta-almuerzos'),
('almuerzo-002', 'Pozole Verde', 'Pozole verde con pollo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, 'carta-almuerzos'),
('almuerzo-003', 'Menudo', 'Menudo tradicional con panza de res, maíz y especias', 110.00, 'Sopa', true, 'carta-almuerzos'),
('almuerzo-004', 'Sopa de Tortilla', 'Sopa de tortilla con jitomate, chile pasilla, queso y aguacate', 85.00, 'Sopa', true, 'carta-almuerzos'),

-- Platos Fuertes
('almuerzo-005', 'Enchiladas Suizas', 'Enchiladas de pollo bañadas en salsa verde con crema y queso gratinado', 95.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-006', 'Enchiladas Rojas', 'Enchiladas de pollo con salsa roja, crema, queso y cebolla', 95.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-007', 'Mole Poblano', 'Pollo bañado en mole poblano tradicional con arroz y frijoles', 150.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-008', 'Cochinita Pibil', 'Cochinita pibil tradicional con cebolla morada y tortillas', 130.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-009', 'Tacos de Carnitas', 'Tacos de carnitas con cebolla, cilantro y salsa verde', 80.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-010', 'Tacos de Barbacoa', 'Tacos de barbacoa con cebolla, cilantro y salsa roja', 85.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-011', 'Tacos de Pastor', 'Tacos al pastor con piña, cebolla y cilantro', 75.00, 'Plato Fuerte', true, 'carta-almuerzos'),
('almuerzo-012', 'Pollo a la Plancha', 'Pechuga de pollo a la plancha con arroz y frijoles', 100.00, 'Plato Fuerte', true, 'carta-almuerzos')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CENAS ESPECIALES (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Especialidades de Cena
('cena-001', 'Arrachera a la Parrilla', 'Arrachera marinada a la parrilla con guacamole y frijoles charros', 180.00, 'Especialidad', true, 'carta-cenas'),
('cena-002', 'Pescado a la Veracruzana', 'Filete de pescado con salsa veracruzana, arroz y ensalada', 160.00, 'Especialidad', true, 'carta-cenas'),
('cena-003', 'Chiles en Nogada', 'Chiles poblanos rellenos de picadillo con nogada y granada', 140.00, 'Especialidad', true, 'carta-cenas'),
('cena-004', 'Tacos de Pescado', 'Tacos de pescado empanizado con repollo, crema y salsa chipotle', 90.00, 'Especialidad', true, 'carta-cenas'),
('cena-005', 'Quesadillas de Huitlacoche', 'Quesadillas de huitlacoche con queso Oaxaca y epazote', 85.00, 'Especialidad', true, 'carta-cenas'),
('cena-006', 'Tlayuda Oaxaqueña', 'Tlayuda tradicional con frijoles, quesillo, tasajo y aguacate', 120.00, 'Especialidad', true, 'carta-cenas')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BEBIDAS MATUTINAS (7:00 - 15:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Café y Bebidas Calientes
('bebida-mat-001', 'Café de Olla', 'Café tradicional de olla con piloncillo y canela', 35.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas'),
('bebida-mat-002', 'Café Americano', 'Café americano tradicional', 25.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas'),
('bebida-mat-003', 'Café con Leche', 'Café con leche caliente', 30.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas'),
('bebida-mat-004', 'Chocolate Caliente', 'Chocolate caliente tradicional con canela', 40.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas'),
('bebida-mat-005', 'Atole de Vainilla', 'Atole tradicional de vainilla', 35.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas'),

-- Jugos y Bebidas Frías
('bebida-mat-006', 'Jugo de Naranja', 'Jugo de naranja natural recién exprimido', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas'),
('bebida-mat-007', 'Jugo de Toronja', 'Jugo de toronja natural', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas'),
('bebida-mat-008', 'Jugo de Piña', 'Jugo de piña natural', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas'),
('bebida-mat-009', 'Agua de Horchata', 'Agua de horchata tradicional con canela', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas'),
('bebida-mat-010', 'Agua de Jamaica', 'Agua de jamaica natural', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas'),
('bebida-mat-011', 'Agua de Tamarindo', 'Agua de tamarindo natural', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BEBIDAS VESPERTINAS (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Cervezas
('bebida-vesp-001', 'Corona Extra', 'Cerveza Corona Extra 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-002', 'Dos Equis Lager', 'Cerveza Dos Equis Lager 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-003', 'Tecate', 'Cerveza Tecate 355ml', 40.00, 'Cerveza', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-004', 'Modelo Especial', 'Cerveza Modelo Especial 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas'),

-- Cócteles Mexicanos
('bebida-vesp-005', 'Margarita Clásica', 'Margarita con tequila, limón y sal', 80.00, 'Cóctel', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-006', 'Margarita de Fresa', 'Margarita con tequila, fresa y limón', 85.00, 'Cóctel', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-007', 'Paloma', 'Paloma con tequila, toronja y sal', 75.00, 'Cóctel', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-008', 'Michelada', 'Michelada con cerveza, limón, sal y chile', 60.00, 'Cóctel', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-009', 'Sangrita', 'Sangrita tradicional con tequila', 70.00, 'Cóctel', true, 'carta-bebidas-vespertinas'),

-- Tequilas
('bebida-vesp-010', 'Tequila Blanco', 'Tequila blanco premium 2oz', 120.00, 'Tequila', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-011', 'Tequila Reposado', 'Tequila reposado premium 2oz', 140.00, 'Tequila', true, 'carta-bebidas-vespertinas'),
('bebida-vesp-012', 'Tequila Añejo', 'Tequila añejo premium 2oz', 180.00, 'Tequila', true, 'carta-bebidas-vespertinas')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POSTRES MEXICANOS (Todo el día)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Postres Tradicionales
('postre-001', 'Flan Napolitano', 'Flan tradicional con caramelo', 60.00, 'Postre', true, 'carta-postres'),
('postre-002', 'Tres Leches', 'Pastel de tres leches tradicional', 65.00, 'Postre', true, 'carta-postres'),
('postre-003', 'Churros con Chocolate', 'Churros recién hechos con chocolate caliente', 55.00, 'Postre', true, 'carta-postres'),
('postre-004', 'Pay de Limón', 'Pay de limón con merengue', 60.00, 'Postre', true, 'carta-postres'),
('postre-005', 'Gelatina de Mosaico', 'Gelatina de mosaico con frutas', 45.00, 'Postre', true, 'carta-postres'),
('postre-006', 'Arroz con Leche', 'Arroz con leche tradicional con canela', 50.00, 'Postre', true, 'carta-postres'),
('postre-007', 'Cajeta con Crepa', 'Crepa con cajeta y nuez', 70.00, 'Postre', true, 'carta-postres'),
('postre-008', 'Helado de Vainilla', 'Helado de vainilla con frutas', 40.00, 'Postre', true, 'carta-postres')
ON CONFLICT (id) DO NOTHING;
