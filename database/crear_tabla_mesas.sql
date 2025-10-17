-- Script para crear la tabla mesas
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la tabla mesas existe
SELECT 'VERIFICANDO EXISTENCIA DE TABLA MESAS:' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'mesas'
) as tabla_existe;

-- 2. Crear tabla mesas si no existe
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    ubicacion VARCHAR(50) NOT NULL DEFAULT 'interior',
    estado VARCHAR(20) NOT NULL DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada', 'mantenimiento')),
    mesero_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear trigger para updated_at (solo si no existe)
DO $$
BEGIN
    -- Crear función si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    END IF;
    
    -- Crear trigger si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_mesas_updated_at') THEN
        CREATE TRIGGER update_mesas_updated_at 
            BEFORE UPDATE ON mesas 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 4. Insertar mesas de ejemplo (24 mesas)
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

-- 5. Verificar que las mesas se crearon correctamente
SELECT 'MESAS CREADAS:' as info;
SELECT 
    id,
    numero,
    capacidad,
    ubicacion,
    estado,
    mesero_id
FROM mesas 
ORDER BY numero;

-- 6. Mostrar estadísticas
SELECT 'ESTADÍSTICAS DE MESAS:' as info;
SELECT 
    estado,
    COUNT(*) as cantidad
FROM mesas 
GROUP BY estado
ORDER BY estado;
