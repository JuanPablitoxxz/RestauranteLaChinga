-- Script específico para arreglar la columna apellido con valores nulos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura de la columna apellido
SELECT 'ESTRUCTURA DE LA COLUMNA APELLIDO:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' AND column_name = 'apellido';

-- 2. Verificar cuántos registros tienen apellido nulo
SELECT 'REGISTROS CON APELLIDO NULO:' as info;
SELECT COUNT(*) as registros_nulos
FROM usuarios 
WHERE apellido IS NULL;

-- 3. Mostrar algunos registros con apellido nulo
SELECT 'EJEMPLOS DE REGISTROS CON APELLIDO NULO:' as info;
SELECT 
    id,
    email,
    nombre,
    apellido,
    rol
FROM usuarios 
WHERE apellido IS NULL
LIMIT 5;

-- 4. Arreglar los valores nulos en apellido
DO $$
DECLARE
    registros_actualizados INTEGER;
BEGIN
    -- Actualizar registros con apellido nulo
    UPDATE usuarios 
    SET apellido = 'Usuario'
    WHERE apellido IS NULL;
    
    -- Obtener el número de registros actualizados
    GET DIAGNOSTICS registros_actualizados = ROW_COUNT;
    
    RAISE NOTICE 'Registros actualizados: %', registros_actualizados;
    
    -- Verificar que no queden registros nulos
    IF EXISTS (SELECT 1 FROM usuarios WHERE apellido IS NULL) THEN
        RAISE NOTICE 'ADVERTENCIA: Aún existen registros con apellido nulo';
    ELSE
        RAISE NOTICE 'ÉXITO: Todos los registros tienen apellido válido';
    END IF;
END $$;

-- 5. Verificar que se arregló el problema
SELECT 'VERIFICACIÓN FINAL:' as info;
SELECT COUNT(*) as registros_nulos_restantes
FROM usuarios 
WHERE apellido IS NULL;

-- 6. Mostrar algunos registros actualizados
SELECT 'REGISTROS ACTUALIZADOS:' as info;
SELECT 
    id,
    email,
    nombre,
    apellido,
    rol
FROM usuarios 
ORDER BY id DESC
LIMIT 5;

-- 7. Intentar insertar un usuario de prueba para verificar que funciona
DO $$
BEGIN
    -- Insertar usuario de prueba
    INSERT INTO usuarios (
        email, 
        password_hash,
        password,
        nombre,
        apellido,
        rol, 
        activo, 
        es_temporal
    ) VALUES (
        'test@lachinga.com',
        'test_hash_123',
        'test123',
        'Usuario',
        'Prueba',
        'cliente',
        TRUE,
        FALSE
    );
    
    RAISE NOTICE 'Usuario de prueba insertado correctamente';
    
    -- Eliminar el usuario de prueba
    DELETE FROM usuarios WHERE email = 'test@lachinga.com';
    
    RAISE NOTICE 'Usuario de prueba eliminado';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR al insertar usuario de prueba: %', SQLERRM;
END $$;
