// Datos de ejemplo para productos
window.productosData = [
    {
        id: 'p1',
        nombre: 'Canasto de bambu',
        descripcion: 'Tamaño pequeño para frutas',
        precio: 170.00,
        imagen: 'https://i.postimg.cc/L4xMFVKv/Canastos-Pavon-Niquinohomo.jpg',
        categoria: 'tejido',
        stock: 15,
        tienda: { id: 't1', nombre: 'Canastos Pavon' },
        calificacion: 4.5,
        reseñas: 28
    },
    {
        id: 'p2',
        nombre: 'Jarrón de barro',
        descripcion: 'Jarrón de barro pintado a mano con motivos florales, ideal para decorar cualquier espacio del hogar.',
        precio: 1100.00,
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
        precio: 550.00,
        imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'juguetes',
        stock: 40,
        tienda: { id: 't3', nombre: 'Juguetes del Pueblo' },
        calificacion: 4.9,
        reseñas: 55
    },
    {
        id: 'p4',
        nombre: 'Silla  Estilo Vikingo',
        descripcion: 'Silla  de madera estilo vikingo, con asiento y respaldo de cuero.',
        precio: 2300.00,
        imagen: 'https://i.postimg.cc/Vk29bXj9/Muebleria-El-Aguila.png',
        categoria: 'madera',
        stock: 8,
        tienda: { id: 't4', nombre: 'Mueblería El Águila' },
        calificacion: 4.7,
        reseñas: 30
    },
    {
        id: 'p5',
        nombre: 'Canasto frutero',
        descripcion: 'Tejido de bambu',
        precio: 110.00,
        imagen: 'https://i.postimg.cc/BbTryx05/O1CN015v5dh-C1REE83Wi3su-65648207.webp',
        categoria: 'tejido',
        stock: 20,
        tienda: { id: 't1', nombre: 'Canastos Pavon' },
        calificacion: 4.6,
        reseñas: 18
    },
    {
        id: 'p6',
        nombre: 'Mesita de sala',
        descripcion: 'Madera de cedro color Miel.',
        precio: 2100.00,
        imagen: 'https://i.postimg.cc/qBG9XvDQ/Muebleria-El-Aguila-mesa.png',
        categoria: 'madera',
        stock: 30,
        tienda: { id: 't4', nombre: 'Mueblería El Águila' },
        calificacion: 4.8,
        reseñas: 25
    },
    {
        id: 'p7',
        nombre: 'Escoba rustica',
        descripcion: 'Hecha de bambu',
        precio: 100.00,
        imagen: 'https://i.postimg.cc/RCw18gk5/long-brown-floor-cleaning-cocon.webp',
        categoria: 'tejido',
        stock: 12,
        tienda: { id: 't1', nombre: 'Canastos Pavon' },
        calificacion: 4.7,
        reseñas: 33
    },
    {
        id: 'p8',
        nombre: 'Plato de barro pintado',
        descripcion: 'Plato decorativo de barro, pintado a mano con la figura de un tucán. No apto para alimentos.',
        precio: 920.00,
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
        nombre: 'Canastos Pavon',
        descripcion: 'Tradición en cada canasto una Artesanía que florece.',
        imagen: 'https://i.postimg.cc/Zntm2stf/logo-tienda-canastos.png',
        foto_perfil: 'https://i.postimg.cc/Zntm2stf/logo-tienda-canastos.png',
        ubicacion: 'Niquinohomo, Masaya',
        direccion: 'Comarca Los Pocitos, Niquinohomo',
        contacto: '+505 8888 5555',
        horarios: 'Lunes a Viernes: 8am - 5pm'
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
        nombre: 'Mueblería El Águila',
        descripcion: 'En Mueblería El Águila cuidamos cada detalle en la elaboración de los muebles de tu preferencia.',
        imagen: 'https://i.postimg.cc/zBccLyGL/338005333-740146800927449-669123.webp',
        foto_perfil: 'https://i.postimg.cc/zBccLyGL/338005333-740146800927449-669123.webp',
        ubicacion: 'Masaya, Nicaragua',
        direccion: 'Km 53 1/2 Carretera Niquinohomo, Masatepe',
        contacto: '+505 8336 8339',
        horarios: 'Lunes a Viernes: 8am - 5pm',
        whatsapp: 'https://wa.link/cble6a'
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
