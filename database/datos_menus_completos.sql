-- =====================================================
-- DATOS COMPLETOS DE MENÚS MEXICANOS - LA CHINGA
-- =====================================================

-- Limpiar datos existentes
DELETE FROM platos;
DELETE FROM cartas;

-- Insertar cartas
INSERT INTO cartas (id, nombre, descripcion, horario_inicio, horario_fin, activa, turno) VALUES
-- DESAYUNOS (7:00 - 11:00)
('carta-desayunos', 'Desayunos Mexicanos', 'Los mejores desayunos tradicionales de México', '07:00', '11:00', true, 'mañana'),

-- ALMUERZOS (11:00 - 15:00)  
('carta-almuerzos', 'Almuerzos Tradicionales', 'Platos fuertes y especialidades mexicanas', '11:00', '15:00', true, 'mañana'),

-- BEBIDAS MATUTINAS (7:00 - 15:00)
('carta-bebidas-matutinas', 'Bebidas Matutinas', 'Café, jugos y bebidas para empezar el día', '07:00', '15:00', true, 'mañana'),

-- CENAS (15:00 - 23:00)
('carta-cenas', 'Cenas Especiales', 'Especialidades para la cena', '15:00', '23:00', true, 'tarde'),

-- BEBIDAS VESPERTINAS (15:00 - 23:00)
('carta-bebidas-vespertinas', 'Bebidas Vespertinas', 'Cócteles, cervezas y bebidas para la noche', '15:00', '23:00', true, 'tarde'),

-- POSTRES (Todo el día)
('carta-postres', 'Postres Mexicanos', 'Dulces tradicionales y postres especiales', '07:00', '23:00', true, 'ambos');

