// Datos de ejemplo para productos
window.productosData = [
    {
        id: 'p1',
        nombre: 'Hamaca de colores',
        descripcion: 'Hamaca tejida a mano con hilos de colores vivos, perfecta para descansar en el jardín o la playa.',
        precio: 45.99,
        imagen: 'https://images.unsplash.com/photo-1556909114-44e2aed3f589?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'tejido',
        stock: 15,
        tienda: { id: 't1', nombre: 'Artesanías Nica' },
        calificacion: 4.5,
        reseñas: 28
    },
    {
        id: 'p2',
        nombre: 'Jarrón de barro',
        descripcion: 'Jarrón de barro pintado a mano con motivos florales, ideal para decorar cualquier espacio del hogar.',
        precio: 29.99,
        imagen: 'https://images.unsplash.com/photo-1578899805908-a3951f4c7512?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'barro',
        stock: 25,
        tienda: { id: 't2', nombre: 'Cerámicas del Sol' },
        calificacion: 4.8,
        reseñas: 42
    },
    {
        id: 'p3',
        nombre: 'Trompo de madera',
        descripcion: 'Trompo de madera tradicional, tallado y pintado a mano. Un juguete clásico para todas las edades.',
        precio: 15.00,
        imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'juguetes',
        stock: 40,
        tienda: { id: 't3', nombre: 'Juguetes del Pueblo' },
        calificacion: 4.9,
        reseñas: 55
    },
    {
        id: 'p4',
        nombre: 'Silla de madera y cuero',
        descripcion: 'Silla robusta hecha con madera de cedro y asiento de cuero genuino, un toque rústico para tu sala.',
        precio: 120.00,
        imagen: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'madera',
        stock: 8,
        tienda: { id: 't4', nombre: 'Muebles El Artesano' },
        calificacion: 4.7,
        reseñas: 30
    },
    {
        id: 'p5',
        nombre: 'Máscara de madera',
        descripcion: 'Máscara de madera tallada a mano, inspirada en el folclore local. Perfecta para colgar en la pared.',
        precio: 35.50,
        imagen: 'https://images.unsplash.com/photo-1541480601026-db84a82a17a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'madera',
        stock: 20,
        tienda: { id: 't1', nombre: 'Artesanías Nica' },
        calificacion: 4.6,
        reseñas: 18
    },
    {
        id: 'p6',
        nombre: 'Caja de madera tallada',
        descripcion: 'Pequeña caja de madera con tapa, tallada con diseños geométricos. Ideal para guardar joyas o secretos.',
        precio: 22.00,
        imagen: 'https://images.unsplash.com/photo-1588622612984-3a5b672a91a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'madera',
        stock: 30,
        tienda: { id: 't4', nombre: 'Muebles El Artesano' },
        calificacion: 4.8,
        reseñas: 25
    },
    {
        id: 'p7',
        nombre: 'Bolso de tela bordado',
        descripcion: 'Bolso de tela resistente con bordados florales hechos a mano. Espacioso y con cierre.',
        precio: 39.99,
        imagen: 'https://images.unsplash.com/photo-1584917865415-38521a0862a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'tela',
        stock: 12,
        tienda: { id: 't1', nombre: 'Artesanías Nica' },
        calificacion: 4.7,
        reseñas: 33
    },
    {
        id: 'p8',
        nombre: 'Plato de barro pintado',
        descripcion: 'Plato decorativo de barro, pintado a mano con la figura de un tucán. No apto para alimentos.',
        precio: 25.00,
        imagen: 'https://images.unsplash.com/photo-1605898342415-b51e6268c173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'barro',
        stock: 18,
        tienda: { id: 't2', nombre: 'Cerámicas del Sol' },
        calificacion: 4.9,
        reseñas: 38
    }
];

// Datos de ejemplo para tiendas
window.tiendasData = [
    {
        id: 't1',
        nombre: 'Artesanías Nica',
        descripcion: 'Especialistas en artesanías tradicionales de Niquinohomo, ofrecemos productos de alta calidad y diseños únicos.',
        imagen: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        foto_perfil: 'https://images.unsplash.com/photo-1555529933-7e6de73405c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        direccion: 'Del parque central, 2 cuadras al sur.',
        contacto: '+505 8888 1111',
        horarios: 'Lunes a Sábado: 9am - 5pm'
    },
    {
        id: 't2',
        nombre: 'Cerámicas del Sol',
        descripcion: 'Creamos piezas de cerámica únicas, pintadas a mano por artistas locales. Tradición y arte en cada jarrón.',
        imagen: 'https://images.unsplash.com/photo-1565551842819-0b32966c986c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        foto_perfil: 'https://images.unsplash.com/photo-1528965851608-54ef0a4a8244?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        ubicacion: 'Catarina, Masaya',
        direccion: 'Mirador de Catarina, Módulo #3.',
        contacto: '+505 8888 2222',
        horarios: 'Lunes a Domingo: 10am - 6pm'
    },
    {
        id: 't3',
        nombre: 'Juguetes del Pueblo',
        descripcion: 'Creamos juguetes de madera únicos, tallados y pintados a mano por artistas locales. Tradición y diversión en cada pieza.',
        imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        foto_perfil: 'https://images.unsplash.com/photo-1596422846932-a13b4c10c144?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        ubicacion: 'Masatepe, Masaya',
        direccion: 'Frente a la iglesia San Juan Bautista.',
        contacto: '+505 8888 3333',
        horarios: 'Martes a Domingo: 10am - 7pm'
    },
    {
        id: 't4',
        nombre: 'Muebles El Artesano',
        descripcion: 'Muebles de madera sólida, construidos para durar toda la vida con técnicas tradicionales.',
        imagen: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        foto_perfil: 'https://images.unsplash.com/photo-1593113646772-2d8c39c87932?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        ubicacion: 'Pueblos Blancos, Masaya',
        direccion: 'Carretera a Masaya, Km 35.',
        contacto: '+505 8888 4444',
        horarios: 'Lunes a Viernes: 8am - 5pm'
    }
];

// DATOS DE USUARIOS INICIALES
window.usersData = [
    {
        id: 'user_comprador_1',
        nombre: 'Juan Comprador',
        email: 'comprador@correo.com',
        password: 'comprador123',
        fechaRegistro: '2023-01-15T10:00:00Z',
        favoritos: ['p1', 'p3'],
        carrito: [],
        historialCompras: []
    }
];

// Categorías para el filtrado
window.categoriasData = [
    { id: 'barro', nombre: 'Barro', icono: 'fas fa-palette' },
    { id: 'tela', nombre: 'Tela', icono: 'fas fa-shirt' },
    { id: 'madera', nombre: 'Madera', icono: 'fas fa-tree' },
    { id: 'tejido', nombre: 'Tejido', icono: 'fas fa-yarn' },
    { id: 'juguetes', nombre: 'Juguetes', icono: 'fas fa-puzzle-piece' }
];
