-- =====================================================
-- INSERTAR DATOS DE MENÚS MEXICANOS - LA CHINGA (CORREGIDO)
-- =====================================================

-- Insertar cartas (usando gen_random_uuid() para IDs)
INSERT INTO cartas (nombre, descripcion, horario_inicio, horario_fin, activa) VALUES
-- DESAYUNOS (7:00 - 11:00)
('Desayunos Mexicanos', 'Los mejores desayunos tradicionales de México', '07:00', '11:00', true),

-- ALMUERZOS (11:00 - 15:00)  
('Almuerzos Tradicionales', 'Platos fuertes y especialidades mexicanas', '11:00', '15:00', true),

-- BEBIDAS MATUTINAS (7:00 - 15:00)
('Bebidas Matutinas', 'Café, jugos y bebidas para empezar el día', '07:00', '15:00', true),

-- CENAS (15:00 - 23:00)
('Cenas Especiales', 'Especialidades para la cena', '15:00', '23:00', true),

-- BEBIDAS VESPERTINAS (15:00 - 23:00)
('Bebidas Vespertinas', 'Cócteles, cervezas y bebidas para la noche', '15:00', '23:00', true),

-- POSTRES (Todo el día)
('Postres Mexicanos', 'Dulces tradicionales y postres especiales', '07:00', '23:00', true);

