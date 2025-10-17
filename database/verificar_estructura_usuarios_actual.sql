-- Script para verificar la estructura actual de la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura de la tabla usuarios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 2. Verificar restricciones de la tabla
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'usuarios'
ORDER BY tc.constraint_type, kcu.column_name;

-- 3. Verificar datos existentes (solo primeras 3 filas)
SELECT 
    id,
    email,
    nombre,
    apellido,
    rol,
    activo,
    es_temporal,
    created_at,
    updated_at
FROM usuarios 
LIMIT 3;

-- 4. Contar total de usuarios
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- 5. Verificar si existen columnas password o password_hash
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'usuarios' AND column_name = 'password'
        ) THEN 'EXISTE columna password'
        ELSE 'NO EXISTE columna password'
    END as estado_password,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'usuarios' AND column_name = 'password_hash'
        ) THEN 'EXISTE columna password_hash'
        ELSE 'NO EXISTE columna password_hash'
    END as estado_password_hash;
