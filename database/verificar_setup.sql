-- SCRIPT PARA VERIFICAR LA CONFIGURACIÓN DE SUPABASE
-- Ejecuta este script en el Editor SQL de Supabase para verificar el estado

-- 1. Verificar si las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('usuarios', 'mesas', 'cartas', 'platos', 'reservas', 'pedidos');

-- 2. Verificar si hay usuarios en la tabla usuarios
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- 3. Verificar usuarios específicos
SELECT email, nombre, apellido, rol, activo 
FROM usuarios 
WHERE email IN (
  'admin@lachinga.com',
  'mesero1@lachinga.com', 
  'cajero@lachinga.com',
  'cocina@lachinga.com',
  'cliente@lachinga.com'
);

-- 4. Verificar si hay mesas
SELECT COUNT(*) as total_mesas FROM mesas;

-- 5. Verificar si hay cartas
SELECT COUNT(*) as total_cartas FROM cartas;
