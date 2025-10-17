-- Script para limpiar y recrear completamente las tablas de reservas (V2)
-- Ejecutar en Supabase SQL Editor
-- NO elimina la función update_updated_at_column() porque es usada por otras tablas

-- 1. Eliminar restricciones de clave foránea si existen
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_reserva_id_fkey;

-- 2. Eliminar columnas agregadas a usuarios si existen
ALTER TABLE usuarios DROP COLUMN IF EXISTS es_temporal;
ALTER TABLE usuarios DROP COLUMN IF EXISTS fecha_expiracion;
ALTER TABLE usuarios DROP COLUMN IF EXISTS reserva_id;

-- 3. Eliminar tabla reservas si existe
DROP TABLE IF EXISTS reservas CASCADE;

-- 4. Eliminar solo la función específica de limpieza si existe
DROP FUNCTION IF EXISTS limpiar_usuarios_temporales_expirados();

-- 5. Crear tabla de reservas con UUID
CREATE TABLE reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    duracion INTEGER DEFAULT 2,
    personas INTEGER NOT NULL CHECK (personas > 0 AND personas <= 12),
    mesa_id INTEGER REFERENCES mesas(id),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(255),
    observaciones TEXT,
    usuario_temporal VARCHAR(100) UNIQUE NOT NULL,
    password_temporal VARCHAR(100) NOT NULL,
    fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Agregar columnas a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN es_temporal BOOLEAN DEFAULT FALSE,
ADD COLUMN fecha_expiracion TIMESTAMP WITH TIME ZONE,
ADD COLUMN reserva_id UUID REFERENCES reservas(id);

-- 7. Crear índices
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_mesa_id ON reservas(mesa_id);
CREATE INDEX idx_reservas_usuario_temporal ON reservas(usuario_temporal);
CREATE INDEX idx_usuarios_temporal ON usuarios(es_temporal);
CREATE INDEX idx_usuarios_expiracion ON usuarios(fecha_expiracion);

-- 8. Crear trigger usando la función existente update_updated_at_column()
-- (No creamos la función porque ya existe y es usada por otras tablas)
CREATE TRIGGER update_reservas_updated_at
    BEFORE UPDATE ON reservas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Crear función para limpiar usuarios temporales expirados
CREATE OR REPLACE FUNCTION limpiar_usuarios_temporales_expirados()
RETURNS INTEGER AS $$
DECLARE
    usuarios_eliminados INTEGER;
BEGIN
    -- Eliminar usuarios temporales expirados
    DELETE FROM usuarios 
    WHERE es_temporal = TRUE 
    AND fecha_expiracion < NOW();
    
    GET DIAGNOSTICS usuarios_eliminados = ROW_COUNT;
    
    -- Actualizar estado de reservas relacionadas
    UPDATE reservas 
    SET estado = 'cancelada'
    WHERE usuario_temporal IN (
        SELECT usuario_temporal 
        FROM usuarios 
        WHERE es_temporal = TRUE 
        AND fecha_expiracion < NOW()
    );
    
    RETURN usuarios_eliminados;
END;
$$ LANGUAGE plpgsql;

-- 10. Insertar datos de ejemplo
INSERT INTO reservas (
    fecha, hora, duracion, personas, mesa_id, cliente_nombre, cliente_telefono, 
    cliente_email, observaciones, usuario_temporal, password_temporal, 
    fecha_expiracion, estado
) VALUES 
(
    CURRENT_DATE + INTERVAL '1 day', 
    '19:00:00', 
    2, 
    4, 
    5, 
    'María González', 
    '+52 55 1234 5678', 
    'maria@ejemplo.com', 
    'Celebración de cumpleaños', 
    'cliente_ejemplo_1', 
    'abc12345', 
    CURRENT_DATE + INTERVAL '2 days', 
    'confirmada'
),
(
    CURRENT_DATE + INTERVAL '2 days', 
    '20:30:00', 
    2, 
    2, 
    1, 
    'Carlos Ruiz', 
    '+52 55 9876 5432', 
    'carlos@ejemplo.com', 
    '', 
    'cliente_ejemplo_2', 
    'def67890', 
    CURRENT_DATE + INTERVAL '3 days', 
    'confirmada'
);

-- 11. Agregar comentarios
COMMENT ON TABLE reservas IS 'Tabla para gestionar las reservas del restaurante con credenciales temporales';
COMMENT ON COLUMN reservas.usuario_temporal IS 'Usuario temporal generado para el cliente (formato: cliente_timestamp)';
COMMENT ON COLUMN reservas.password_temporal IS 'Contraseña temporal generada para el cliente';
COMMENT ON COLUMN reservas.fecha_expiracion IS 'Fecha y hora de expiración de las credenciales temporales (24h después de la reserva)';
COMMENT ON COLUMN usuarios.es_temporal IS 'Indica si el usuario es temporal (generado para reservas)';
COMMENT ON COLUMN usuarios.fecha_expiracion IS 'Fecha de expiración para usuarios temporales';
COMMENT ON COLUMN usuarios.reserva_id IS 'ID de la reserva asociada al usuario temporal';

-- 12. Verificar que todo se creó correctamente
SELECT 'Tabla reservas creada correctamente' as status;
SELECT 'Columnas agregadas a usuarios correctamente' as status;
SELECT 'Índices creados correctamente' as status;
SELECT 'Funciones creadas correctamente' as status;

-- 13. Mostrar información de las tablas creadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('reservas', 'usuarios') 
AND column_name IN ('id', 'es_temporal', 'fecha_expiracion', 'reserva_id', 'usuario_temporal')
ORDER BY table_name, ordinal_position;
