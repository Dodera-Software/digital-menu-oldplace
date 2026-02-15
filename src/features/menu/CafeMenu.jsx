import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Search, Moon, Sun } from 'lucide-react';
import supabase from '../../utils/supabase'
import { CafeLoader } from '../loader/CafeLoader';

const CafeMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);

  const [menuItems, setMenuItems] = useState([])

useEffect(() => {
  async function fetchMenu() {
    const { data, error } = await supabase
      .from('menuItems')
      .select(`
        *,
        categories (
          name
        )
      `)
    
    if (error) {
      console.error(error)
    } else {
      // Transform data: replace category_id with category name
      const menuWithCategoryNames = data?.map(item => ({
        ...item,
        category: item.categories?.name || 'Uncategorized',
        // Remove the nested categories object and category_id if you want
        // category_id: undefined,
        // categories: undefined
      })) || []
      
      setMenuItems(menuWithCategoryNames)
    }
  }
  
  fetchMenu()
}, [])



  const categories = ['All', 'Hot Drinks', 'Cold Drinks', 'Pastries', 'Snacks'];

  const filteredItems = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });;

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    menuItems.length > 0 ? 
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950' 
        : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50'
    }`}>
      {/* Header with Background Image */}
      <header className={`relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-b from-amber-900 to-orange-950' 
          : 'bg-gradient-to-b from-white/70 to-amber-50/50'
      } backdrop-blur-md border-b ${
        darkMode ? 'border-amber-800/50' : 'border-amber-100/50'
      } sticky top-0 z-50 shadow-sm transition-colors duration-300`}>
        
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=600&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={`absolute inset-0 ${
            darkMode
              ? 'bg-gradient-to-r from-amber-950/90 to-orange-950/80'
              : 'bg-gradient-to-r from-white/80 to-amber-50/70'
          } transition-colors duration-300`} />
        </div>

        {/* Header Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14 flex items-center justify-between">
          <div className="text-left">
            <h1 className={`text-5xl md:text-6xl font-serif tracking-tight ${
              darkMode 
                ? 'text-amber-100 drop-shadow-lg' 
                : 'text-amber-950 drop-shadow'
            }`}>
              Ava
            </h1>
            <p className={`text-sm md:text-base mt-3 font-light ${
              darkMode 
                ? 'text-amber-200 drop-shadow' 
                : 'text-amber-700 drop-shadow'
            }`}>
              Handcrafted coffee & fresh pastries
            </p>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? 'bg-amber-800/80 hover:bg-amber-700 text-yellow-200 focus:ring-amber-600'
                : 'bg-white/60 hover:bg-white/80 text-amber-600 focus:ring-amber-400'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Search & Filter Section */}
        <div className="space-y-6 mb-10">
          {/* Search Input */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
              darkMode ? 'text-amber-700' : 'text-amber-600/40'
            }`} />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 md:py-4 border rounded-full focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-amber-900/40 border-amber-800/60 text-amber-100 placeholder:text-amber-700 focus:ring-amber-400/50 hover:shadow-lg hover:shadow-orange-500/10 hover:border-amber-700'
                  : 'bg-white border-amber-200/60 text-amber-950 placeholder:text-amber-600/50 focus:ring-amber-400/50 hover:shadow-md'
              }`}
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  activeCategory === category
                    ? darkMode
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 focus:ring-amber-500'
                      : 'bg-amber-600 text-white shadow-lg shadow-amber-200/50 focus:ring-amber-400'
                    : darkMode
                    ? 'bg-amber-900/40 text-amber-100 border border-amber-800/60 hover:shadow-md hover:border-amber-700 focus:ring-amber-400'
                    : 'bg-white text-amber-800 border border-amber-200/60 hover:shadow-md hover:border-amber-300/60 focus:ring-amber-400'
                } ${darkMode ? 'focus:ring-offset-amber-950' : 'focus:ring-offset-amber-50'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border ${
                  darkMode
                    ? 'bg-amber-900/50 border-amber-800/40 hover:shadow-orange-500/20'
                    : 'bg-white border-amber-100/40 hover:shadow-amber-200/50'
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden h-48 md:h-56 ${
                  darkMode
                    ? 'bg-gradient-to-br from-amber-800/30 to-orange-800/30'
                    : 'bg-gradient-to-br from-amber-200/20 to-orange-200/20'
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className={`text-lg md:text-xl font-serif mb-1 ${
                        darkMode ? 'text-amber-100' : 'text-amber-900'
                      }`}>
                        {item.name}
                      </h3>
                      <p className={`text-xs md:text-sm font-medium uppercase tracking-wider ${
                        darkMode ? 'text-amber-300' : 'text-amber-600'
                      }`}>
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`flex-shrink-0 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        darkMode
                          ? 'hover:bg-amber-800/50 focus:ring-offset-amber-950 focus:ring-amber-400'
                          : 'hover:bg-amber-50 focus:ring-offset-amber-50 focus:ring-amber-400'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          favorites.has(item.id)
                            ? 'fill-red-500 text-red-500'
                            : darkMode
                            ? 'text-amber-700 hover:text-amber-600'
                            : 'text-amber-600/40 hover:text-amber-600'
                        }`}
                      />
                    </button>
                  </div>

                  <p className={`text-sm mb-4 flex-grow ${
                    darkMode ? 'text-amber-200/70' : 'text-amber-700/70'
                  }`}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xl md:text-2xl font-serif font-semibold ${
                      darkMode ? 'text-amber-300' : 'text-amber-900'
                    }`}>
                      {item.price}
                    </span>
                    <button className={`px-4 md:px-5 py-2 md:py-2.5 text-white rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 ${
                      darkMode
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 focus:ring-amber-400 focus:ring-offset-amber-950'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-200/50 focus:ring-amber-400 focus:ring-offset-amber-50'
                    }`}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={`text-lg font-light ${
              darkMode ? 'text-amber-200/60' : 'text-amber-700/60'
            }`}>
              No items found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
              }}
              className={`mt-4 px-6 py-3 text-white rounded-full font-medium transition-all duration-200 ${
                darkMode
                  ? 'bg-amber-600 hover:shadow-lg hover:shadow-orange-500/30'
                  : 'bg-amber-600 hover:shadow-lg hover:shadow-amber-200/50'
              }`}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-16 border-t transition-colors duration-300 ${
        darkMode
          ? 'border-amber-800/50 bg-amber-900/40 backdrop-blur-md'
          : 'border-amber-100/50 bg-white/40 backdrop-blur-md'
      }`}>
        <div className={`max-w-6xl mx-auto px-4 py-8 text-center text-sm font-light ${
          darkMode ? 'text-amber-200/60' : 'text-amber-700/60'
        }`}>
          <p>Open daily from 7 AM to 6 PM</p>
          <p className="mt-2">Enjoy your visit! ☕</p>
        </div>
      </footer>
    </div> : <CafeLoader />
  );
};

export default CafeMenu;