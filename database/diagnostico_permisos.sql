-- DIAGNÓSTICO DE PERMISOS Y CONFIGURACIÓN
-- Ejecutar este script en el Editor SQL de Supabase

-- 1. Verificar permisos de la tabla usuarios
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE tablename = 'usuarios';

-- 2. Verificar políticas RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usuarios';

-- 3. Verificar si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'usuarios';

-- 4. Verificar permisos específicos
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'usuarios' 
AND table_schema = 'public';

-- 5. Probar consulta simple
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- 6. Probar consulta con filtro
SELECT email, nombre, rol FROM usuarios WHERE email = 'admin@lachinga.com';
