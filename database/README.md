# 🗄️ Base de Datos - La Chinga Restaurante

## 📋 Configuración de Supabase

Esta carpeta contiene los archivos SQL para configurar la base de datos PostgreSQL en Supabase.

## 🚀 Instalación

### 1. **Crear proyecto en Supabase**
- Ve a [https://supabase.com](https://supabase.com)
- Crea un nuevo proyecto: `lachinga-restaurante`
- Región recomendada: `us-east-1`

### 2. **Ejecutar scripts SQL**

En el editor SQL de Supabase, ejecuta en orden:

```sql
-- 1. Crear esquema de tablas
-- Copiar y pegar: database/schema.sql

-- 2. Insertar datos iniciales
-- Copiar y pegar: database/seed.sql
```

### 3. **Conectar con Vercel**

1. En Supabase, ve a **Settings > API**
2. Copia las credenciales:
   - `Project URL`
   - `anon public key`
   - `service_role key` (solo para backend)

3. En Vercel, ve a **Settings > Environment Variables**
4. Agrega las variables:
   ```
   VITE_SUPABASE_URL=tu_project_url
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

## 📊 Estructura de Tablas

### **Principales:**
- `usuarios` - Admin, meseros, cajeros, cocina, clientes
- `mesas` - 24 mesas del restaurante
- `cartas` - Menús por horarios
- `platos` - Items de cada menú
- `reservas` - Reservas de clientes
- `pedidos` - Pedidos activos
- `facturas` - Cobros y pagos

## 🔐 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@lachinga.com | admin123 | Administrador |
| mesero1@lachinga.com | mesero123 | Mesero |
| cajero@lachinga.com | cajero123 | Cajero |
| cocina@lachinga.com | cocina123 | Cocina |
| cliente@lachinga.com | cliente123 | Cliente |

## 📝 Notas

- **Contraseñas:** En producción usar bcrypt
- **Migraciones:** Usar Supabase CLI para cambios
- **Backups:** Configurar en Supabase Dashboard

