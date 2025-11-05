// Datos compartidos de tiendas para reutilizar en múltiples páginas
(function () {
    window.artesanicaStores = [
        {
            id: '1',
            name: 'Textiles Niquinohomo',
            description: 'Especialistas en tejidos tradicionales y hamacas artesanales',
            owner: 'María González',
            rating: 4.8,
            products: ['1', '3'],
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            category: 'textiles',
            location: 'Centro de Niquinohomo',
            joined: '2023-01-15',
            featured: true
        },
        {
            id: '2',
            name: 'Delicias Tradicionales',
            description: 'Comida típica nicaragüense preparada con ingredientes locales',
            owner: 'Carlos Ruiz',
            rating: 4.9,
            products: ['2', '8'],
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            category: 'comida',
            location: 'Mercado Municipal',
            joined: '2023-02-20',
            featured: true
        },
        {
            id: '3',
            name: 'Café de la Montaña',
            description: 'Café orgánico cultivado en las laderas del volcán',
            owner: 'Ana Martínez',
            rating: 4.7,
            products: ['4'],
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            category: 'comida',
            location: 'Sierra de Niquinohomo',
            joined: '2023-03-10',
            featured: false
        },
        {
            id: '4',
            name: 'Artesanías en Barro',
            description: 'Alfarería tradicional con técnicas ancestrales',
            owner: 'José Pérez',
            rating: 4.5,
            products: ['5', '7'],
            image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            category: 'artesanias',
            location: 'Barrio El Calvario',
            joined: '2023-01-08',
            featured: true
        },
        {
            id: '5',
            name: 'Taller de Madera',
            description: 'Trabajos en madera tallada con diseños autóctonos',
            owner: 'Roberto Silva',
            rating: 4.8,
            products: ['6'],
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            category: 'madera',
            location: 'Calle Central',
            joined: '2023-04-05',
            featured: false
        }
    ];
})();
