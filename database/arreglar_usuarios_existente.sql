-- Script para arreglar la tabla usuarios existente
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura actual
SELECT 'ESTRUCTURA ACTUAL:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 2. Manejar la columna password_hash
DO $$
BEGIN
    -- Si existe password_hash y es NOT NULL, actualizar registros nulos
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'password_hash' AND is_nullable = 'NO') THEN
        
        -- Actualizar registros que tienen password_hash nulo
        UPDATE usuarios 
        SET password_hash = 'temp_hash_' || id 
        WHERE password_hash IS NULL;
        
        RAISE NOTICE 'Registros con password_hash nulo actualizados';
    END IF;
    
    -- Si existe password_hash pero es nullable, hacer que sea NOT NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'password_hash' AND is_nullable = 'YES') THEN
        
        -- Primero actualizar nulos
        UPDATE usuarios 
        SET password_hash = 'temp_hash_' || id 
        WHERE password_hash IS NULL;
        
        -- Luego hacer NOT NULL
        ALTER TABLE usuarios ALTER COLUMN password_hash SET NOT NULL;
        
        RAISE NOTICE 'Columna password_hash ahora es NOT NULL';
    END IF;
END $$;

-- 3. Manejar la columna email
DO $$
BEGIN
    -- Si existe email y es NOT NULL, actualizar registros nulos
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'email' AND is_nullable = 'NO') THEN
        
        -- Actualizar registros que tienen email nulo
        UPDATE usuarios 
        SET email = 'usuario' || id || '@lachinga.com' 
        WHERE email IS NULL;
        
        RAISE NOTICE 'Registros con email nulo actualizados';
    END IF;
END $$;

-- 4. Agregar columnas faltantes que necesitamos
DO $$
BEGIN
    -- Agregar password si no existe (para compatibilidad con nuestro código)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'password') THEN
        ALTER TABLE usuarios ADD COLUMN password VARCHAR(255);
        RAISE NOTICE 'Columna password agregada';
    END IF;
    
    -- Agregar nombre si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'nombre') THEN
        ALTER TABLE usuarios ADD COLUMN nombre VARCHAR(255);
        RAISE NOTICE 'Columna nombre agregada';
    END IF;
    
    -- Agregar rol si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'rol') THEN
        ALTER TABLE usuarios ADD COLUMN rol VARCHAR(50) DEFAULT 'cliente';
        RAISE NOTICE 'Columna rol agregada';
    END IF;
    
    -- Agregar telefono si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'telefono') THEN
        ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);
        RAISE NOTICE 'Columna telefono agregada';
    END IF;
    
    -- Agregar turno si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'turno') THEN
        ALTER TABLE usuarios ADD COLUMN turno VARCHAR(10);
        RAISE NOTICE 'Columna turno agregada';
    END IF;
    
    -- Agregar activo si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'activo') THEN
        ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Columna activo agregada';
    END IF;
    
    -- Agregar es_temporal si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'es_temporal') THEN
        ALTER TABLE usuarios ADD COLUMN es_temporal BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna es_temporal agregada';
    END IF;
    
    -- Agregar fecha_expiracion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_expiracion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_expiracion TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna fecha_expiracion agregada';
    END IF;
    
    -- Agregar reserva_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'reserva_id') THEN
        ALTER TABLE usuarios ADD COLUMN reserva_id UUID;
        RAISE NOTICE 'Columna reserva_id agregada';
    END IF;
    
    -- Agregar fecha_creacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_creacion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna fecha_creacion agregada';
    END IF;
    
    -- Agregar fecha_actualizacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_actualizacion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna fecha_actualizacion agregada';
    END IF;
END $$;

-- 5. Actualizar datos existentes con valores por defecto
UPDATE usuarios 
SET 
    password = COALESCE(password, 'temp123'),
    nombre = COALESCE(nombre, 'Usuario ' || id),
    rol = COALESCE(rol, 'cliente'),
    activo = COALESCE(activo, TRUE),
    es_temporal = COALESCE(es_temporal, FALSE),
    fecha_creacion = COALESCE(fecha_creacion, NOW())
WHERE 
    password IS NULL OR 
    nombre IS NULL OR 
    rol IS NULL OR 
    activo IS NULL OR 
    es_temporal IS NULL OR 
    fecha_creacion IS NULL;

-- 6. Hacer columnas NOT NULL solo después de actualizar datos
DO $$
BEGIN
    -- Hacer password NOT NULL si no lo es
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'password' AND is_nullable = 'YES') THEN
        BEGIN
            ALTER TABLE usuarios ALTER COLUMN password SET NOT NULL;
            RAISE NOTICE 'Columna password ahora es NOT NULL';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo hacer password NOT NULL: %', SQLERRM;
        END;
    END IF;
    
    -- Hacer nombre NOT NULL si no lo es
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'nombre' AND is_nullable = 'YES') THEN
        BEGIN
            ALTER TABLE usuarios ALTER COLUMN nombre SET NOT NULL;
            RAISE NOTICE 'Columna nombre ahora es NOT NULL';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo hacer nombre NOT NULL: %', SQLERRM;
        END;
    END IF;
    
    -- Hacer rol NOT NULL si no lo es
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'usuarios' AND column_name = 'rol' AND is_nullable = 'YES') THEN
        BEGIN
            ALTER TABLE usuarios ALTER COLUMN rol SET NOT NULL;
            RAISE NOTICE 'Columna rol ahora es NOT NULL';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo hacer rol NOT NULL: %', SQLERRM;
        END;
    END IF;
END $$;

-- 7. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_es_temporal ON usuarios(es_temporal);

-- 8. Insertar usuario administrador por defecto si no existe
INSERT INTO usuarios (
    email, 
    password_hash,
    password,
    nombre, 
    rol, 
    activo, 
    es_temporal,
    fecha_creacion
) VALUES (
    'admin@lachinga.com',
    'admin_hash_123',
    'admin123',
    'Administrador',
    'admin',
    TRUE,
    FALSE,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 9. Mostrar estructura final
SELECT 'ESTRUCTURA FINAL:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 10. Mostrar usuarios existentes
SELECT 'USUARIOS EXISTENTES:' as info;
SELECT 
    id,
    email,
    nombre,
    rol,
    activo,
    es_temporal,
    fecha_creacion
FROM usuarios
ORDER BY fecha_creacion DESC;
