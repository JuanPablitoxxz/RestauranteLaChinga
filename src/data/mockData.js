// Datos mock para el restaurante La Chinga

export const usuariosMock = [
  {
    id: 1,
    email: 'admin@lachinga.com',
    password: 'admin123',
    nombre: 'Administrador',
    rol: 'admin',
    turno: null,
    activo: true,
    fechaCreacion: '2024-01-01'
  },
  {
    id: 2,
    email: 'mesero1@lachinga.com',
    password: 'mesero123',
    nombre: 'Carlos Mendoza',
    rol: 'mesero',
    turno: 'mañana',
    mesasAsignadas: [1, 2, 3, 4, 5, 6],
    activo: true,
    fechaCreacion: '2024-01-02'
  },
  {
    id: 3,
    email: 'mesero2@lachinga.com',
    password: 'mesero123',
    nombre: 'Ana García',
    rol: 'mesero',
    turno: 'tarde',
    mesasAsignadas: [7, 8, 9, 10, 11, 12],
    activo: true,
    fechaCreacion: '2024-01-03'
  },
  {
    id: 4,
    email: 'cajero@lachinga.com',
    password: 'cajero123',
    nombre: 'María López',
    rol: 'cajero',
    turno: null,
    activo: true,
    fechaCreacion: '2024-01-04'
  },
  {
    id: 5,
    email: 'cocina@lachinga.com',
    password: 'cocina123',
    nombre: 'Chef Roberto',
    rol: 'cocina',
    turno: null,
    activo: true,
    fechaCreacion: '2024-01-05'
  },
  {
    id: 6,
    email: 'cliente@test.com',
    password: 'cliente123',
    nombre: 'Cliente Test',
    rol: 'cliente',
    turno: null,
    activo: true,
    fechaCreacion: '2024-01-06'
  }
]

export const mesasMock = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  numero: i + 1,
  capacidad: Math.floor(Math.random() * 4) + 2, // 2-6 personas
  estado: ['libre', 'ocupada', 'con_pedido', 'pendiente_pago'][Math.floor(Math.random() * 4)],
  meseroId: i < 6 ? 2 : i < 12 ? 3 : null,
  clienteId: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : null,
  horaOcupacion: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 3600000) : null,
  ubicacion: i < 8 ? 'interior' : i < 16 ? 'terraza' : 'jardín'
}))

