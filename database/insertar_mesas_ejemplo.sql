-- Script para insertar las 24 mesas de ejemplo
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la tabla mesas existe
SELECT 'VERIFICANDO TABLA MESAS:' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'mesas'
) as tabla_existe;

-- 2. Verificar cuántas mesas hay actualmente
SELECT 'MESAS ACTUALES:' as info;
SELECT COUNT(*) as total_mesas FROM mesas;

-- 3. Insertar las 24 mesas de ejemplo
INSERT INTO mesas (numero, capacidad, ubicacion, estado) VALUES
(1, 2, 'interior', 'libre'),
(2, 2, 'interior', 'libre'),
(3, 4, 'interior', 'libre'),
(4, 4, 'interior', 'libre'),
(5, 4, 'interior', 'libre'),
(6, 4, 'interior', 'libre'),
(7, 6, 'interior', 'libre'),
(8, 6, 'interior', 'libre'),
(9, 2, 'terraza', 'libre'),
(10, 2, 'terraza', 'libre'),
(11, 4, 'terraza', 'libre'),
(12, 4, 'terraza', 'libre'),
(13, 4, 'terraza', 'libre'),
(14, 4, 'terraza', 'libre'),
(15, 6, 'terraza', 'libre'),
(16, 6, 'terraza', 'libre'),
(17, 8, 'vip', 'libre'),
(18, 8, 'vip', 'libre'),
(19, 10, 'vip', 'libre'),
(20, 10, 'vip', 'libre'),
(21, 12, 'vip', 'libre'),
(22, 12, 'vip', 'libre'),
(23, 2, 'barra', 'libre'),
(24, 2, 'barra', 'libre')
ON CONFLICT (numero) DO NOTHING;

-- 4. Verificar que las mesas se insertaron correctamente
SELECT 'MESAS DESPUÉS DE INSERTAR:' as info;
SELECT COUNT(*) as total_mesas FROM mesas;

-- 5. Mostrar todas las mesas insertadas
SELECT 'TODAS LAS MESAS:' as info;
SELECT 
    id,
    numero,
    capacidad,
    ubicacion,
    estado
FROM mesas 
ORDER BY numero;

-- 6. Mostrar estadísticas por ubicación
SELECT 'ESTADÍSTICAS POR UBICACIÓN:' as info;
SELECT 
    ubicacion,
    COUNT(*) as cantidad,
    MIN(capacidad) as capacidad_min,
    MAX(capacidad) as capacidad_max
FROM mesas 
GROUP BY ubicacion
ORDER BY ubicacion;

-- 7. Mostrar estadísticas por estado
SELECT 'ESTADÍSTICAS POR ESTADO:' as info;
SELECT 
    estado,
    COUNT(*) as cantidad
FROM mesas 
GROUP BY estado
ORDER BY estado;
