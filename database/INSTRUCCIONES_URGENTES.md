# 🚨 INSTRUCCIONES URGENTES - CONFIGURAR AUTENTICACIÓN

## ⚠️ PROBLEMA: No puedes hacer login

**CAUSA:** Los usuarios no están configurados correctamente en Supabase Auth.

## 🔧 SOLUCIÓN PASO A PASO

### **PASO 1: Ir a Supabase**
1. Ve a: `https://supabase.com/dashboard`
2. Selecciona tu proyecto: `lachinga-restaurante`
3. O ve directamente a: `https://supabase.com/dashboard/project/uykvleeyuxoqhnbnbcch`

### **PASO 2: Crear usuarios en Authentication**
1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Users"**
3. Haz clic en **"Add user"**
4. Crea estos 5 usuarios uno por uno:

#### **Usuario 1 - Admin:**
- **Email:** `admin@lachinga.com`
- **Password:** `admin123`
- **Confirm password:** `admin123`
- Haz clic en **"Create user"**

#### **Usuario 2 - Mesero:**
- **Email:** `mesero1@lachinga.com`
- **Password:** `mesero123`
- **Confirm password:** `mesero123`
- Haz clic en **"Create user"**

#### **Usuario 3 - Cajero:**
- **Email:** `cajero@lachinga.com`
- **Password:** `cajero123`
- **Confirm password:** `cajero123`
- Haz clic en **"Create user"**

#### **Usuario 4 - Cocina:**
- **Email:** `cocina@lachinga.com`
- **Password:** `cocina123`
- **Confirm password:** `cocina123`
- Haz clic en **"Create user"**

#### **Usuario 5 - Cliente:**
- **Email:** `cliente@lachinga.com`
- **Password:** `cliente123`
- **Confirm password:** `cliente123`
- Haz clic en **"Create user"**

### **PASO 3: Configurar la base de datos**
1. En el menú lateral, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**
3. Copia TODO el contenido del archivo `database/configuracion_completa.sql`
4. Pégalo en el editor
5. Haz clic en **"Run"** (botón verde)

### **PASO 4: Verificar que funcionó**
1. Ve a tu aplicación en Vercel
2. Intenta hacer login con:
   - **Email:** `admin@lachinga.com`
   - **Password:** `admin123`
   - **Rol:** `Administrador`
3. Deberías poder acceder al dashboard

## 🔍 VERIFICAR SI FUNCIONÓ

Si después de seguir estos pasos aún no funciona:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este query para verificar:
```sql
SELECT email, nombre, rol, activo FROM usuarios;
```
3. Deberías ver los 5 usuarios listados

## 📞 CREDENCIALES DE PRUEBA

Una vez configurado, usa estas credenciales:

| Email | Password | Rol |
|-------|----------|-----|
| admin@lachinga.com | admin123 | Administrador |
| mesero1@lachinga.com | mesero123 | Mesero |
| cajero@lachinga.com | cajero123 | Cajero |
| cocina@lachinga.com | cocina123 | Jefe de Cocina |
| cliente@lachinga.com | cliente123 | Cliente |

## ⚠️ IMPORTANTE

- **NO** cambies las contraseñas
- **NO** cambies los emails
- **NO** cambies los roles
- Debe ser **EXACTAMENTE** como se muestra arriba

## 🆘 SI AÚN NO FUNCIONA

1. Verifica que estés en el proyecto correcto de Supabase
2. Verifica que los usuarios estén en **Authentication > Users**
3. Verifica que el SQL se ejecutó sin errores
4. Verifica que las credenciales sean exactas (sin espacios extra)
