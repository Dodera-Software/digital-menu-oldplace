// Mock data for testing UI without Supabase

export const mockCategories = [
    { id: 1, name: 'Coffee' },
    { id: 2, name: 'Tea' },
    { id: 3, name: 'Hot Chocolate' },
    { id: 4, name: 'Soft drinks' },
    { id: 5, name: 'Freshly made' },
    { id: 6, name: 'Beer' },
    { id: 7, name: 'Wine' },
    { id: 8, name: 'Spirits' },
    { id: 9, name: 'Shots' },
    { id: 10, name: 'Long drinks' },
    { id: 11, name: 'Snacks' },
];

export const mockMenuItems = [
    // ── Coffee ──────────────────────────────────────────────────────────
    { id: 1, name: 'Espresso', price: '5.5', description: '20ml', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 2, name: 'Espresso dublu cu lapte', price: '11.5', description: 'Double espresso with milk', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 3, name: 'Ristretto', price: '5.5', description: '20ml, concentrated espresso', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 4, name: 'Espresso dublu', price: '11', description: '40ml', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 5, name: 'Americano', price: '6', description: 'Espresso, hot water', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 6, name: 'Cappucino', price: '7', description: 'Espresso, steamed milk, milk foam', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 7, name: 'Cappucino vienez', price: '7', description: 'Espresso, whipped cream', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 8, name: 'Cafe Latte', price: '8', description: 'Espresso, steamed milk', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 9, name: 'Ice Coffee', price: '8', description: 'Cold espresso, milk, ice', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 10, name: 'Moccacino', price: '9', description: 'Espresso, chocolate, steamed milk', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 11, name: 'Frappe', price: '9', description: 'Iced blended coffee', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 12, name: 'Irish Coffee', price: '11', description: 'Espresso, Irish whiskey, whipped cream', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },
    { id: 13, name: '+ Arome extra', price: '1', description: 'Pumpkin spice, vanilie, cookie chocolate', category: 'Coffee', subcategory: null, categories: { name: 'Coffee' } },

    // ── Tea ──────────────────────────────────────────────────────────────
    { id: 14, name: 'Ceai verde', price: '8', description: 'Le touareg · Passion fruit', category: 'Tea', subcategory: null, categories: { name: 'Tea' } },
    { id: 15, name: 'Ceai fructe', price: '8', description: 'Wild berry · Rum cream', category: 'Tea', subcategory: null, categories: { name: 'Tea' } },
    { id: 16, name: 'Ceai rosu', price: '8', description: 'Fire side', category: 'Tea', subcategory: null, categories: { name: 'Tea' } },
    { id: 17, name: 'Ceai negru', price: '8', description: 'Copa cabana', category: 'Tea', subcategory: null, categories: { name: 'Tea' } },

    // ── Hot Chocolate ────────────────────────────────────────────────────
    { id: 18, name: 'Ciocolata neagra', price: '8', description: 'Dark chocolate · + topping optional', category: 'Hot Chocolate', subcategory: null, categories: { name: 'Hot Chocolate' } },
    { id: 19, name: 'Ciocolata alba', price: '8', description: 'White chocolate · + topping optional', category: 'Hot Chocolate', subcategory: null, categories: { name: 'Hot Chocolate' } },

    // ── Soft drinks ──────────────────────────────────────────────────────
    { id: 20, name: 'Pepsi', price: '8', description: '330ml / 500ml · diverse sortimente', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 21, name: 'Mirinda', price: '8', description: '330ml / 500ml · diverse sortimente', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 22, name: 'Lipton', price: '8', description: '330ml / 500ml · diverse sortimente', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 23, name: 'Prigat', price: '8', description: '330ml / 500ml · diverse sortimente', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 24, name: '7up', price: '8', description: '330ml / 500ml', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 25, name: 'MountainDew', price: '8', description: '330ml / 500ml', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 26, name: 'Apa plata / carbogazoasa', price: '6', description: '', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 27, name: 'Evervess tonic', price: '7', description: '250ml', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 28, name: 'Mellow', price: '13', description: 'Apple, orange, mango', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 29, name: 'Fritz kola', price: '13', description: '', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 30, name: 'Red Bull', price: '10', description: '250ml', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },
    { id: 31, name: 'Rockstar', price: '10', description: '250ml', category: 'Soft drinks', subcategory: null, categories: { name: 'Soft drinks' } },

    // ── Freshly made ─────────────────────────────────────────────────────
    { id: 32, name: 'Limonada', price: '10', description: 'Lamaie, portocale, papaya, fructe de padure, fruct de cactus, pepne galben · 400ml', category: 'Freshly made', subcategory: null, categories: { name: 'Freshly made' } },
    { id: 33, name: 'Milkshake', price: '10', description: 'Ciocolata, vanilie · 300ml', category: 'Freshly made', subcategory: null, categories: { name: 'Freshly made' } },
    { id: 34, name: 'Smoothie', price: '10', description: 'Papaya, fructe de padure, fruct de cactus, pepne galben · 300ml', category: 'Freshly made', subcategory: null, categories: { name: 'Freshly made' } },

    // ── Beer ─────────────────────────────────────────────────────────────
    { id: 35, name: 'Staropramen', price: '7', description: 'Sticla / halba · 500ml / 400ml · 5% alc.', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 36, name: 'Becks', price: '7.5', description: '500ml / 300ml · 5% alc.', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 37, name: 'Stella Artois', price: '10', description: '330ml · 4.40% alc.', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 38, name: 'Corona', price: '13', description: '330ml · 4.5% alc.', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 39, name: 'Sommersby', price: '10', description: 'Mure, afine, mere · 330ml · 4.5% alc.', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 40, name: 'Bergenbier 0%', price: '8', description: 'Fara alcool', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 41, name: 'Bergenbier fresh', price: '8', description: '', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },
    { id: 42, name: 'Fresh', price: '8', description: '', category: 'Beer', subcategory: null, categories: { name: 'Beer' } },

    // ── Wine ─────────────────────────────────────────────────────────────
    { id: 43, name: 'Bravoure Alb Sec', price: '75', description: '13% alc. · 750ml', category: 'Wine', subcategory: 'Crama Chateau Cristi', categories: { name: 'Wine' } },
    { id: 44, name: 'Bravoure Rosu Sec', price: '75', description: '13.5% alc. · 750ml', category: 'Wine', subcategory: 'Crama Chateau Cristi', categories: { name: 'Wine' } },
    { id: 45, name: 'Metamorfosis Alb Sec', price: '50', description: '13% alc. · 750ml', category: 'Wine', subcategory: "Crama Dealu' Mare", categories: { name: 'Wine' } },
    { id: 46, name: 'Metamorfosis Rosu Sec', price: '50', description: '14.5% alc. · 750ml', category: 'Wine', subcategory: "Crama Dealu' Mare", categories: { name: 'Wine' } },
    { id: 47, name: 'Nomad Alb Sec', price: '60', description: '13% alc. · 750ml', category: 'Wine', subcategory: 'Crama Aurelia Visinescu', categories: { name: 'Wine' } },
    { id: 48, name: 'Nomad Rosu Sec', price: '60', description: '14.5% alc. · 750ml', category: 'Wine', subcategory: 'Crama Aurelia Visinescu', categories: { name: 'Wine' } },
    { id: 49, name: 'Frittman Irsai Oliver', price: '50', description: '12% alc. · 750ml', category: 'Wine', subcategory: 'Crama Kunsag', categories: { name: 'Wine' } },
    { id: 50, name: 'Frittman Cserszegi Fuszeres', price: '50', description: '12.5% alc. · 750ml', category: 'Wine', subcategory: 'Crama Kunsag', categories: { name: 'Wine' } },
    { id: 51, name: 'Mosia Alb Demisec', price: '40', description: '12% alc. · 750ml', category: 'Wine', subcategory: 'Crama Tohani', categories: { name: 'Wine' } },
    { id: 52, name: 'Mosia Rosu Demisec', price: '40', description: '13.5% alc. · 750ml', category: 'Wine', subcategory: 'Crama Tohani', categories: { name: 'Wine' } },
    { id: 53, name: 'Mosia Rose Demisec', price: '40', description: '13% alc. · 750ml', category: 'Wine', subcategory: 'Crama Tohani', categories: { name: 'Wine' } },
    { id: 54, name: 'Alb sec', price: '15', description: '12.9% alc. · 500ml', category: 'Wine', subcategory: 'Vin la Carafa', categories: { name: 'Wine' } },
    { id: 55, name: 'Rosu demidulce', price: '15', description: '10.5% alc. · 500ml', category: 'Wine', subcategory: 'Vin la Carafa', categories: { name: 'Wine' } },
    { id: 56, name: 'Rose demidulce', price: '15', description: '10.5% alc. · 500ml', category: 'Wine', subcategory: 'Vin la Carafa', categories: { name: 'Wine' } },
    { id: 57, name: 'Husi Alb Demidulce', price: '40', description: '13% alc. · 750ml', category: 'Wine', subcategory: 'Crama Averesti', categories: { name: 'Wine' } },
    { id: 58, name: 'Husi Rosu Demidulce', price: '40', description: '13.5% alc. · 750ml', category: 'Wine', subcategory: 'Crama Averesti', categories: { name: 'Wine' } },
    { id: 59, name: 'Sprit mic', price: '4', description: '100ml vin + 200ml apa', category: 'Wine', subcategory: 'Sprit', categories: { name: 'Wine' } },
    { id: 60, name: 'Sprit mare', price: '7', description: '200ml vin + 200ml apa', category: 'Wine', subcategory: 'Sprit', categories: { name: 'Wine' } },

    // ── Spirits ───────────────────────────────────────────────────────────
    { id: 61, name: 'Jack Daniels', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 62, name: 'Gentleman Jack', price: '6 / 15', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 63, name: 'Chivas Regal', price: '6 / 15', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 64, name: 'Tullamore', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 65, name: 'Jim Beam', price: '4 / 10', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 66, name: 'J & B', price: '4 / 10', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 67, name: 'Jameson', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 68, name: 'Fireball', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Whiskey', categories: { name: 'Spirits' } },
    { id: 69, name: 'Absolut', price: '4 / 10', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Vodka', categories: { name: 'Spirits' } },
    { id: 70, name: 'Finalndia', price: '4 / 10', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Vodka', categories: { name: 'Spirits' } },
    { id: 71, name: 'Danzka', price: '4 / 10', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Vodka', categories: { name: 'Spirits' } },
    { id: 72, name: 'Stalinskaya', price: '3 / 7.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Vodka', categories: { name: 'Spirits' } },
    { id: 73, name: 'Alexander lemon', price: '3 / 7.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Vodka', categories: { name: 'Spirits' } },
    { id: 74, name: 'Jidvei', price: '10', description: '50ml', category: 'Spirits', subcategory: 'Cognac', categories: { name: 'Spirits' } },
    { id: 75, name: 'Metaxa 5*', price: '10', description: '50ml', category: 'Spirits', subcategory: 'Cognac', categories: { name: 'Spirits' } },
    { id: 76, name: 'Metaxa 7*', price: '12.5', description: '50ml', category: 'Spirits', subcategory: 'Cognac', categories: { name: 'Spirits' } },
    { id: 77, name: 'Alexandrion 5*', price: '7.5', description: '50ml', category: 'Spirits', subcategory: 'Cognac', categories: { name: 'Spirits' } },
    { id: 78, name: 'Courvoisier', price: '15', description: '50ml', category: 'Spirits', subcategory: 'Cognac', categories: { name: 'Spirits' } },
    { id: 79, name: 'Stroh 60', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Rom', categories: { name: 'Spirits' } },
    { id: 80, name: 'Stroh Jagertee', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Rom', categories: { name: 'Spirits' } },
    { id: 81, name: 'Captain Morgan gold spice', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Rom', categories: { name: 'Spirits' } },
    { id: 82, name: 'Captain Morgan black', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Rom', categories: { name: 'Spirits' } },
    { id: 83, name: 'Captain Morgan white', price: '5 / 12.5', description: '20ml / 50ml', category: 'Spirits', subcategory: 'Rom', categories: { name: 'Spirits' } },
    { id: 84, name: 'Unicum', price: '12.5', description: '50ml', category: 'Spirits', subcategory: 'Digestive', categories: { name: 'Spirits' } },
    { id: 85, name: 'Unicum szilva', price: '12.5', description: '50ml', category: 'Spirits', subcategory: 'Digestive', categories: { name: 'Spirits' } },
    { id: 86, name: 'Martini Bianco / Rosso', price: '9', description: '50ml', category: 'Spirits', subcategory: 'Digestive', categories: { name: 'Spirits' } },
    { id: 87, name: 'Jagermeister', price: '12.5', description: '50ml', category: 'Spirits', subcategory: 'Digestive', categories: { name: 'Spirits' } },

    // ── Shots ─────────────────────────────────────────────────────────────
    { id: 88, name: 'Jager', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 89, name: 'Unicum', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 90, name: 'Tequila', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 91, name: 'Tatratea', price: '6', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 92, name: 'Absinth', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 93, name: 'Becherovka', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },
    { id: 94, name: 'Fireball', price: '5', description: '20ml', category: 'Shots', subcategory: null, categories: { name: 'Shots' } },

    // ── Long drinks ───────────────────────────────────────────────────────
    { id: 95, name: 'Gin tonic', price: '18', description: '', category: 'Long drinks', subcategory: null, categories: { name: 'Long drinks' } },
    { id: 96, name: 'Cuba libre', price: '18', description: '', category: 'Long drinks', subcategory: null, categories: { name: 'Long drinks' } },
    { id: 97, name: 'Jager Bomb', price: '18', description: '2 buc. · 185ml', category: 'Long drinks', subcategory: null, categories: { name: 'Long drinks' } },
    { id: 98, name: 'Vodka orange', price: '18', description: '', category: 'Long drinks', subcategory: null, categories: { name: 'Long drinks' } },
    { id: 99, name: 'Vodka tonic', price: '18', description: '', category: 'Long drinks', subcategory: null, categories: { name: 'Long drinks' } },

    // ── Snacks ────────────────────────────────────────────────────────────
    { id: 100, name: 'Pringles', price: '17', description: '', category: 'Snacks', subcategory: null, categories: { name: 'Snacks' } },
    { id: 101, name: 'Alune', price: '7', description: '', category: 'Snacks', subcategory: null, categories: { name: 'Snacks' } },
    { id: 102, name: 'Saratele', price: '7', description: '', category: 'Snacks', subcategory: null, categories: { name: 'Snacks' } },
];

export const mockCafeDetails = {
    id: 1,
    name: 'The Old Place',
    logoUrl: '',
    address: 'Strada Petru Bran 17, 440027 Satu Mare',
    phone: '0744 664 997',
    slogan: 'Cafe & Pub',
    hours: [
        { day: 'Mon – Fri', time: '7:30 am – 12 am' },
        { day: 'Saturday', time: '10 am – 1 am' },
        { day: 'Sunday', time: '10 am – 12 am' },
    ],
};