-- =====================================================
-- DESAYUNOS MEXICANOS (7:00 - 11:00)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Huevos y Desayunos
('Huevos Rancheros', 'Huevos estrellados sobre tortillas con salsa ranchera, frijoles refritos y queso fresco', 85.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos')),
('Chilaquiles Rojos', 'Tortillas doradas con salsa roja, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos')),
('Chilaquiles Verdes', 'Tortillas doradas con salsa verde, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos')),
('Mollejas de Pollo', 'Mollejas de pollo en salsa verde con cebolla, cilantro y tortillas calientes', 120.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos')),
('Huevos a la Mexicana', 'Huevos revueltos con jitomate, cebolla, chile serrano y cilantro', 75.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos')),
('Machaca con Huevo', 'Carne seca deshebrada con huevo, jitomate, cebolla y chile verde', 110.00, 'Desayuno', true, (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos'));

-- =====================================================
-- ALMUERZOS TRADICIONALES (11:00 - 15:00)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Sopas y Caldos
('Pozole Rojo', 'Pozole tradicional con carne de cerdo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Pozole Verde', 'Pozole verde con pollo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Menudo', 'Menudo tradicional con panza de res, maíz y especias', 110.00, 'Sopa', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Sopa de Tortilla', 'Sopa de tortilla con jitomate, chile pasilla, queso y aguacate', 85.00, 'Sopa', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),

-- Platos Fuertes
('Enchiladas Suizas', 'Enchiladas de pollo bañadas en salsa verde con crema y queso gratinado', 95.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Enchiladas Rojas', 'Enchiladas de pollo con salsa roja, crema, queso y cebolla', 95.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Mole Poblano', 'Pollo bañado en mole poblano tradicional con arroz y frijoles', 150.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Cochinita Pibil', 'Cochinita pibil tradicional con cebolla morada y tortillas', 130.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Tacos de Carnitas', 'Tacos de carnitas con cebolla, cilantro y salsa verde', 80.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Tacos de Barbacoa', 'Tacos de barbacoa con cebolla, cilantro y salsa roja', 85.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Tacos de Pastor', 'Tacos al pastor con piña, cebolla y cilantro', 75.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales')),
('Pollo a la Plancha', 'Pechuga de pollo a la plancha con arroz y frijoles', 100.00, 'Plato Fuerte', true, (SELECT id FROM cartas WHERE nombre = 'Almuerzos Tradicionales'));

-- =====================================================
-- CENAS ESPECIALES (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Especialidades de Cena
('Arrachera a la Parrilla', 'Arrachera marinada a la parrilla con guacamole y frijoles charros', 180.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales')),
('Pescado a la Veracruzana', 'Filete de pescado con salsa veracruzana, arroz y ensalada', 160.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales')),
('Chiles en Nogada', 'Chiles poblanos rellenos de picadillo con nogada y granada', 140.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales')),
('Tacos de Pescado', 'Tacos de pescado empanizado con repollo, crema y salsa chipotle', 90.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales')),
('Quesadillas de Huitlacoche', 'Quesadillas de huitlacoche con queso Oaxaca y epazote', 85.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales')),
('Tlayuda Oaxaqueña', 'Tlayuda tradicional con frijoles, quesillo, tasajo y aguacate', 120.00, 'Especialidad', true, (SELECT id FROM cartas WHERE nombre = 'Cenas Especiales'));

-- =====================================================
-- BEBIDAS MATUTINAS (7:00 - 15:00)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Café y Bebidas Calientes
('Café de Olla', 'Café tradicional de olla con piloncillo y canela', 35.00, 'Bebida Caliente', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Café Americano', 'Café americano tradicional', 25.00, 'Bebida Caliente', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Café con Leche', 'Café con leche caliente', 30.00, 'Bebida Caliente', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Chocolate Caliente', 'Chocolate caliente tradicional con canela', 40.00, 'Bebida Caliente', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Atole de Vainilla', 'Atole tradicional de vainilla', 35.00, 'Bebida Caliente', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),

-- Jugos y Bebidas Frías
('Jugo de Naranja', 'Jugo de naranja natural recién exprimido', 45.00, 'Jugo Natural', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Jugo de Toronja', 'Jugo de toronja natural', 45.00, 'Jugo Natural', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Jugo de Piña', 'Jugo de piña natural', 45.00, 'Jugo Natural', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Agua de Horchata', 'Agua de horchata tradicional con canela', 35.00, 'Agua Fresca', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Agua de Jamaica', 'Agua de jamaica natural', 35.00, 'Agua Fresca', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas')),
('Agua de Tamarindo', 'Agua de tamarindo natural', 35.00, 'Agua Fresca', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Matutinas'));

-- =====================================================
-- BEBIDAS VESPERTINAS (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Cervezas
('Corona Extra', 'Cerveza Corona Extra 355ml', 45.00, 'Cerveza', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Dos Equis Lager', 'Cerveza Dos Equis Lager 355ml', 45.00, 'Cerveza', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Tecate', 'Cerveza Tecate 355ml', 40.00, 'Cerveza', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Modelo Especial', 'Cerveza Modelo Especial 355ml', 45.00, 'Cerveza', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),

-- Cócteles Mexicanos
('Margarita Clásica', 'Margarita con tequila, limón y sal', 80.00, 'Cóctel', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Margarita de Fresa', 'Margarita con tequila, fresa y limón', 85.00, 'Cóctel', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Paloma', 'Paloma con tequila, toronja y sal', 75.00, 'Cóctel', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Michelada', 'Michelada con cerveza, limón, sal y chile', 60.00, 'Cóctel', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Sangrita', 'Sangrita tradicional con tequila', 70.00, 'Cóctel', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),

-- Tequilas
('Tequila Blanco', 'Tequila blanco premium 2oz', 120.00, 'Tequila', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Tequila Reposado', 'Tequila reposado premium 2oz', 140.00, 'Tequila', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas')),
('Tequila Añejo', 'Tequila añejo premium 2oz', 180.00, 'Tequila', true, (SELECT id FROM cartas WHERE nombre = 'Bebidas Vespertinas'));

-- =====================================================
-- POSTRES MEXICANOS (Todo el día)
-- =====================================================

INSERT INTO platos (nombre, descripcion, precio, categoria, disponible, carta_id) VALUES
-- Postres Tradicionales
('Flan Napolitano', 'Flan tradicional con caramelo', 60.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Tres Leches', 'Pastel de tres leches tradicional', 65.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Churros con Chocolate', 'Churros recién hechos con chocolate caliente', 55.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Pay de Limón', 'Pay de limón con merengue', 60.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Gelatina de Mosaico', 'Gelatina de mosaico con frutas', 45.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Arroz con Leche', 'Arroz con leche tradicional con canela', 50.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Cajeta con Crepa', 'Crepa con cajeta y nuez', 70.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos')),
('Helado de Vainilla', 'Helado de vainilla con frutas', 40.00, 'Postre', true, (SELECT id FROM cartas WHERE nombre = 'Postres Mexicanos'));

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 
    c.nombre as carta,
    c.horario_inicio,
    c.horario_fin,
    COUNT(p.id) as total_platos
FROM cartas c
LEFT JOIN platos p ON c.id = p.carta_id
GROUP BY c.id, c.nombre, c.horario_inicio, c.horario_fin
ORDER BY c.horario_inicio;

-- Mostrar platos por categoría
SELECT 
    categoria,
    COUNT(*) as cantidad_platos,
    MIN(precio) as precio_minimo,
    MAX(precio) as precio_maximo
FROM platos
GROUP BY categoria
ORDER BY categoria;
