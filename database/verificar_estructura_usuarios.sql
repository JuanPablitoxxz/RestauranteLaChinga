-- Script para verificar la estructura de la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- Verificar si la tabla usuarios existe y su estructura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Verificar si las columnas necesarias existen
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'email') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as email_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'password') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as password_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'nombre') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as nombre_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'rol') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as rol_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'telefono') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as telefono_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'turno') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as turno_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'activo') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as activo_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_creacion') 
        THEN 'EXISTE' 
        ELSE 'NO EXISTE' 
    END as fecha_creacion_column;
