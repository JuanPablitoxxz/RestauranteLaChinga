-- Script de diagnóstico completo para la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura completa de la tabla usuarios
SELECT 'ESTRUCTURA COMPLETA DE LA TABLA USUARIOS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 2. Verificar constraints de la tabla
SELECT 'CONSTRAINTS DE LA TABLA USUARIOS:' as info;
SELECT 
    constraint_name,
    constraint_type,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'usuarios'
ORDER BY tc.constraint_name;

-- 3. Verificar datos existentes
SELECT 'DATOS EXISTENTES EN LA TABLA USUARIOS:' as info;
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- 4. Mostrar algunos registros de ejemplo
SELECT 'REGISTROS DE EJEMPLO:' as info;
SELECT * FROM usuarios LIMIT 3;

-- 5. Verificar si hay columnas duplicadas o conflictivas
SELECT 'COLUMNAS RELACIONADAS CON PASSWORD:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND (column_name LIKE '%password%' OR column_name LIKE '%pass%' OR column_name LIKE '%hash%')
ORDER BY column_name;

-- 6. Verificar si hay columnas relacionadas con email
SELECT 'COLUMNAS RELACIONADAS CON EMAIL:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND (column_name LIKE '%email%' OR column_name LIKE '%mail%')
ORDER BY column_name;
