# La Chinga - Sistema de Gestión de Restaurante

Un sistema completo de gestión para restaurantes desarrollado con React, Vite y Tailwind CSS. Incluye gestión de mesas, pedidos, reservas, facturación y roles de usuario.

## 🚀 Características

### Roles de Usuario
- **Cliente**: Ver carta, hacer pedidos, reservar mesas, gestionar facturas
- **Mesero**: Gestionar mesas asignadas, procesar pedidos, recibir notificaciones
- **Cajero**: Procesar cobros, generar reportes, gestionar reservas
- **Administrador**: Dashboard completo, gestión de usuarios, mesas y cartas
- **Jefe de Cocina**: Gestionar pedidos de cocina, asignar tareas

### Funcionalidades Principales
- 🍽️ **Gestión de Cartas**: Cartas por horarios (desayuno, almuerzo, drinks, cena)
- 🪑 **Gestión de Mesas**: 24 mesas con estados en tiempo real
- 📋 **Sistema de Pedidos**: Flujo completo desde pedido hasta entrega
- 📅 **Reservas**: Sistema de reservas con políticas de cancelación
- 💰 **Facturación**: Múltiples métodos de pago (efectivo, tarjeta, QR)
- 📊 **Reportes**: Análisis de ventas y rendimiento
- 🔔 **Notificaciones**: Sistema de notificaciones en tiempo real
- 📱 **Responsive**: Diseño móvil-first completamente responsivo

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + CSS Modules
- **Estado**: Zustand + React Query
- **Routing**: React Router v6
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Testing**: Vitest + React Testing Library
- **Mock API**: MSW (Mock Service Worker)
- **Iconos**: Heroicons

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd restaurante-la-chinga
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔐 Credenciales de Prueba

### Cliente
- **Email**: `cliente@test.com`
- **Contraseña**: `cliente123`

### Mesero
- **Email**: `mesero1@lachinga.com`
- **Contraseña**: `mesero123`

### Cajero
- **Email**: `cajero@lachinga.com`
- **Contraseña**: `cajero123`

### Administrador
- **Email**: `admin@lachinga.com`
- **Contraseña**: `admin123`

### Jefe de Cocina
- **Email**: `cocina@lachinga.com`
- **Contraseña**: `cocina123`

## 🎨 Paleta de Colores

- **Rojo Principal**: `#C62828` (acciones primarias)
- **Verde Acento**: `#2E7D32` (confirmaciones, estados OK)
- **Blanco**: `#FFFFFF` (fondos y contraste)
- **Neutros**: Grises para textos y fondos

## 📱 Responsividad

El sistema está diseñado con enfoque móvil-first:
- **Móvil**: < 768px (menú hamburguesa, vistas compactas)
- **Tablet**: 768px - 1024px (layout adaptativo)
- **Desktop**: > 1024px (sidebar fijo, layout amplio)

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con interfaz
npm run test:ui

# Tests en modo watch
npm run test -- --watch
```

## 📦 Build para Producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── NavBar.jsx
│   ├── Sidebar.jsx
│   └── ...
├── layouts/            # Layouts por rol
│   ├── LayoutCliente.jsx
│   ├── LayoutMesero.jsx
│   └── ...
├── pages/              # Páginas por rol
│   ├── cliente/
│   ├── mesero/
│   ├── cajero/
│   ├── admin/
│   └── cocina/
├── stores/             # Estado global (Zustand)
│   ├── authStore.js
│   └── appStore.js
├── data/               # Datos mock
│   └── mockData.js
├── mocks/              # MSW handlers
│   ├── handlers.js
│   └── browser.js
├── hooks/              # Custom hooks
├── utils/              # Utilidades
└── styles/             # Estilos globales
```

## 🔄 Flujo de Datos

1. **Autenticación**: Zustand store para estado de usuario
2. **API Calls**: React Query para caché y sincronización
3. **Estado Local**: Componentes con useState/useReducer
4. **Mock API**: MSW intercepta llamadas HTTP

## 📊 Datos Mock Incluidos

- **24 Mesas** con diferentes estados y ubicaciones
- **8 Meseros** (4 por turno) con mesas asignadas
- **5 Cartas** con platos por horario (mínimo 5 por carta)
- **Reservas** con reglas de cancelación
- **Pedidos** con estados completos
- **Facturas** con diferentes métodos de pago

## 🎯 Funcionalidades por Rol

### Cliente
- ✅ Ver carta según horario actual
- ✅ Cambiar entre cartas (desayuno, almuerzo, drinks, cena)
- ✅ Agregar platos al carrito
- ✅ Seleccionar mesa y enviar pedido
- ✅ Hacer reservas (hasta 7 días antes)
- ✅ Cancelar reservas (80% devolución)
- ✅ Ver estado de mesa asignada
- ✅ Gestionar facturas y pagos

### Mesero
- ✅ Ver mesas asignadas (máximo 6 por mesero)
- ✅ Cambiar estado de mesas (libre, ocupada, con pedido, pendiente pago)
- ✅ Gestionar pedidos de sus mesas
- ✅ Notificar a cocina
- ✅ Recibir notificaciones de clientes
- ✅ Ver detalles de pedidos

### Cajero
- ✅ Procesar cobros de facturas pendientes
- ✅ Múltiples métodos de pago (efectivo, tarjeta, QR)
- ✅ Generar reportes de ventas
- ✅ Ver estadísticas por período
- ✅ Gestionar reservas y cancelaciones
- ✅ Exportar reportes

### Administrador
- ✅ Dashboard con KPIs en tiempo real
- ✅ Gestión completa de usuarios
- ✅ Asignación de mesas a meseros
- ✅ Gestión de cartas y platos
- ✅ Configuración de alertas
- ✅ Vista general de todas las mesas

### Jefe de Cocina
- ✅ Ver cola de pedidos
- ✅ Marcar pedidos como en preparación/listo
- ✅ Asignar órdenes a cocineros
- ✅ Ver tiempos estimados
- ✅ Gestionar flujo de cocina

## 🎨 Micro-animaciones

- Transiciones suaves entre rutas
- Hover effects en botones y tarjetas
- Loading skeletons
- Notificaciones toast
- Drag & drop para mesas
- Animaciones de escala y deslizamiento

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=La Chinga
VITE_APP_VERSION=1.0.0
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run test         # Tests
npm run test:ui      # Tests con UI
```

## 🚀 Despliegue

### Vercel (Recomendado)
El proyecto está configurado para deploy automático en Vercel:

1. **Conecta tu repositorio de GitHub a Vercel**
2. **Vercel detectará automáticamente la configuración**
3. **El deploy se realizará automáticamente en cada push**

**URL del proyecto**: [https://github.com/JuanPablitoxxz/RestauranteLaChinga.git](https://github.com/JuanPablitoxxz/RestauranteLaChinga.git)

#### Deploy manual con Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### Railway
```bash
# Configurado para Railway también
npm run build
npm start
```

### Netlify
```bash
npm run build
# Subir carpeta dist a Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@lachinga.com
- 📱 Teléfono: +57 300 123 4567
- 🌐 Web: https://lachinga.com

## 🎉 Agradecimientos

- Equipo de desarrollo de La Chinga
- Comunidad de React y Vite
- Contribuidores de las librerías utilizadas

---

**Desarrollado con ❤️ para La Chinga Restaurant**
