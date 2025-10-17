# 🍽️ INSTRUCCIONES PARA CARGAR MENÚS MEXICANOS

## 📋 **PROBLEMA IDENTIFICADO:**
- **Menú vacío:** La carta del cliente no muestra platos, entradas ni bebidas
- **Causa:** Las tablas `cartas` y `platos` están vacías en Supabase
- **Solución:** Ejecutar scripts SQL con datos completos de menús mexicanos

## 🚀 **PASOS PARA RESOLVER:**

### **1. Acceder a Supabase**
1. Ve a tu proyecto de Supabase: `lachinga-restaurante`
2. Navega a **SQL Editor** en el menú lateral
3. Haz clic en **"New query"**

### **2. Ejecutar Script de Menús**
1. **Copia y pega** el contenido del archivo `database/insertar_menus_simple.sql`
2. **Haz clic en "Run"** para ejecutar el script
3. **Verifica** que no haya errores en la consola

### **3. Verificar Datos Insertados**
Ejecuta esta consulta para verificar que los datos se insertaron correctamente:

```sql
-- Verificar cartas creadas
SELECT 
    nombre,
    horario_inicio,
    horario_fin,
    activa
FROM cartas
ORDER BY horario_inicio;

-- Verificar platos por carta
SELECT 
    c.nombre as carta,
    COUNT(p.id) as total_platos
FROM cartas c
LEFT JOIN platos p ON c.id = p.carta_id
GROUP BY c.id, c.nombre
ORDER BY c.horario_inicio;
```

## 📊 **DATOS QUE SE INSERTARÁN:**

### **🍳 DESAYUNOS (7:00 - 11:00)**
- ✅ **6 platos:** Huevos Rancheros, Chilaquiles Rojos/Verdes, Mollejas de Pollo, etc.
- 💰 **Precios:** $75 - $120 MXN

### **🍲 ALMUERZOS (11:00 - 15:00)**
- ✅ **12 platos:** Pozole Rojo/Verde, Enchiladas, Mole Poblano, Tacos, etc.
- 💰 **Precios:** $75 - $150 MXN

### **🌮 CENAS (15:00 - 23:00)**
- ✅ **6 platos:** Arrachera, Pescado Veracruzana, Chiles en Nogada, etc.
- 💰 **Precios:** $85 - $180 MXN

### **☕ BEBIDAS MATUTINAS (7:00 - 15:00)**
- ✅ **11 bebidas:** Café de Olla, Jugos Naturales, Aguas Frescas, etc.
- 💰 **Precios:** $25 - $45 MXN

### **🍺 BEBIDAS VESPERTINAS (15:00 - 23:00)**
- ✅ **12 bebidas:** Cervezas, Cócteles Mexicanos, Tequilas, etc.
- 💰 **Precios:** $40 - $180 MXN

### **🍰 POSTRES (Todo el día)**
- ✅ **8 postres:** Flan, Tres Leches, Churros, Pay de Limón, etc.
- 💰 **Precios:** $40 - $70 MXN

## 🎯 **RESULTADO ESPERADO:**

### **✅ ANTES (Problema):**
- Menú vacío en la aplicación
- "No hay platos disponibles"
- Carta sin contenido

### **✅ DESPUÉS (Solución):**
- **55+ platos** disponibles en total
- **6 cartas** con horarios específicos
- **Menú dinámico** según la hora actual
- **Precios realistas** en pesos mexicanos
- **Categorías organizadas** (Desayuno, Sopa, Plato Fuerte, etc.)

## 🔄 **MENÚS DINÁMICOS POR HORA:**

| Hora | Menú Activo | Platos Disponibles |
|------|-------------|-------------------|
| **7:00 - 11:00** | Desayunos + Bebidas Matutinas | 17 platos |
| **11:00 - 15:00** | Almuerzos + Bebidas Matutinas | 23 platos |
| **15:00 - 23:00** | Cenas + Bebidas Vespertinas + Postres | 26 platos |

## 🚨 **NOTAS IMPORTANTES:**

1. **Script seguro:** Usa `ON CONFLICT DO NOTHING` para evitar duplicados
2. **IDs fijos:** Los IDs están predefinidos para evitar conflictos
3. **Horarios reales:** Los menús cambian automáticamente según la hora
4. **Precios mexicanos:** Todos los precios están en pesos mexicanos
5. **Categorías claras:** Cada plato tiene una categoría específica

## ✅ **VERIFICACIÓN FINAL:**

Después de ejecutar el script, verifica que:

1. ✅ **6 cartas** se crearon correctamente
2. ✅ **55+ platos** se insertaron sin errores
3. ✅ **Horarios** están configurados correctamente
4. ✅ **Precios** están en formato decimal
5. ✅ **Categorías** están asignadas

## 🎉 **RESULTADO:**

**¡El menú del cliente se llenará automáticamente con platos mexicanos auténticos!**

- 🍽️ **Desayunos tradicionales** (Huevos Rancheros, Chilaquiles)
- 🌮 **Almuerzos típicos** (Pozole, Mole, Tacos)
- 🍺 **Bebidas mexicanas** (Café de Olla, Aguas Frescas, Cócteles)
- 🍰 **Postres clásicos** (Flan, Tres Leches, Churros)

---

**¡Ejecuta el script y disfruta de un menú mexicano completo!** 🇲🇽🍽️
