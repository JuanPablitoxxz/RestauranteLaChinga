# 🚀 Configuración Completa de Supabase para La Chinga

## 📋 Pasos para configurar la autenticación

### **Paso 1: Ejecutar el esquema de base de datos**

1. Ve a tu proyecto en Supabase: `https://uykvleeyuxoqhnbnbcch.supabase.co`
2. Abre el **Editor SQL**
3. Copia y pega el contenido de `database/schema.sql`
4. Ejecuta el script

### **Paso 2: Crear usuarios en Supabase Auth**

1. Ve a **Authentication > Users** en tu dashboard de Supabase
2. Haz clic en **"Add user"**
3. Crea los siguientes usuarios:

| Email | Password | Rol |
|-------|----------|-----|
| admin@lachinga.com | admin123 | admin |
| mesero1@lachinga.com | mesero123 | mesero |
| cajero@lachinga.com | cajero123 | cajero |
| cocina@lachinga.com | cocina123 | cocina |
| cliente@lachinga.com | cliente123 | cliente |

### **Paso 3: Insertar datos en la tabla usuarios**

Después de crear los usuarios en Auth, ejecuta este SQL en el Editor SQL:

```sql
-- Insertar usuarios en la tabla usuarios (después de crearlos en Auth)
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, turno) VALUES
('admin@lachinga.com', 'admin123', 'Juan', 'Administrador', 'admin', '7-15'),
('mesero1@lachinga.com', 'mesero123', 'Pedro', 'Mesero', 'mesero', '7-15'),
('cajero@lachinga.com', 'cajero123', 'María', 'Cajera', 'cajero', '7-15'),
('cocina@lachinga.com', 'cocina123', 'Carlos', 'Chef', 'cocina', '7-15'),
('cliente@lachinga.com', 'cliente123', 'Ana', 'Cliente', 'cliente', NULL);
```

### **Paso 4: Ejecutar datos iniciales**

1. Copia y pega el contenido de `database/setup_users.sql`
2. Ejecuta el script

### **Paso 5: Verificar la configuración**

1. Ve a tu aplicación en Vercel
2. Haz login con cualquiera de los usuarios creados
3. Deberías poder acceder al dashboard correspondiente

## 🔧 Solución de problemas

### **Error: "Usuario no encontrado"**
- Verifica que el usuario esté creado en **Authentication > Users**
- Verifica que el usuario esté en la tabla `usuarios`

### **Error: "Rol incorrecto"**
- Verifica que el rol en la tabla `usuarios` coincida con el seleccionado en el login

### **Error de conexión**
- Verifica que las credenciales de Supabase estén correctas en Vercel
- Verifica que el proyecto de Supabase esté activo

## 📞 Credenciales de prueba

Una vez configurado, puedes usar:

- **Admin:** admin@lachinga.com / admin123
- **Mesero:** mesero1@lachinga.com / mesero123
- **Cajero:** cajero@lachinga.com / cajero123
- **Cocina:** cocina@lachinga.com / cocina123
- **Cliente:** cliente@lachinga.com / cliente123