export const cartasMock = {
  desayuno: {
    id: 'desayuno',
    nombre: 'Desayuno',
    horario: '07:00 - 11:00',
    activa: true,
    platos: [
      {
        id: 1,
        nombre: 'Huevos Benedictinos',
        descripcion: 'Huevos pochados sobre muffin inglés con jamón y salsa holandesa',
        precio: 8500,
        imagen: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
        categoria: 'principales',
        tiempoPreparacion: 15,
        disponible: true
      },
      {
        id: 2,
        nombre: 'Pancakes de Avena',
        descripcion: 'Pancakes esponjosos con avena, acompañados de miel y frutas frescas',
        precio: 7200,
        imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        categoria: 'principales',
        tiempoPreparacion: 10,
        disponible: true
      },
      {
        id: 3,
        nombre: 'Tostada Francesa',
        descripcion: 'Pan brioche empapado en huevo y leche, dorado y servido con miel',
        precio: 6800,
        imagen: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
        categoria: 'principales',
        tiempoPreparacion: 12,
        disponible: true
      },
      {
        id: 4,
        nombre: 'Omelette del Chef',
        descripcion: 'Omelette con jamón, queso, champiñones y tomate',
        precio: 7800,
        imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
        categoria: 'principales',
        tiempoPreparacion: 8,
        disponible: true
      },
      {
        id: 5,
        nombre: 'Café Americano',
        descripcion: 'Café negro americano, servido caliente',
        precio: 2500,
        imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        categoria: 'bebidas',
        tiempoPreparacion: 3,
        disponible: true
      }
    ]
  },
  almuerzo: {
    id: 'almuerzo',
    nombre: 'Almuerzo',
    horario: '11:00 - 15:00',
    activa: true,
    platos: [
      {
        id: 6,
        nombre: 'Ceviche de Pescado',
        descripcion: 'Pescado fresco marinado en limón con cebolla morada y cilantro',
        precio: 12000,
        imagen: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
        categoria: 'entradas',
        tiempoPreparacion: 20,
        disponible: true
      },
      {
        id: 7,
        nombre: 'Lomo Saltado',
        descripcion: 'Lomo de res salteado con cebolla, tomate y papas fritas',
        precio: 15000,
        imagen: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        categoria: 'principales',
        tiempoPreparacion: 25,
        disponible: true
      },
      {
        id: 8,
        nombre: 'Arroz con Pollo',
        descripcion: 'Arroz amarillo con pollo, verduras y especias',
        precio: 11000,
        imagen: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        categoria: 'principales',
        tiempoPreparacion: 30,
        disponible: true
      },
      {
        id: 9,
        nombre: 'Ensalada César',
        descripcion: 'Lechuga romana, crutones, parmesano y aderezo césar',
        precio: 8500,
        imagen: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        categoria: 'ensaladas',
        tiempoPreparacion: 10,
        disponible: true
      },
      {
        id: 10,
        nombre: 'Jugo de Naranja',
        descripcion: 'Jugo natural de naranja recién exprimido',
        precio: 3500,
        imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        categoria: 'bebidas',
        tiempoPreparacion: 5,
        disponible: true
      }
    ]
  },
  drinks_manana: {
    id: 'drinks_manana',
    nombre: 'Drinks Mañana',
    horario: '11:00 - 15:00',
    activa: true,
    platos: [
      {
        id: 11,
        nombre: 'Mojito Clásico',
        descripcion: 'Ron blanco, menta, lima, azúcar y soda',
        precio: 12000,
        imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
        categoria: 'cocteles',
        tiempoPreparacion: 8,
        disponible: true
      },
      {
        id: 12,
        nombre: 'Piña Colada',
        descripcion: 'Ron, crema de coco y jugo de piña',
        precio: 13000,
        imagen: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        categoria: 'cocteles',
        tiempoPreparacion: 10,
        disponible: true
      },
      {
        id: 13,
        nombre: 'Cerveza Nacional',
        descripcion: 'Cerveza fría de barril',
        precio: 4500,
        imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        categoria: 'cervezas',
        tiempoPreparacion: 2,
        disponible: true
      },
      {
        id: 14,
        nombre: 'Vino Tinto Casa',
        descripcion: 'Vino tinto de la casa, copa',
        precio: 8000,
        imagen: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
        categoria: 'vinos',
        tiempoPreparacion: 3,
        disponible: true
      },
      {
        id: 15,
        nombre: 'Agua con Gas',
        descripcion: 'Agua mineral con gas, botella',
        precio: 3000,
        imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
        categoria: 'bebidas',
        tiempoPreparacion: 1,
        disponible: true
      }
    ]
  },
  drinks_tarde: {
    id: 'drinks_tarde',
    nombre: 'Drinks Tarde',
    horario: '15:00 - 19:00',
    activa: true,
    platos: [
      {
        id: 16,
        nombre: 'Margarita',
        descripcion: 'Tequila, triple sec y jugo de lima con sal en el borde',
        precio: 14000,
        imagen: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        categoria: 'cocteles',
        tiempoPreparacion: 8,
        disponible: true
      },
      {
        id: 17,
        nombre: 'Caipirinha',
        descripcion: 'Cachaça, lima y azúcar',
        precio: 11000,
        imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
        categoria: 'cocteles',
        tiempoPreparacion: 6,
        disponible: true
      },
      {
        id: 18,
        nombre: 'Cerveza Importada',
        descripcion: 'Cerveza importada fría',
        precio: 6500,
        imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        categoria: 'cervezas',
        tiempoPreparacion: 2,
        disponible: true
      },
      {
        id: 19,
        nombre: 'Vino Blanco',
        descripcion: 'Vino blanco de la casa, copa',
        precio: 8000,
        imagen: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
        categoria: 'vinos',
        tiempoPreparacion: 3,
        disponible: true
      },
      {
        id: 20,
        nombre: 'Refresco',
        descripcion: 'Refresco de cola, naranja o limón',
        precio: 2500,
        imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
        categoria: 'bebidas',
        tiempoPreparacion: 1,
        disponible: true
      }
    ]
  },
  cena: {
    id: 'cena',
    nombre: 'Cena',
    horario: '19:00 - 23:00',
    activa: true,
    platos: [
      {
        id: 21,
        nombre: 'Carpaccio de Res',
        descripcion: 'Láminas finas de res con rúcula, parmesano y aceite de oliva',
        precio: 18000,
        imagen: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        categoria: 'entradas',
        tiempoPreparacion: 15,
        disponible: true
      },
      {
        id: 22,
        nombre: 'Salmón a la Plancha',
        descripcion: 'Salmón fresco con vegetales asados y salsa de hierbas',
        precio: 22000,
        imagen: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
        categoria: 'principales',
        tiempoPreparacion: 25,
        disponible: true
      },
      {
        id: 23,
        nombre: 'Pasta Carbonara',
        descripcion: 'Pasta con panceta, huevo, parmesano y pimienta negra',
        precio: 16000,
        imagen: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        categoria: 'principales',
        tiempoPreparacion: 20,
        disponible: true
      },
      {
        id: 24,
        nombre: 'Tiramisú',
        descripcion: 'Postre italiano con café, mascarpone y cacao',
        precio: 8500,
        imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        categoria: 'postres',
        tiempoPreparacion: 5,
        disponible: true
      },
      {
        id: 25,
        nombre: 'Café Espresso',
        descripcion: 'Café espresso italiano',
        precio: 3000,
        imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        categoria: 'bebidas',
        tiempoPreparacion: 3,
        disponible: true
      }
    ]
  }
}

