-- FIX DE PERMISOS PARA LA TABLA USUARIOS
-- Ejecutar este script en el Editor SQL de Supabase

-- 1. Deshabilitar RLS (Row Level Security) temporalmente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- 2. Crear política que permita todo (temporal)
CREATE POLICY "Permitir todo temporalmente" ON usuarios
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Verificar que RLS está deshabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'usuarios';

-- 4. Probar consulta
SELECT email, nombre, rol FROM usuarios WHERE email = 'admin@lachinga.com';
