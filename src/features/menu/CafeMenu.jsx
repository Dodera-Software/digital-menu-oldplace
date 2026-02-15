import React, { useState, useMemo, useEffect } from "react";
import {
  Heart,
  Search,
  Moon,
  Sun,
  Coffee,
  Cake,
  Sandwich,
  Wind,
  Utensils,
  Leaf,
  Droplets,
  Sparkles,
} from "lucide-react";
import supabase from "../../utils/supabase";
import { CafeLoader } from "../loader/CafeLoader";

// Category icon mapping
const categoryIcons = {
  Coffee: Coffee,
  Desserts: Cake,
  Sandwiches: Sandwich,
  Smoothies: Wind,
  Pastries: Utensils,
  Salads: Leaf,
  Beverages: Droplets,
  Breakfast: Sparkles,
  All: Utensils,
};

const CafeMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [cafeDetails, setCafeDetails] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase.from("menuItems").select(`
        *,
        categories (
          name
        )
      `);

      if (error) {
        console.error(error);
      } else {
        const menuWithCategoryNames =
          data?.map((item) => ({
            ...item,
            category: item.categories?.name || "Uncategorized",
          })) || [];

        setMenuItems(menuWithCategoryNames);
      }
    }
    async function fetchDetails() {
      const { data: details, error } = await supabase
        .from("cafeDetails")
        .select(`*`)
        .limit(1);

      if (error) {
        console.error(error);
      } else {
        setCafeDetails(details[0]);
      }
    }
    async function fetchCategories() {
      const { data: categoriesData, error } = await supabase
        .from("categories")
        .select(`*`);

      if (error) {
        console.error(error);
      } else {
        const categoriesResult = categoriesData.map((category) => category.name);
        let result = ["All", ...categoriesResult];
        setCategories(result);
      }
    }
    fetchCategories();
    fetchDetails();
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return menuItems.length > 0 ? (
    <div
      className={`min-h-screen transition-colors duration-500`}
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #222222 0%, #222222 25%, #222222 50%, #222222 75%, #222222 100%)"
          : "linear-gradient(135deg, #faf8f3 0%, #f5f1eb 25%, #ede6dd 50%, #e8ddd0 75%, #f0e9e0 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');

        * {
          font-family: 'Lora', serif;
        }

        .font-display {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
        }

        .font-sans {
          font-family: 'Poppins', sans-serif;
        }

        .elegant-line {
          position: relative;
          display: inline-block;
        }

        .elegant-line::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, rgba(217, 119, 6, 0.8) 0%, rgba(217, 119, 6, 0) 100%);
        }

        .header-background {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #1e293b 100%);
          position: relative;
          overflow: hidden;
        }

        .header-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=600&fit=crop'),
            linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(52, 65, 84, 0.75) 100%);
          background-size: cover, cover;
          background-position: center, center;
          background-blend-mode: overlay;
          opacity: 0.9;
        }

        .menu-item-card {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-chip-enter {
          animation: slideInRight 0.4s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Luxe shimmer effect */
        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmerMove 3s infinite;
        }

        @keyframes shimmerMove {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .price-tag {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
        }

        .category-icon {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .category-chip:hover .category-icon {
          transform: scale(1.15) rotate(-5deg);
          filter: brightness(1.2);
        }
      `}</style>

      {/* Header */}
      <header
        className={`header-background sticky top-0 z-50 transition-all duration-500 border-b ${
          darkMode ? "border-amber-900/20" : "border-amber-200/30"
        } backdrop-blur-xl`}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 flex items-end justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-3">
              <span
                className={`text-sm font-sans font-600 tracking-[0.2em] ${
                  darkMode ? "text-amber-400" : "text-amber-400"
                }`}
              >
                CAFÉ EXPERIENCE
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-tight mb-2 elegant-line">
              <span
                className={`${darkMode ? "text-white" : "text-white"}`}
              >
                {cafeDetails?.name}
              </span>
            </h1>
            <p
              className={`text-base md:text-lg font-light mt-6 max-w-md ${
                darkMode ? "text-amber-200/70" : "text-amber-200/70"
              }`}
            >
              {cafeDetails?.slogan}
            </p>
          </div>

          {/* Dark Mode Toggle - Luxe Style */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`backdrop-blur-xl p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md group ${
              darkMode
                ? "border border-amber-700/40 text-amber-300 focus:ring-amber-500 focus:ring-offset-slate-950"
                : "border border-amber-200/40 text-amber-700 focus:ring-amber-400 focus:ring-offset-white"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 transition-transform group-hover:rotate-180" />
            ) : (
              <Moon className="w-6 h-6 transition-transform group-hover:rotate-180" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Search & Filter Section */}
        <div className="space-y-8 mb-12">
          {/* Search Bar - Luxe */}
          

          {/* Category Filter - Elegant Chips */}
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scroll-smooth">
            {categories.map((category, idx) => {
              const IconComponent = categoryIcons[category] || Utensils;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  className={`category-chip category-chip-enter px-6 md:px-8 py-3 md:py-4 rounded-full font-sans font-600 transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm flex items-center gap-2.5 text-sm ${
                    activeCategory === category
                      ? darkMode
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-2xl shadow-amber-600/40 border border-amber-400/50 focus:ring-amber-400 focus:ring-offset-slate-950"
                        : "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-2xl shadow-amber-300/40 border border-amber-300/50 focus:ring-amber-400 focus:ring-offset-amber-50"
                      : darkMode
                      ? "bg-slate-800/50 text-amber-200/80 border border-amber-600/20 hover:bg-slate-700/60 hover:border-amber-500/40 hover:text-amber-100 focus:ring-amber-500 focus:ring-offset-slate-950"
                      : "bg-white/60 text-amber-800 border border-amber-200/40 hover:bg-white/80 hover:border-amber-300/60 hover:text-amber-900 focus:ring-amber-400 focus:ring-offset-amber-50"
                  }`}
                >
                  <IconComponent className="category-icon w-4 h-4 md:w-5 md:h-5" />
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                }}
                className={`menu-item-card group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 focus-within:scale-105 ${
                  darkMode
                    ? "bg-slate-800/80 border border-amber-600/20 hover:border-amber-500/40 shadow-2xl hover:shadow-amber-600/20"
                    : "bg-white/90 border border-amber-200/30 hover:border-amber-300/60 shadow-xl hover:shadow-amber-200/40"
                }`}
              >
                {/* Gradient Overlay for Luxury */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    darkMode
                      ? "bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"
                      : "bg-gradient-to-t from-white/30 via-transparent to-transparent"
                  }`}
                />

                {/* Image Container */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-amber-200/10 to-orange-200/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 backdrop-blur-xl rounded-full px-4 py-2 bg-white/20 border border-white/30">
                    <span
                      className={`text-xs font-sans font-600 tracking-widest ${
                        darkMode ? "text-amber-300" : "text-amber-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-7 md:p-8 flex flex-col h-full">
                  {/* Header with Favorite */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3">
                        <span
                          className={`${
                            darkMode ? "text-white" : "text-slate-950"
                          }`}
                        >
                          {item.name}
                        </span>
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md ${
                        darkMode
                          ? "hover:bg-amber-600/30 focus:ring-offset-slate-800 focus:ring-amber-400"
                          : "hover:bg-amber-100/50 focus:ring-offset-white focus:ring-amber-400"
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all duration-300 ${
                          favorites.has(item.id)
                            ? "fill-rose-500 text-rose-500 scale-110"
                            : darkMode
                            ? "text-amber-400/60 hover:text-amber-300"
                            : "text-amber-600/40 hover:text-amber-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm md:text-base leading-relaxed mb-6 flex-grow ${
                      darkMode ? "text-amber-200/70" : "text-amber-800/70"
                    }`}
                  >
                    {item.description}
                  <div className="pt-4 border-t border-amber-400/20">
                    <p className="price-tag text-3xl md:text-4xl">
                      <span
                        className={`${
                          darkMode ? "text-amber-400" : "text-amber-700"
                        }`}
                      >
                        {item.price}
                      </span>
                      <span
                        className={`text-lg ml-2 ${
                          darkMode ? "text-amber-300/60" : "text-amber-600/60"
                        }`}
                      >
                        AFN
                      </span>
                    </p>
                  </div>
                  </p>

                  {/* Price - Luxury Style */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles
              className={`w-16 h-16 mx-auto mb-6 ${
                darkMode ? "text-amber-500/40" : "text-amber-600/30"
              }`}
            />
            <p
              className={`text-xl font-light mb-8 ${
                darkMode ? "text-amber-200/60" : "text-amber-700/60"
              }`}
            >
              No items found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
              className={`px-8 py-4 text-white font-sans font-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md hover:shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:shadow-amber-600/30 focus:ring-amber-500 focus:ring-offset-slate-950"
                  : "bg-gradient-to-r from-amber-600 to-amber-500 hover:shadow-amber-300/40 focus:ring-amber-400 focus:ring-offset-amber-50"
              }`}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer - Elegant */}
      <footer
        className={`mt-20 border-t transition-all duration-500 ${
          darkMode
            ? "border-amber-600/20 bg-gradient-to-b from-slate-900/50 to-slate-950/80"
            : "border-amber-200/30 bg-gradient-to-b from-white/50 to-amber-50/30"
        } backdrop-blur-xl`}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <p className="font-display text-2xl mb-6">
                <span
                  className={`${darkMode ? "text-amber-400" : "text-amber-700"}`}
                >
                  Hours
                </span>
              </p>
              <p
                className={`text-lg font-light ${
                  darkMode ? "text-amber-200/70" : "text-amber-800/70"
                }`}
              >
                Open daily from{" "}
                <span className="font-semibold">
                  {cafeDetails?.openingTime?.slice(0, 5)}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {cafeDetails?.closingTime?.slice(0, 5)}
                </span>
              </p>
            </div>
            <div>
              <p className="font-display text-2xl mb-6">
                <span
                  className={`${darkMode ? "text-amber-400" : "text-amber-700"}`}
                >
                  Location
                </span>
              </p>
              <p
                className={`text-lg font-light ${
                  darkMode ? "text-amber-200/70" : "text-amber-800/70"
                }`}
              >
                {cafeDetails?.address}
              </p>
            </div>
          </div>

          <div
            className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
              darkMode ? "border-amber-600/20" : "border-amber-200/30"
            }`}
          >
            <p className="font-sans text-sm font-light">
              <span
                className={`${darkMode ? "text-amber-300/60" : "text-amber-600/60"}`}
              >
                Crafted with care ☕
              </span>
            </p>
            <p className="font-sans text-sm font-light">
              <span
                className={`${darkMode ? "text-amber-300/60" : "text-amber-600/60"}`}
              >
                Developed by{" "}
              </span>
              <a
                href="https://t.me/ahmadwalish"
                className={`transition-colors ${
                  darkMode
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-amber-700 hover:text-amber-800"
                }`}
              >
                @AhmadwaliSh
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  ) : (
    <CafeLoader />
  );
};

export default CafeMenu;