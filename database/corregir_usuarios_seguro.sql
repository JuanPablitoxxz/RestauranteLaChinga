-- Script SEGURO para corregir la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Verificar estructura actual
SELECT 'ESTRUCTURA ACTUAL:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Paso 2: Verificar datos existentes
SELECT 'DATOS EXISTENTES:' as info;
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Paso 3: Agregar columnas faltantes de forma segura
DO $$
BEGIN
    -- Agregar email si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'email') THEN
        ALTER TABLE usuarios ADD COLUMN email VARCHAR(255);
        RAISE NOTICE 'Columna email agregada (nullable)';
    END IF;
    
    -- Agregar password si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'password') THEN
        ALTER TABLE usuarios ADD COLUMN password VARCHAR(255);
        RAISE NOTICE 'Columna password agregada (nullable)';
    END IF;
    
    -- Agregar nombre si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'nombre') THEN
        ALTER TABLE usuarios ADD COLUMN nombre VARCHAR(255);
        RAISE NOTICE 'Columna nombre agregada (nullable)';
    END IF;
    
    -- Agregar rol si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'rol') THEN
        ALTER TABLE usuarios ADD COLUMN rol VARCHAR(50) DEFAULT 'cliente';
        RAISE NOTICE 'Columna rol agregada con default';
    END IF;
    
    -- Agregar telefono si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'telefono') THEN
        ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);
        RAISE NOTICE 'Columna telefono agregada (nullable)';
    END IF;
    
    -- Agregar turno si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'turno') THEN
        ALTER TABLE usuarios ADD COLUMN turno VARCHAR(10);
        RAISE NOTICE 'Columna turno agregada (nullable)';
    END IF;
    
    -- Agregar activo si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'activo') THEN
        ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Columna activo agregada con default';
    END IF;
    
    -- Agregar es_temporal si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'es_temporal') THEN
        ALTER TABLE usuarios ADD COLUMN es_temporal BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna es_temporal agregada con default';
    END IF;
    
    -- Agregar fecha_expiracion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_expiracion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_expiracion TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna fecha_expiracion agregada (nullable)';
    END IF;
    
    -- Agregar reserva_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'reserva_id') THEN
        ALTER TABLE usuarios ADD COLUMN reserva_id UUID;
        RAISE NOTICE 'Columna reserva_id agregada (nullable)';
    END IF;
    
    -- Agregar fecha_creacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_creacion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna fecha_creacion agregada con default';
    END IF;
    
    -- Agregar fecha_actualizacion si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_actualizacion') THEN
        ALTER TABLE usuarios ADD COLUMN fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna fecha_actualizacion agregada con default';
    END IF;
END $$;

-- Paso 4: Actualizar datos existentes con valores por defecto
UPDATE usuarios 
SET 
    email = COALESCE(email, 'usuario' || id || '@lachinga.com'),
    password = COALESCE(password, 'temp123'),
    nombre = COALESCE(nombre, 'Usuario ' || id),
    rol = COALESCE(rol, 'cliente'),
    activo = COALESCE(activo, TRUE),
    es_temporal = COALESCE(es_temporal, FALSE),
    fecha_creacion = COALESCE(fecha_creacion, NOW())
WHERE 
    email IS NULL OR 
    password IS NULL OR 
    nombre IS NULL OR 
    rol IS NULL OR 
    activo IS NULL OR 
    es_temporal IS NULL OR 
    fecha_creacion IS NULL;

-- Paso 5: Hacer columnas NOT NULL solo después de actualizar datos
DO $$
BEGIN
    -- Hacer email NOT NULL
    BEGIN
        ALTER TABLE usuarios ALTER COLUMN email SET NOT NULL;
        RAISE NOTICE 'Columna email ahora es NOT NULL';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No se pudo hacer email NOT NULL: %', SQLERRM;
    END;
    
    -- Hacer password NOT NULL
    BEGIN
        ALTER TABLE usuarios ALTER COLUMN password SET NOT NULL;
        RAISE NOTICE 'Columna password ahora es NOT NULL';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No se pudo hacer password NOT NULL: %', SQLERRM;
    END;
    
    -- Hacer nombre NOT NULL
    BEGIN
        ALTER TABLE usuarios ALTER COLUMN nombre SET NOT NULL;
        RAISE NOTICE 'Columna nombre ahora es NOT NULL';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No se pudo hacer nombre NOT NULL: %', SQLERRM;
    END;
    
    -- Hacer rol NOT NULL
    BEGIN
        ALTER TABLE usuarios ALTER COLUMN rol SET NOT NULL;
        RAISE NOTICE 'Columna rol ahora es NOT NULL';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'No se pudo hacer rol NOT NULL: %', SQLERRM;
    END;
END $$;

-- Paso 6: Agregar restricciones únicas si no existen
DO $$
BEGIN
    -- Agregar constraint único para email si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'usuarios' AND constraint_name = 'usuarios_email_unique') THEN
        BEGIN
            ALTER TABLE usuarios ADD CONSTRAINT usuarios_email_unique UNIQUE (email);
            RAISE NOTICE 'Constraint único para email agregado';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo agregar constraint único para email: %', SQLERRM;
        END;
    END IF;
END $$;

-- Paso 7: Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_es_temporal ON usuarios(es_temporal);

-- Paso 8: Insertar usuario administrador por defecto si no existe
INSERT INTO usuarios (
    email, 
    password, 
    nombre, 
    rol, 
    activo, 
    es_temporal,
    fecha_creacion
) VALUES (
    'admin@lachinga.com',
    'admin123',
    'Administrador',
    'admin',
    TRUE,
    FALSE,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Paso 9: Mostrar estructura final
SELECT 'ESTRUCTURA FINAL:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Paso 10: Mostrar usuarios existentes
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
