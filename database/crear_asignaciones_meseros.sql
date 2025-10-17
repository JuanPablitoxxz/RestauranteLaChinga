-- Script para crear tabla de asignaciones de meseros
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de asignaciones de meseros
CREATE TABLE IF NOT EXISTS asignaciones_meseros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mesero_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mesa_id INTEGER NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activa BOOLEAN DEFAULT true,
    turno VARCHAR(10) NOT NULL CHECK (turno IN ('7-15', '15-23')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evitar asignaciones duplicadas
    UNIQUE(mesero_id, mesa_id, fecha_asignacion::date)
);

-- 2. Crear trigger para updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_asignaciones_meseros_updated_at') THEN
        CREATE TRIGGER update_asignaciones_meseros_updated_at 
            BEFORE UPDATE ON asignaciones_meseros 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 3. Crear tabla de notificaciones para meseros
CREATE TABLE IF NOT EXISTS notificaciones_meseros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mesero_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'pedido_nuevo', 
        'cliente_termina', 
        'pedido_listo', 
        'reserva_nueva',
        'mesa_asignada',
        'mesa_desasignada',
        'alerta_general'
    )),
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    datos JSONB, -- datos adicionales como mesa_id, pedido_id, etc.
    leida BOOLEAN DEFAULT false,
    prioridad VARCHAR(10) DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    leida_at TIMESTAMP WITH TIME ZONE
);

-- 4. Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_asignaciones_mesero ON asignaciones_meseros(mesero_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_mesa ON asignaciones_meseros(mesa_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_activa ON asignaciones_meseros(activa);
CREATE INDEX IF NOT EXISTS idx_asignaciones_turno ON asignaciones_meseros(turno);

CREATE INDEX IF NOT EXISTS idx_notificaciones_mesero ON notificaciones_meseros(mesero_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones_meseros(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones_meseros(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_prioridad ON notificaciones_meseros(prioridad);

-- 5. Insertar asignaciones de ejemplo para meseros existentes
-- Primero verificar que existan meseros
DO $$
DECLARE
    mesero1_id UUID;
    mesero2_id UUID;
    mesero3_id UUID;
    mesero4_id UUID;
BEGIN
    -- Obtener IDs de meseros existentes
    SELECT id INTO mesero1_id FROM usuarios WHERE rol = 'mesero' AND email LIKE '%mesero1%' LIMIT 1;
    SELECT id INTO mesero2_id FROM usuarios WHERE rol = 'mesero' AND email LIKE '%mesero2%' LIMIT 1;
    SELECT id INTO mesero3_id FROM usuarios WHERE rol = 'mesero' AND email LIKE '%mesero3%' LIMIT 1;
    SELECT id INTO mesero4_id FROM usuarios WHERE rol = 'mesero' AND email LIKE '%mesero4%' LIMIT 1;
    
    -- Si no existen meseros, crear algunos de ejemplo
    IF mesero1_id IS NULL THEN
        INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno, activo) 
        VALUES ('mesero1@lachinga.com', 'hash123', 'Carlos', 'Mendoza', 'mesero', '7-15', true)
        RETURNING id INTO mesero1_id;
    END IF;
    
    IF mesero2_id IS NULL THEN
        INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno, activo) 
        VALUES ('mesero2@lachinga.com', 'hash123', 'Ana', 'García', 'mesero', '7-15', true)
        RETURNING id INTO mesero2_id;
    END IF;
    
    IF mesero3_id IS NULL THEN
        INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno, activo) 
        VALUES ('mesero3@lachinga.com', 'hash123', 'Luis', 'Hernández', 'mesero', '15-23', true)
        RETURNING id INTO mesero3_id;
    END IF;
    
    IF mesero4_id IS NULL THEN
        INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno, activo) 
        VALUES ('mesero4@lachinga.com', 'hash123', 'María', 'López', 'mesero', '15-23', true)
        RETURNING id INTO mesero4_id;
    END IF;
    
    -- Asignar mesas a meseros (máximo 6 por mesero)
    -- Turno 7-15: Meseros 1 y 2
    INSERT INTO asignaciones_meseros (mesero_id, mesa_id, turno) VALUES
    (mesero1_id, 1, '7-15'),
    (mesero1_id, 2, '7-15'),
    (mesero1_id, 3, '7-15'),
    (mesero1_id, 4, '7-15'),
    (mesero1_id, 5, '7-15'),
    (mesero1_id, 6, '7-15'),
    (mesero2_id, 7, '7-15'),
    (mesero2_id, 8, '7-15'),
    (mesero2_id, 9, '7-15'),
    (mesero2_id, 10, '7-15'),
    (mesero2_id, 11, '7-15'),
    (mesero2_id, 12, '7-15')
    ON CONFLICT (mesero_id, mesa_id, fecha_asignacion::date) DO NOTHING;
    
    -- Turno 15-23: Meseros 3 y 4
    INSERT INTO asignaciones_meseros (mesero_id, mesa_id, turno) VALUES
    (mesero3_id, 13, '15-23'),
    (mesero3_id, 14, '15-23'),
    (mesero3_id, 15, '15-23'),
    (mesero3_id, 16, '15-23'),
    (mesero3_id, 17, '15-23'),
    (mesero3_id, 18, '15-23'),
    (mesero4_id, 19, '15-23'),
    (mesero4_id, 20, '15-23'),
    (mesero4_id, 21, '15-23'),
    (mesero4_id, 22, '15-23'),
    (mesero4_id, 23, '15-23'),
    (mesero4_id, 24, '15-23')
    ON CONFLICT (mesero_id, mesa_id, fecha_asignacion::date) DO NOTHING;
    
    RAISE NOTICE 'Asignaciones de meseros creadas exitosamente';
END $$;

-- 6. Crear notificaciones de ejemplo
INSERT INTO notificaciones_meseros (mesero_id, tipo, titulo, mensaje, datos, prioridad) 
SELECT 
    u.id,
    'mesa_asignada',
    'Nuevas mesas asignadas',
    'Se te han asignado nuevas mesas para el turno actual',
    '{"mesas": [1, 2, 3, 4, 5, 6]}'::jsonb,
    'normal'
FROM usuarios u 
WHERE u.rol = 'mesero' AND u.activo = true
ON CONFLICT DO NOTHING;

-- 7. Verificar las asignaciones creadas
SELECT 
    'ASIGNACIONES CREADAS:' as info,
    COUNT(*) as total_asignaciones
FROM asignaciones_meseros 
WHERE activa = true;

SELECT 
    'NOTIFICACIONES CREADAS:' as info,
    COUNT(*) as total_notificaciones
FROM notificaciones_meseros;
