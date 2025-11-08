// Datos de ejemplo para productos
window.productosData = [
    {
        id: 'p1',
        nombre: 'Hamaca de colores',
        descripcion: 'Hamaca tejida a mano con hilos de colores vivos, perfecta para descansar en el jardín o la playa.',
        precio: 45.99,
        imagen: 'https://images.unsplash.com/photo-1556909114-44e2aed3f589?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'textiles',
        stock: 15,
        tienda: {
            id: 't1',
            nombre: 'Artesanías Nica'
        },
        calificacion: 4.5,
        reseñas: 28
    },
    {
        id: 'p2',
        nombre: 'Jarrón de barro',
        descripcion: 'Jarrón de barro cocido con diseños tradicionales, ideal para decoración de interiores.',
        precio: 32.50,
        imagen: 'https://images.unsplash.com/photo-1583524505974-6facd53f4593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'ceramica',
        stock: 10,
        tienda: {
            id: 't2',
            nombre: 'Barro y Tradición'
        },
        calificacion: 4.8,
        reseñas: 42
    },
    {
        id: 'p3',
        nombre: 'Pulsera de semillas',
        descripcion: 'Pulsera artesanal hecha con semillas naturales y cuentas de colores, ajustable.',
        precio: 12.99,
        imagen: 'https://images.unsplash.com/photo-1602173577009-8d7d7fdcf9bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'joyeria',
        stock: 25,
        tienda: {
            id: 't3',
            nombre: 'Arte Nativo'
        },
        calificacion: 4.7,
        reseñas: 35
    },
    {
        id: 'p4',
        nombre: 'Mesa de madera rústica',
        descripcion: 'Mesa de centro hecha a mano con madera de pino, acabado rústico y natural.',
        precio: 189.99,
        imagen: 'https://images.unsplash.com/photo-1533090161767-a6bede912b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'muebles',
        stock: 5,
        tienda: {
            id: 't4',
            nombre: 'Maderas del Sur'
        },
        calificacion: 4.9,
        reseñas: 18
    },
    {
        id: 'p5',
        nombre: 'Máscara de madera tallada',
        descripcion: 'Máscara tradicional tallada a mano en madera de cedro, pintada a mano con tintes naturales.',
        precio: 28.75,
        imagen: 'https://images.unsplash.com/photo-1595475203958-910f4c5d0e5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'decoracion',
        stock: 12,
        tienda: {
            id: 't1',
            nombre: 'Artesanías Nica'
        },
        calificacion: 4.6,
        reseñas: 31
    },
    {
        id: 'p6',
        nombre: 'Juego de tazas de barro',
        descripcion: 'Juego de 4 tazas de barro cocido con diseño tradicional, ideales para café o chocolate caliente.',
        precio: 38.50,
        imagen: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'ceramica',
        stock: 8,
        tienda: {
            id: 't2',
            nombre: 'Barro y Tradición'
        },
        calificacion: 4.4,
        reseñas: 22
    },
    {
        id: 'p7',
        nombre: 'Cartera de cuero',
        descripcion: 'Cartera de cuero genuino con detalles grabados a mano, múltiples compartimientos.',
        precio: 55.25,
        imagen: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'accesorios',
        stock: 7,
        tienda: {
            id: 't5',
            nombre: 'Cuero Artesanal'
        },
        calificacion: 4.9,
        reseñas: 47
    },
    {
        id: 'p8',
        nombre: 'Atrapasueños',
        descripcion: 'Atrapasueños tejido a mano con hilos de colores, plumas y cuentas de madera.',
        precio: 22.99,
        imagen: 'https://images.unsplash.com/photo-1584270354945-01b5e0e1a6a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        categoria: 'decoracion',
        stock: 14,
        tienda: {
            id: 't3',
            nombre: 'Arte Nativo'
        },
        calificacion: 4.7,
        reseñas: 29
    }
];

// Datos de ejemplo para tiendas
window.tiendasData = [
    {
        id: 't1',
        nombre: 'Artesanías Nica',
        descripcion: 'Especialistas en artesanías tradicionales de Niquinohomo, ofreciendo productos hechos a mano con técnicas ancestrales.',
        imagen: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        calificacion: 4.5,
        resenas: 28,
        productos: ['p1', 'p5'],
        horario: 'Lunes a Sábado: 9:00 AM - 6:00 PM',
        telefono: '+505 8888 7777',
        correo: 'artesaniasnica@example.com'
    },
    {
        id: 't2',
        nombre: 'Barro y Tradición',
        descripcion: 'Expertos en cerámica tradicional, creando piezas únicas que mantienen viva la herencia cultural de nuestra región.',
        imagen: 'https://images.unsplash.com/photo-1587351029978-35bfdc8cad3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        calificacion: 4.8,
        resenas: 42,
        productos: ['p2', 'p6'],
        horario: 'Martes a Domingo: 8:00 AM - 5:00 PM',
        telefono: '+505 8888 6666',
        correo: 'barroytradicion@example.com'
    },
    {
        id: 't3',
        nombre: 'Arte Nativo',
        descripcion: 'Artesanías que representan la riqueza cultural de Nicaragua, con énfasis en joyería y decoración étnica.',
        imagen: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        calificacion: 4.7,
        resenas: 35,
        productos: ['p3', 'p8'],
        horario: 'Miércoles a Lunes: 10:00 AM - 7:00 PM',
        telefono: '+505 8888 5555',
        correo: 'artenativo@example.com'
    },
    {
        id: 't4',
        nombre: 'Maderas del Sur',
        descripcion: 'Especialistas en muebles y tallados en madera, creando piezas únicas con madera de la región.',
        imagen: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        calificacion: 4.9,
        resenas: 18,
        productos: ['p4'],
        horario: 'Lunes a Viernes: 8:30 AM - 5:30 PM',
        telefono: '+505 8888 4444',
        correo: 'maderasdelsur@example.com'
    },
    {
        id: 't5',
        nombre: 'Cuero Artesanal',
        descripcion: 'Productos de cuero de la más alta calidad, elaborados a mano con técnicas tradicionales.',
        imagen: 'https://images.unsplash.com/photo-1548036328-c8fa833d4c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ubicacion: 'Niquinohomo, Masaya',
        calificacion: 4.9,
        resenas: 47,
        productos: ['p7'],
        horario: 'Lunes a Sábado: 9:00 AM - 6:30 PM',
        telefono: '+505 8888 3333',
        correo: 'cueroartesanal@example.com'
    }
];

// Categorías para el filtrado
window.categoriasData = [
    { id: 'textiles', nombre: 'Textiles', icono: 'tshirt' },
    { id: 'ceramica', nombre: 'Cerámica', icono: 'mug-hot' },
    { id: 'joyeria', nombre: 'Joyería', icono: 'ring' },
    { id: 'muebles', nombre: 'Muebles', icono: 'couch' },
    { id: 'decoracion', nombre: 'Decoración', icono: 'home' },
    { id: 'accesorios', nombre: 'Accesorios', icono: 'scarf' },
    { id: 'regalos', nombre: 'Regalos', icono: 'gift' },
    { id: 'otros', nombre: 'Otros', icono: 'ellipsis-h' }
];