export const reservasMock = [
  {
    id: 1,
    clienteId: 6,
    clienteNombre: 'Cliente Test',
    clienteEmail: 'cliente@test.com',
    clienteTelefono: '+57 300 123 4567',
    mesaId: 5,
    fecha: '2024-01-15',
    hora: '19:30',
    cantidadPersonas: 4,
    estado: 'confirmada',
    observaciones: 'Mesa cerca de la ventana',
    fechaCreacion: '2024-01-10T10:00:00Z',
    fechaModificacion: '2024-01-10T10:00:00Z'
  },
  {
    id: 2,
    clienteId: 7,
    clienteNombre: 'María González',
    clienteEmail: 'maria@email.com',
    clienteTelefono: '+57 300 987 6543',
    mesaId: 12,
    fecha: '2024-01-16',
    hora: '20:00',
    cantidadPersonas: 2,
    estado: 'pendiente',
    observaciones: '',
    fechaCreacion: '2024-01-11T14:30:00Z',
    fechaModificacion: '2024-01-11T14:30:00Z'
  }
]

export const pedidosMock = [
  {
    id: 1,
    mesaId: 5,
    clienteId: 6,
    meseroId: 2,
    items: [
      { platoId: 21, nombre: 'Carpaccio de Res', cantidad: 1, precio: 18000 },
      { platoId: 22, nombre: 'Salmón a la Plancha', cantidad: 2, precio: 22000 },
      { platoId: 25, nombre: 'Café Espresso', cantidad: 2, precio: 3000 }
    ],
    subtotal: 68000,
    propina: 6800,
    total: 74800,
    estado: 'en_preparacion',
    observaciones: 'Salmón bien cocido',
    fechaCreacion: '2024-01-15T19:35:00Z',
    fechaModificacion: '2024-01-15T19:35:00Z',
    tiempoEstimado: 25
  }
]

export const facturasMock = [
  {
    id: 1,
    pedidoId: 1,
    mesaId: 5,
    clienteId: 6,
    meseroId: 2,
    cajeroId: 4,
    subtotal: 68000,
    propina: 6800,
    total: 74800,
    metodoPago: 'efectivo',
    estado: 'pagada',
    fechaCreacion: '2024-01-15T21:00:00Z',
    fechaPago: '2024-01-15T21:05:00Z'
  }
]

// Función para obtener la carta actual según la hora
export const obtenerCartaActual = () => {
  const hora = new Date().getHours()
  
  if (hora >= 7 && hora < 11) {
    return cartasMock.desayuno
  } else if (hora >= 11 && hora < 15) {
    return cartasMock.almuerzo
  } else if (hora >= 15 && hora < 19) {
    return cartasMock.drinks_tarde
  } else if (hora >= 19 && hora < 23) {
    return cartasMock.cena
  } else {
    return cartasMock.drinks_manana // Horario de cierre
  }
}

// Función para obtener el turno actual
export const obtenerTurnoActual = () => {
  const hora = new Date().getHours()
  return hora >= 7 && hora < 15 ? 'mañana' : 'tarde'
}
