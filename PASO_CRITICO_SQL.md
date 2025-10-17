# 🚨 PASO CRÍTICO - EJECUTAR SCRIPT SQL EN SUPABASE

## ❌ **PROBLEMA ACTUAL:**
- La página del cliente se queda en blanco
- No hay datos de menús en Supabase
- El sistema está conectado pero sin datos

## ✅ **SOLUCIÓN:**

### **PASO 1: Acceder a Supabase**
1. **Ve a tu proyecto de Supabase:**
   - URL: `https://supabase.com/dashboard/project/lachinga-restaurante`
   - O busca "lachinga-restaurante" en tu dashboard

2. **Navega a SQL Editor:**
   - En el menú lateral izquierdo
   - Haz clic en **"SQL Editor"**
   - Haz clic en **"New query"**

### **PASO 2: Ejecutar el Script Corregido**
1. **Copia TODO el contenido** del archivo `database/insertar_menus_corregido.sql`
2. **Pega en el editor SQL** de Supabase
3. **Haz clic en "Run"** (botón verde)
4. **Verifica que no haya errores** en la consola

### **PASO 3: Verificar que Funcionó**
Ejecuta esta consulta para verificar:

```sql
-- Verificar cartas creadas
SELECT COUNT(*) as total_cartas FROM cartas;

-- Verificar platos creados
SELECT COUNT(*) as total_platos FROM platos;

-- Ver todas las cartas
SELECT nombre, horario_inicio, horario_fin FROM cartas ORDER BY horario_inicio;

-- Ver algunos platos
SELECT nombre, precio, categoria FROM platos LIMIT 10;
```

**Resultado esperado:**
- `total_cartas`: 6
- `total_platos`: 55+
- Deberías ver las cartas: Desayunos Mexicanos, Almuerzos Tradicionales, etc.

## 🎯 **DESPUÉS DE EJECUTAR EL SCRIPT:**

### **✅ La página del cliente debería mostrar:**
- **Platos mexicanos reales** de la base de datos
- **Menú dinámico** según la hora actual
- **Precios en pesos mexicanos**
- **Categorías organizadas**

### **🔍 Para verificar que funciona:**
1. **Refresca la página** del cliente
2. **Abre la consola** del navegador (F12)
3. **Busca estos logs:**
   - `🔍 usePlatosSimple - Obteniendo platos de Supabase...`
   - `✅ Platos obtenidos de Supabase: 55+`
   - `🍽️ Carta - Usando Supabase: true`

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

## 🚨 **SI SIGUE EN BLANCO DESPUÉS DEL SCRIPT:**

### **Verifica la consola del navegador:**
1. **Abre F12** (DevTools)
2. **Ve a la pestaña Console**
3. **Busca errores** en rojo
4. **Comparte los errores** para diagnosticar

### **Verifica la conexión a Supabase:**
1. **Ve a la pestaña Network** en DevTools
2. **Refresca la página**
3. **Busca llamadas a Supabase** (deberían aparecer)
4. **Verifica que no haya errores 401/403**

## 🎉 **RESULTADO FINAL:**

**Después de ejecutar el script SQL:**
- ✅ **Página del cliente funcional** con menús reales
- ✅ **55+ platos mexicanos** auténticos
- ✅ **Precios realistas** en pesos mexicanos
- ✅ **Sistema completamente operativo**

---

**¡Este es el paso crítico que falta! Ejecuta el script SQL y la página funcionará perfectamente.** 🚀🇲🇽
