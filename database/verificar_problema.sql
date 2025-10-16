-- SCRIPT PARA VERIFICAR EL PROBLEMA DE AUTENTICACIÓN
-- Ejecutar este script en el Editor SQL de Supabase

-- 1. Verificar si la tabla usuarios existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuarios') 
    THEN '✅ Tabla usuarios EXISTE'
    ELSE '❌ Tabla usuarios NO EXISTE'
  END as estado_tabla;

-- 2. Verificar si hay usuarios en la tabla
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM usuarios) 
    THEN '✅ Hay usuarios en la tabla'
    ELSE '❌ NO hay usuarios en la tabla'
  END as estado_usuarios;

-- 3. Mostrar todos los usuarios (si existen)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM usuarios) 
    THEN 'Usuarios encontrados:'
    ELSE 'No hay usuarios'
  END as mensaje;

-- 4. Listar usuarios si existen
SELECT email, nombre, apellido, rol, activo 
FROM usuarios 
ORDER BY rol;

-- 5. Verificar usuario específico
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@lachinga.com') 
    THEN '✅ Usuario admin@lachinga.com EXISTE'
    ELSE '❌ Usuario admin@lachinga.com NO EXISTE'
  END as estado_admin;

-- 6. Mostrar estructura de la tabla usuarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;
