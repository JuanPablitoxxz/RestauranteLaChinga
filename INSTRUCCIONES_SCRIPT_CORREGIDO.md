# 🔧 SCRIPT SQL CORREGIDO - ERROR UUID RESUELTO

## ❌ **ERROR IDENTIFICADO:**
```
ERROR: 22P02: sintaxis de entrada no válida para el tipo uuid: "carta-desayunos"
```

## ✅ **PROBLEMA RESUELTO:**

**🔍 Causa del Error:**
- Supabase usa columnas `id` de tipo UUID
- Los strings como `"carta-desayunos"` no son UUIDs válidos
- Necesitamos usar `gen_random_uuid()` o referencias por nombre

**🛠️ Solución Implementada:**
- ✅ **Script corregido:** `database/insertar_menus_corregido.sql`
- ✅ **IDs automáticos:** Usa `gen_random_uuid()` para cartas
- ✅ **Referencias por nombre:** Los platos referencian cartas por nombre
- ✅ **Sin conflictos:** No usa `ON CONFLICT` que causaba problemas

## 🚀 **INSTRUCCIONES CORREGIDAS:**

### **PASO 1: Usar el Script Corregido**
1. **Accede a Supabase:**
   - Ve a tu proyecto: `lachinga-restaurante`
   - Navega a **SQL Editor**
   - Haz clic en **"New query"**

2. **Ejecuta el script corregido:**
   - **NO uses** `database/insertar_menus_simple.sql` (tiene error UUID)
   - **USA** `database/insertar_menus_corregido.sql` (corregido)
   - Copia y pega el contenido del archivo corregido
   - Haz clic en **"Run"**

3. **Verifica que no haya errores:**
   - El script debe ejecutarse sin errores
   - Deberías ver mensajes de inserción exitosa

### **PASO 2: Verificar los Datos**
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

### **🍳 DESAYUNOS (7:00 - 11:00) - 6 platos:**
- Huevos Rancheros ($85)
- Chilaquiles Rojos/Verdes ($95)
- Mollejas de Pollo ($120)
- Huevos a la Mexicana ($75)
- Machaca con Huevo ($110)

### **🍲 ALMUERZOS (11:00 - 15:00) - 12 platos:**
- Pozole Rojo/Verde ($120)
- Menudo ($110)
- Sopa de Tortilla ($85)
- Enchiladas Suizas/Rojas ($95)
- Mole Poblano ($150)
- Cochinita Pibil ($130)
- Tacos de Carnitas/Barbacoa/Pastor ($75-85)
- Pollo a la Plancha ($100)

### **🌮 CENAS (15:00 - 23:00) - 6 platos:**
- Arrachera a la Parrilla ($180)
- Pescado a la Veracruzana ($160)
- Chiles en Nogada ($140)
- Tacos de Pescado ($90)
- Quesadillas de Huitlacoche ($85)
- Tlayuda Oaxaqueña ($120)

### **☕ BEBIDAS MATUTINAS (7:00 - 15:00) - 11 bebidas:**
- Café de Olla ($35)
- Café Americano ($25)
- Café con Leche ($30)
- Chocolate Caliente ($40)
- Atole de Vainilla ($35)
- Jugos Naturales ($45)
- Aguas Frescas ($35)

### **🍺 BEBIDAS VESPERTINAS (15:00 - 23:00) - 12 bebidas:**
- Cervezas Mexicanas ($40-45)
- Cócteles Mexicanos ($60-85)
- Tequilas Premium ($120-180)

### **🍰 POSTRES (Todo el día) - 8 postres:**
- Flan Napolitano ($60)
- Tres Leches ($65)
- Churros con Chocolate ($55)
- Pay de Limón ($60)
- Gelatina de Mosaico ($45)
- Arroz con Leche ($50)
- Cajeta con Crepa ($70)
- Helado de Vainilla ($40)

## 🎯 **DIFERENCIAS DEL SCRIPT CORREGIDO:**

### **❌ Script Original (con error):**
```sql
INSERT INTO cartas (id, nombre, ...) VALUES
('carta-desayunos', 'Desayunos Mexicanos', ...)  -- ❌ Error UUID
```

### **✅ Script Corregido:**
```sql
INSERT INTO cartas (nombre, ...) VALUES
('Desayunos Mexicanos', ...)  -- ✅ ID automático con gen_random_uuid()

INSERT INTO platos (nombre, ..., carta_id) VALUES
('Huevos Rancheros', ..., (SELECT id FROM cartas WHERE nombre = 'Desayunos Mexicanos'))  -- ✅ Referencia por nombre
```

## 🎉 **RESULTADO ESPERADO:**

**✅ ANTES (Error):**
- Error UUID al ejecutar el script
- Menú vacío en la aplicación
- No se insertan datos

**✅ DESPUÉS (Corregido):**
- **Script ejecuta sin errores**
- **6 cartas** creadas correctamente
- **55+ platos** insertados exitosamente
- **Menú lleno** en la aplicación
- **Precios realistas** en pesos mexicanos

## 🚨 **NOTAS IMPORTANTES:**

1. **Usa el script corregido:** `database/insertar_menus_corregido.sql`
2. **No uses el script original:** `database/insertar_menus_simple.sql` (tiene error)
3. **IDs automáticos:** Las cartas usan `gen_random_uuid()` automáticamente
4. **Referencias por nombre:** Los platos buscan cartas por nombre
5. **Sin conflictos:** No usa `ON CONFLICT` que causaba problemas

## ✅ **VERIFICACIÓN FINAL:**

Después de ejecutar el script corregido, verifica que:

1. ✅ **6 cartas** se crearon correctamente
2. ✅ **55+ platos** se insertaron sin errores
3. ✅ **Horarios** están configurados correctamente
4. ✅ **Precios** están en formato decimal
5. ✅ **Categorías** están asignadas
6. ✅ **Menú del cliente** se llena automáticamente

---

**¡Usa el script corregido y disfruta de los menús mexicanos completos!** 🇲🇽🍽️
