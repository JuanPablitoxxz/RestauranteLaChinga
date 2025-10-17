-- Script para corregir la estructura de la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- Verificar si la tabla usuarios existe
DO $$
BEGIN
    -- Si la tabla no existe, crearla
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'usuarios') THEN
        CREATE TABLE usuarios (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'mesero', 'cajero', 'cocina', 'cliente')),
            telefono VARCHAR(20),
            turno VARCHAR(10) CHECK (turno IN ('7-15', '15-23')),
            activo BOOLEAN DEFAULT TRUE,
            es_temporal BOOLEAN DEFAULT FALSE,
            fecha_expiracion TIMESTAMP WITH TIME ZONE,
            reserva_id UUID,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabla usuarios creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla usuarios ya existe, verificando columnas...';
        
        -- Agregar columnas que no existen
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'email') THEN
            ALTER TABLE usuarios ADD COLUMN email VARCHAR(255);
            -- Actualizar registros existentes con email por defecto
            UPDATE usuarios SET email = 'usuario' || id || '@lachinga.com' WHERE email IS NULL;
            -- Ahora hacer la columna NOT NULL y UNIQUE
            ALTER TABLE usuarios ALTER COLUMN email SET NOT NULL;
            ALTER TABLE usuarios ADD CONSTRAINT usuarios_email_unique UNIQUE (email);
            RAISE NOTICE 'Columna email agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'password') THEN
            ALTER TABLE usuarios ADD COLUMN password VARCHAR(255);
            -- Actualizar registros existentes con contraseña por defecto
            UPDATE usuarios SET password = 'temp123' WHERE password IS NULL;
            -- Ahora hacer la columna NOT NULL
            ALTER TABLE usuarios ALTER COLUMN password SET NOT NULL;
            RAISE NOTICE 'Columna password agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'nombre') THEN
            ALTER TABLE usuarios ADD COLUMN nombre VARCHAR(255);
            -- Actualizar registros existentes con nombre por defecto
            UPDATE usuarios SET nombre = 'Usuario ' || id WHERE nombre IS NULL;
            -- Ahora hacer la columna NOT NULL
            ALTER TABLE usuarios ALTER COLUMN nombre SET NOT NULL;
            RAISE NOTICE 'Columna nombre agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'rol') THEN
            ALTER TABLE usuarios ADD COLUMN rol VARCHAR(50) NOT NULL DEFAULT 'cliente';
            RAISE NOTICE 'Columna rol agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'telefono') THEN
            ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);
            RAISE NOTICE 'Columna telefono agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'turno') THEN
            ALTER TABLE usuarios ADD COLUMN turno VARCHAR(10);
            RAISE NOTICE 'Columna turno agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'activo') THEN
            ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE;
            RAISE NOTICE 'Columna activo agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'es_temporal') THEN
            ALTER TABLE usuarios ADD COLUMN es_temporal BOOLEAN DEFAULT FALSE;
            RAISE NOTICE 'Columna es_temporal agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_expiracion') THEN
            ALTER TABLE usuarios ADD COLUMN fecha_expiracion TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Columna fecha_expiracion agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'reserva_id') THEN
            ALTER TABLE usuarios ADD COLUMN reserva_id UUID;
            RAISE NOTICE 'Columna reserva_id agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_creacion') THEN
            ALTER TABLE usuarios ADD COLUMN fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna fecha_creacion agregada';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'fecha_actualizacion') THEN
            ALTER TABLE usuarios ADD COLUMN fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna fecha_actualizacion agregada';
        END IF;
    END IF;
END $$;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_es_temporal ON usuarios(es_temporal);

-- Crear trigger para actualizar fecha_actualizacion si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuarios_updated_at') THEN
        CREATE TRIGGER update_usuarios_updated_at
            BEFORE UPDATE ON usuarios
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Trigger update_usuarios_updated_at creado';
    END IF;
END $$;

-- Insertar usuario administrador por defecto si no existe
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

-- Mostrar la estructura final de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Mostrar usuarios existentes
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