-- =====================================================
-- DESAYUNOS MEXICANOS (7:00 - 11:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Huevos y Desayunos
('desayuno-001', 'Huevos Rancheros', 'Huevos estrellados sobre tortillas con salsa ranchera, frijoles refritos y queso fresco', 85.00, 'Desayuno', true, 'carta-desayunos', '/images/huevos-rancheros.jpg'),
('desayuno-002', 'Chilaquiles Rojos', 'Tortillas doradas con salsa roja, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, 'carta-desayunos', '/images/chilaquiles-rojos.jpg'),
('desayuno-003', 'Chilaquiles Verdes', 'Tortillas doradas con salsa verde, pollo deshebrado, crema, queso y cebolla', 95.00, 'Desayuno', true, 'carta-desayunos', '/images/chilaquiles-verdes.jpg'),
('desayuno-004', 'Mollejas de Pollo', 'Mollejas de pollo en salsa verde con cebolla, cilantro y tortillas calientes', 120.00, 'Desayuno', true, 'carta-desayunos', '/images/mollejas-pollo.jpg'),
('desayuno-005', 'Huevos a la Mexicana', 'Huevos revueltos con jitomate, cebolla, chile serrano y cilantro', 75.00, 'Desayuno', true, 'carta-desayunos', '/images/huevos-mexicana.jpg'),
('desayuno-006', 'Machaca con Huevo', 'Carne seca deshebrada con huevo, jitomate, cebolla y chile verde', 110.00, 'Desayuno', true, 'carta-desayunos', '/images/machaca-huevo.jpg'),

-- =====================================================
-- ALMUERZOS TRADICIONALES (11:00 - 15:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Sopas y Caldos
('almuerzo-001', 'Pozole Rojo', 'Pozole tradicional con carne de cerdo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, 'carta-almuerzos', '/images/pozole-rojo.jpg'),
('almuerzo-002', 'Pozole Verde', 'Pozole verde con pollo, lechuga, rábanos, cebolla y orégano', 120.00, 'Sopa', true, 'carta-almuerzos', '/images/pozole-verde.jpg'),
('almuerzo-003', 'Menudo', 'Menudo tradicional con panza de res, maíz y especias', 110.00, 'Sopa', true, 'carta-almuerzos', '/images/menudo.jpg'),
('almuerzo-004', 'Sopa de Tortilla', 'Sopa de tortilla con jitomate, chile pasilla, queso y aguacate', 85.00, 'Sopa', true, 'carta-almuerzos', '/images/sopa-tortilla.jpg'),

-- Platos Fuertes
('almuerzo-005', 'Enchiladas Suizas', 'Enchiladas de pollo bañadas en salsa verde con crema y queso gratinado', 95.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/enchiladas-suizas.jpg'),
('almuerzo-006', 'Enchiladas Rojas', 'Enchiladas de pollo con salsa roja, crema, queso y cebolla', 95.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/enchiladas-rojas.jpg'),
('almuerzo-007', 'Mole Poblano', 'Pollo bañado en mole poblano tradicional con arroz y frijoles', 150.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/mole-poblano.jpg'),
('almuerzo-008', 'Cochinita Pibil', 'Cochinita pibil tradicional con cebolla morada y tortillas', 130.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/cochinita-pibil.jpg'),
('almuerzo-009', 'Tacos de Carnitas', 'Tacos de carnitas con cebolla, cilantro y salsa verde', 80.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/tacos-carnitas.jpg'),
('almuerzo-010', 'Tacos de Barbacoa', 'Tacos de barbacoa con cebolla, cilantro y salsa roja', 85.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/tacos-barbacoa.jpg'),
('almuerzo-011', 'Tacos de Pastor', 'Tacos al pastor con piña, cebolla y cilantro', 75.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/tacos-pastor.jpg'),
('almuerzo-012', 'Pollo a la Plancha', 'Pechuga de pollo a la plancha con arroz y frijoles', 100.00, 'Plato Fuerte', true, 'carta-almuerzos', '/images/pollo-plancha.jpg'),

-- =====================================================
-- CENAS ESPECIALES (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Especialidades de Cena
('cena-001', 'Arrachera a la Parrilla', 'Arrachera marinada a la parrilla con guacamole y frijoles charros', 180.00, 'Especialidad', true, 'carta-cenas', '/images/arrachera-parrilla.jpg'),
('cena-002', 'Pescado a la Veracruzana', 'Filete de pescado con salsa veracruzana, arroz y ensalada', 160.00, 'Especialidad', true, 'carta-cenas', '/images/pescado-veracruzana.jpg'),
('cena-003', 'Chiles en Nogada', 'Chiles poblanos rellenos de picadillo con nogada y granada', 140.00, 'Especialidad', true, 'carta-cenas', '/images/chiles-nogada.jpg'),
('cena-004', 'Tacos de Pescado', 'Tacos de pescado empanizado con repollo, crema y salsa chipotle', 90.00, 'Especialidad', true, 'carta-cenas', '/images/tacos-pescado.jpg'),
('cena-005', 'Quesadillas de Huitlacoche', 'Quesadillas de huitlacoche con queso Oaxaca y epazote', 85.00, 'Especialidad', true, 'carta-cenas', '/images/quesadillas-huitlacoche.jpg'),
('cena-006', 'Tlayuda Oaxaqueña', 'Tlayuda tradicional con frijoles, quesillo, tasajo y aguacate', 120.00, 'Especialidad', true, 'carta-cenas', '/images/tlayuda-oaxaquena.jpg'),

-- =====================================================
-- BEBIDAS MATUTINAS (7:00 - 15:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Café y Bebidas Calientes
('bebida-mat-001', 'Café de Olla', 'Café tradicional de olla con piloncillo y canela', 35.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas', '/images/cafe-olla.jpg'),
('bebida-mat-002', 'Café Americano', 'Café americano tradicional', 25.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas', '/images/cafe-americano.jpg'),
('bebida-mat-003', 'Café con Leche', 'Café con leche caliente', 30.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas', '/images/cafe-leche.jpg'),
('bebida-mat-004', 'Chocolate Caliente', 'Chocolate caliente tradicional con canela', 40.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas', '/images/chocolate-caliente.jpg'),
('bebida-mat-005', 'Atole de Vainilla', 'Atole tradicional de vainilla', 35.00, 'Bebida Caliente', true, 'carta-bebidas-matutinas', '/images/atole-vainilla.jpg'),

-- Jugos y Bebidas Frías
('bebida-mat-006', 'Jugo de Naranja', 'Jugo de naranja natural recién exprimido', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas', '/images/jugo-naranja.jpg'),
('bebida-mat-007', 'Jugo de Toronja', 'Jugo de toronja natural', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas', '/images/jugo-toronja.jpg'),
('bebida-mat-008', 'Jugo de Piña', 'Jugo de piña natural', 45.00, 'Jugo Natural', true, 'carta-bebidas-matutinas', '/images/jugo-pina.jpg'),
('bebida-mat-009', 'Agua de Horchata', 'Agua de horchata tradicional con canela', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas', '/images/agua-horchata.jpg'),
('bebida-mat-010', 'Agua de Jamaica', 'Agua de jamaica natural', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas', '/images/agua-jamaica.jpg'),
('bebida-mat-011', 'Agua de Tamarindo', 'Agua de tamarindo natural', 35.00, 'Agua Fresca', true, 'carta-bebidas-matutinas', '/images/agua-tamarindo.jpg'),

-- =====================================================
-- BEBIDAS VESPERTINAS (15:00 - 23:00)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Cervezas
('bebida-vesp-001', 'Corona Extra', 'Cerveza Corona Extra 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas', '/images/corona-extra.jpg'),
('bebida-vesp-002', 'Dos Equis Lager', 'Cerveza Dos Equis Lager 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas', '/images/dos-equis.jpg'),
('bebida-vesp-003', 'Tecate', 'Cerveza Tecate 355ml', 40.00, 'Cerveza', true, 'carta-bebidas-vespertinas', '/images/tecate.jpg'),
('bebida-vesp-004', 'Modelo Especial', 'Cerveza Modelo Especial 355ml', 45.00, 'Cerveza', true, 'carta-bebidas-vespertinas', '/images/modelo-especial.jpg'),

-- Cócteles Mexicanos
('bebida-vesp-005', 'Margarita Clásica', 'Margarita con tequila, limón y sal', 80.00, 'Cóctel', true, 'carta-bebidas-vespertinas', '/images/margarita-clasica.jpg'),
('bebida-vesp-006', 'Margarita de Fresa', 'Margarita con tequila, fresa y limón', 85.00, 'Cóctel', true, 'carta-bebidas-vespertinas', '/images/margarita-fresa.jpg'),
('bebida-vesp-007', 'Paloma', 'Paloma con tequila, toronja y sal', 75.00, 'Cóctel', true, 'carta-bebidas-vespertinas', '/images/paloma.jpg'),
('bebida-vesp-008', 'Michelada', 'Michelada con cerveza, limón, sal y chile', 60.00, 'Cóctel', true, 'carta-bebidas-vespertinas', '/images/michelada.jpg'),
('bebida-vesp-009', 'Sangrita', 'Sangrita tradicional con tequila', 70.00, 'Cóctel', true, 'carta-bebidas-vespertinas', '/images/sangrita.jpg'),

-- Tequilas
('bebida-vesp-010', 'Tequila Blanco', 'Tequila blanco premium 2oz', 120.00, 'Tequila', true, 'carta-bebidas-vespertinas', '/images/tequila-blanco.jpg'),
('bebida-vesp-011', 'Tequila Reposado', 'Tequila reposado premium 2oz', 140.00, 'Tequila', true, 'carta-bebidas-vespertinas', '/images/tequila-reposado.jpg'),
('bebida-vesp-012', 'Tequila Añejo', 'Tequila añejo premium 2oz', 180.00, 'Tequila', true, 'carta-bebidas-vespertinas', '/images/tequila-anejo.jpg'),

-- =====================================================
-- POSTRES MEXICANOS (Todo el día)
-- =====================================================

INSERT INTO platos (id, nombre, descripcion, precio, categoria, disponible, carta_id, imagen_url) VALUES
-- Postres Tradicionales
('postre-001', 'Flan Napolitano', 'Flan tradicional con caramelo', 60.00, 'Postre', true, 'carta-postres', '/images/flan-napolitano.jpg'),
('postre-002', 'Tres Leches', 'Pastel de tres leches tradicional', 65.00, 'Postre', true, 'carta-postres', '/images/tres-leches.jpg'),
('postre-003', 'Churros con Chocolate', 'Churros recién hechos con chocolate caliente', 55.00, 'Postre', true, 'carta-postres', '/images/churros-chocolate.jpg'),
('postre-004', 'Pay de Limón', 'Pay de limón con merengue', 60.00, 'Postre', true, 'carta-postres', '/images/pay-limon.jpg'),
('postre-005', 'Gelatina de Mosaico', 'Gelatina de mosaico con frutas', 45.00, 'Postre', true, 'carta-postres', '/images/gelatina-mosaico.jpg'),
('postre-006', 'Arroz con Leche', 'Arroz con leche tradicional con canela', 50.00, 'Postre', true, 'carta-postres', '/images/arroz-leche.jpg'),
('postre-007', 'Cajeta con Crepa', 'Crepa con cajeta y nuez', 70.00, 'Postre', true, 'carta-postres', '/images/cajeta-crepa.jpg'),
('postre-008', 'Helado de Vainilla', 'Helado de vainilla con frutas', 40.00, 'Postre', true, 'carta-postres', '/images/helado-vainilla.jpg');

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
