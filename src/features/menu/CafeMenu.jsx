import React, { useState, useMemo, useEffect } from "react";
import oldplaceBg from "../../assets/images/oldplace_bg.webp";
import oldplaceLogo from "../../assets/images/oldplace_logo.webp";
import oldplaceInside from "../../assets/images/oldplace_inside.webp";
import {
  Heart,
  Search,
  Moon,
  Sun,
  Coffee,
  Leaf,
  Sparkles,
  CupSoda,
  Flame,
  Beer,
  Wine,
  FlaskConical,
  Zap,
  GlassWater,
  Cookie,
  Sandwich,
  Utensils,
  Martini,
  Pizza,
  Milk,
  Citrus,
  Croissant,
  CakeSlice,
  Soup,
  Salad,
  Beef,
  Drumstick,
  Fish,
  IceCream2,
} from "lucide-react";
import supabase from "../../utils/supabase";
import { CafeLoader } from "../loader/CafeLoader";

// Icon map — keyed by Lucide icon name string (stored in DB)
const ICON_MAP = {
  Coffee, Martini, Beer, Wine, CupSoda, GlassWater, FlaskConical, Milk, Citrus,
  Leaf, Flame, Sparkles, Zap,
  Pizza, Sandwich, Cookie, Croissant, CakeSlice, Soup, Salad, Beef, Drumstick, Fish, IceCream2, Utensils,
};
// Name-based fallback for existing categories before icon column was added
const ICON_BY_NAME = {
  "Coffee": Coffee, "Tea": Leaf, "Hot Chocolate": Flame,
  "Soft drinks": CupSoda, "Freshly made": Sparkles,
  "Beer": Beer, "Wine": Wine, "Spirits": FlaskConical,
  "Shots": Zap, "Long drinks": GlassWater, "Snacks": Cookie,
};

const CafeMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Coffee");
  const [darkMode, setDarkMode] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [cafeDetails, setCafeDetails] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [menuRes, detailsRes, categoriesRes] = await Promise.all([
          supabase.from("menuItems").select(`*, categories(name)`),
          supabase.from("cafeDetails").select(`*`).limit(1),
          supabase.from("categories").select(`*`).order("id", { ascending: true }),
        ]);

        if (menuRes.error) throw menuRes.error;
        if (detailsRes.error) throw detailsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        setMenuItems(
          menuRes.data?.map((item) => ({
            ...item,
            category: item.categories?.name || "Uncategorized",
          })) || []
        );
        setCafeDetails(detailsRes.data?.[0] || {});
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setFetchError(err.message || "Failed to load menu data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  return isLoading ? (
    <CafeLoader />
  ) : fetchError ? (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF2D7' }}>
      <div className="text-center px-6">
        <p className="text-lg font-semibold mb-2" style={{ color: '#8B5E3C' }}>Could not load menu</p>
        <p className="text-sm" style={{ color: 'rgba(139,94,60,0.6)' }}>{fetchError}</p>
      </div>
    </div>
  ) : (
    <div
      className={`min-h-screen transition-colors duration-500 relative`}
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #222222 0%, #222222 25%, #222222 50%, #222222 75%, #222222 100%)"
          : "#FFF2D7",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background watermark — fixed, centered over the whole page */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0">
        <img
          src={oldplaceBg}
          alt=""
          className="w-[600px] max-w-[80vw] opacity-40 select-none"
        />
      </div>
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
          background-size: cover;
          background-position: center;
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
        onContextMenu={(e) => e.preventDefault()}
        className={`header-background md:sticky md:top-0 z-50 transition-all duration-500 border-b select-none ${darkMode ? "border-amber-900/20" : "border-amber-200/30"
          } backdrop-blur-xl`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${oldplaceInside})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          WebkitUserDrag: 'none',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 flex items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-3">
              <span
                className={`text-sm font-sans font-600 tracking-[0.2em] ${darkMode ? "text-amber-400" : "text-amber-400"
                  }`}
              >
                WELCOME TO
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
              className={`text-base md:text-lg font-light mt-6 max-w-md ${darkMode ? "text-amber-200/70" : "text-amber-200/70"
                }`}
            >
              {cafeDetails?.slogan}
            </p>
          </div>

          {/* Logo + Dark Mode Toggle */}
          <div className="flex flex-col-reverse md:flex-col items-center gap-4">
            <img
              src={oldplaceLogo}
              alt="Old Place Logo"
              className="w-36 h-36 md:w-44 md:h-44 object-contain"
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 focus:outline-none group cursor-pointer ${darkMode
                ? "bg-amber-500/20 border border-amber-400/60 text-amber-300 hover:bg-amber-500/30 hover:border-amber-300"
                : "bg-white/70 border border-white/80 text-brand hover:bg-white/90 shadow-md"
                }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 transition-transform group-hover:rotate-180" />
              ) : (
                <Moon className="w-6 h-6 transition-transform group-hover:rotate-180" />
              )}          </button>
          </div>
        </div>
      </header>

      {/* Categories bar — sticky on mobile only, static on desktop */}
      <div
        className="sticky md:static top-0 z-40 border-b md:border-0"
        style={{
          background: darkMode ? '#222222' : '#FFF2D7',
          borderColor: darkMode ? 'rgba(217,119,6,0.15)' : 'rgba(139,94,60,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-wrap scroll-smooth">
            {categories.map((category, idx) => {
              const IconComponent = (category.icon && ICON_MAP[category.icon]) || ICON_BY_NAME[category.name] || Utensils;
              return (
                <button
                  key={category.id || category.name}
                  onClick={() => { setActiveCategory(category.name); window.scrollTo(0, 0); }}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`category-chip category-chip-enter px-6 md:px-8 py-3 md:py-4 rounded-full font-sans font-600 transition-all duration-300 whitespace-nowrap focus:outline-none backdrop-blur-sm flex items-center gap-2.5 text-sm cursor-pointer ${activeCategory === category.name
                    ? darkMode
                      ? "bg-[#7a5c3f] text-white border border-[#7a5c3f] shadow-lg"
                      : "bg-[#8B5E3C] text-white border border-[#8B5E3C] shadow-lg"
                    : darkMode
                      ? "bg-slate-800/50 text-amber-200/80 border border-amber-600/20 hover:bg-slate-700/60 hover:border-amber-500/40 hover:text-amber-100"
                      : "bg-white/60 text-brand border border-amber-200/40 hover:bg-white/80 hover:border-amber-300/60 hover:text-brand"
                    }`}
                >
                  <IconComponent className="category-icon w-4 h-4 md:w-5 md:h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                }}
                className={`menu-item-card group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 focus-within:scale-105 ${darkMode
                  ? "bg-slate-800/80 border border-amber-600/20 hover:border-amber-500/40 shadow-2xl hover:shadow-amber-600/20"
                  : "bg-white/90 border border-amber-200/30 hover:border-amber-300/60 shadow-xl hover:shadow-amber-200/40"
                  }`}
              >
                {/* Content */}
                <div className="relative p-7 md:p-8 flex flex-col h-full">
                  {/* Header with Favorite */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      {item.subcategory && (
                        <p className={`text-xs font-sans tracking-widest uppercase mb-1 ${darkMode ? "text-amber-500/60" : "text-brand/40"}`}>
                          {item.subcategory}
                        </p>
                      )}
                      <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3">
                        <span
                          className={`${darkMode ? "text-white" : "text-brand"
                            }`}
                        >
                          {item.name}
                        </span>
                      </h3>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="mb-6 flex-grow">
                    {item.description ? (
                      <p
                        className={`text-sm md:text-base leading-relaxed ${darkMode ? "text-amber-200/70" : "text-brand/70"
                          }`}
                      >
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  {/* Price */}
                  <div className="pt-4 border-t border-amber-400/20">
                    <p className="price-tag text-3xl md:text-4xl">
                      <span
                        className={`${darkMode ? "text-amber-400" : "text-brand"
                          }`}
                      >
                        {item.price}
                      </span>
                      <span
                        className={`text-lg ml-2 ${darkMode ? "text-amber-300/60" : "text-brand/60"
                          }`}
                      >
                        lei
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles
              className={`w-16 h-16 mx-auto mb-6 ${darkMode ? "text-amber-500/40" : "text-brand/30"
                }`}
            />
            <p
              className={`text-xl font-light mb-8 ${darkMode ? "text-amber-200/60" : "text-brand/60"
                }`}
            >
              No items found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
              className={`px-8 py-4 text-white font-sans font-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md hover:shadow-lg cursor-pointer ${darkMode
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
        className={`mt-20 border-t transition-all duration-500 relative z-10 ${darkMode
          ? "border-amber-600/20 bg-gradient-to-b from-slate-900/50 to-slate-950/80"
          : "border-amber-200/30 bg-gradient-to-b from-white/50 to-amber-50/30"
          } backdrop-blur-xl`}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center">
            {/* Hours */}
            <div>
              <p className="font-display text-2xl mb-6">
                <span className={`${darkMode ? "text-amber-400" : "text-brand"}`}>
                  Hours
                </span>
              </p>
              <div className="space-y-2">
                {(cafeDetails?.hours || []).map(({ day, time }) => (
                  <div key={day} className="flex justify-center gap-6">
                    <span className={`text-sm font-semibold ${darkMode ? "text-amber-200/80" : "text-brand/80"}`}>{day}</span>
                    <span className={`text-sm ${darkMode ? "text-amber-200/60" : "text-brand/60"}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="font-display text-2xl mb-6">
                <span className={`${darkMode ? "text-amber-400" : "text-brand"}`}>
                  Location
                </span>
              </p>
              <p className={`text-lg font-light ${darkMode ? "text-amber-200/70" : "text-brand/70"}`}>
                {cafeDetails?.address}
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="font-display text-2xl mb-6">
                <span className={`${darkMode ? "text-amber-400" : "text-brand"}`}>
                  Contact
                </span>
              </p>
              <a
                href={`tel:${cafeDetails?.phone?.replace(/\s/g, '')}`}
                className={`inline-flex items-center gap-2 text-lg font-light transition-colors cursor-pointer underline underline-offset-4 decoration-dotted ${darkMode ? "text-amber-200/70 hover:text-amber-200" : "text-brand/70 hover:text-brand"}`}
              >
                {cafeDetails?.phone}
              </a>
            </div>
          </div>

          <div
            className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? "border-amber-600/20" : "border-amber-200/30"
              }`}
          >
            <a
              href="https://biz-solution.ro/wp-content/uploads/2015/02/MODEL-ATENTIONARE-BON-FISCAL.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-sans underline underline-offset-2 transition-colors cursor-pointer ${darkMode ? "text-amber-300/70 hover:text-amber-300/85" : "text-brand/70 hover:text-brand/85"}`}
            >
              Legal
            </a>
            <p className="font-sans text-sm font-light">
              <span
                className={`${darkMode ? "text-amber-300/60" : "text-brand/60"}`}
              >
                Made with <Heart className="inline-block w-3 h-3 fill-rose-500 text-rose-500 animate-pulse mx-0.5 -translate-y-px" /> by{" "}
              </span>
              <a
                href="https://www.doderasoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${darkMode
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-brand hover:text-brand"
                  }`}
              >
                Dodera Software
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default CafeMenu;