
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Briefcase, Camera, ArrowRight } from 'lucide-react';
import { ViewState, Product } from '../types';
import { ENABLE_STUDIO, MOCK_PRODUCTS } from '../constants';

interface NavigationProps {
  cartCount: number;
  setView: (view: ViewState) => void;
  isTransparent?: boolean;
  isAuthenticated: boolean;
  onLogout?: () => void;
  setSelectedProduct?: (product: Product) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ cartCount, setView, isTransparent = false, isAuthenticated, onLogout, setSelectedProduct }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const searchResults = searchQuery.trim().length > 1
    ? MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.group.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isSolid = scrolled || !isTransparent;

  const handleUserClick = () => {
      if (isAuthenticated) {
          setView('USER_PROFILE');
      } else {
          setView('USER_AUTH');
      }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] px-6 md:px-12 py-6 flex justify-between items-center
        ${isSolid ? 'bg-[#F2F4F3]/90 backdrop-blur-xl text-[#111111] border-b border-[#111111]/5 py-4' : 'bg-transparent text-[#F2F4F3] py-8'}`}
      >
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 xl:gap-12 text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
          <button onClick={() => setView('GENDER_SELECTION')} className="hover:text-[#c9b52e] transition-colors relative group py-2">
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9b52e] transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
          <button onClick={() => setView('GENDER_SELECTION')} className="hover:text-[#c9b52e] transition-colors relative group py-2">
            Collections
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9b52e] transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
          {ENABLE_STUDIO && (
              <button onClick={() => setView('STUDIO')} className="hover:text-[#c9b52e] transition-colors relative group py-2">
                 Studio
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9b52e] transition-all duration-500 ease-out group-hover:w-full"></span>
              </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
                <Menu size={24} strokeWidth={1} />
            </button>
        </div>

        {/* Logo - Centered - ANTON FONT */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-anton tracking-[0.1em] cursor-pointer select-none hover:tracking-[0.15em] transition-all duration-700 ease-out z-50"
          style={{ color: isSolid ? '#111111' : '#F2F4F3' }}
          onClick={() => setView('LANDING')}
        >
          LUVARTE
        </div>

        {/* Icons */}
        <div className="flex gap-5 md:gap-8 items-center">
          <a href="http://127.0.0.1:7860" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#c9b52e] transition-colors relative group py-2">
             <Camera size={18} className="text-white group-hover:text-[#c9b52e] transition-colors" />
             <span className="hidden xl:inline text-xs font-bold tracking-[0.25em] uppercase">Virtual Try On</span>
             <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9b52e] transition-all duration-500 ease-out group-hover:w-full"></span>
          </a>
          <button onClick={() => setSearchOpen(true)} className="hover:text-[#c9b52e] transition-colors hidden md:block group">
            <Search size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
          </button>
          <button className="hover:text-[#c9b52e] transition-colors relative group" onClick={() => setView('CART')}>
            <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c9b52e] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-md animate-in fade-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
          <button className="hover:text-[#c9b52e] transition-colors group relative" onClick={handleUserClick} title="My Account">
              <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
              {isAuthenticated && <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#c9b52e] rounded-full"></div>}
          </button>
          <button className="hover:text-[#c9b52e] transition-colors group border-l border-current pl-6 ml-2" onClick={() => setView('VENDOR_LOGIN')} title="Vendor Access">
              <Briefcase size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#F2F4F3] z-[60] flex flex-col p-8 text-[#111111] animate-in slide-in-from-left duration-700 cubic-bezier(0.16,1,0.3,1)">
              <div className="flex justify-between items-center mb-16">
                  <span className="font-anton text-3xl tracking-[0.1em]">LUVARTE</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="hover:rotate-90 transition-transform duration-500">
                      <X size={32} strokeWidth={1} />
                  </button>
              </div>
              <div className="flex flex-col gap-10 text-3xl font-anton uppercase tracking-wider">
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}>Search</button>
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>Shop All</button>
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>New Arrivals</button>
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>Collections</button>
                  {ENABLE_STUDIO && (
                      <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('STUDIO'); setMobileMenuOpen(false); }}>Studio</button>
                  )}
                  <a href="http://127.0.0.1:7860" target="_blank" rel="noopener noreferrer" className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300">Virtual Try On</a>
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { handleUserClick(); setMobileMenuOpen(false); }}>My Profile</button>
                  <button className="text-left hover:text-[#c9b52e] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('VENDOR_LOGIN'); setMobileMenuOpen(false); }}>Vendor Portal</button>
              </div>
          </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] animate-in fade-in duration-300" onClick={() => setSearchOpen(false)}>
              <div 
                className="bg-[#F2F4F3] w-full max-w-3xl mx-auto mt-24 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Search Input */}
                  <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                      <Search size={24} className="text-gray-400" />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, categories..."
                        className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-gray-400"
                      />
                      <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Search Results */}
                  <div className="max-h-[60vh] overflow-y-auto">
                      {searchQuery.trim().length > 1 ? (
                          searchResults.length > 0 ? (
                              <div className="p-4 space-y-2">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-4">
                                      {searchResults.length} Results for "{searchQuery}"
                                  </p>
                                  {searchResults.map((product) => (
                                      <button
                                        key={product.id}
                                        onClick={() => {
                                            if (setSelectedProduct) setSelectedProduct(product);
                                            setView('PRODUCT_DETAIL');
                                            setSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-white rounded-lg transition-colors group text-left"
                                      >
                                          <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <h4 className="font-bold text-sm uppercase tracking-wide truncate">{product.name}</h4>
                                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.gender} / {product.category}</p>
                                              <p className="font-anton text-lg mt-1">₹{product.price.toFixed(2)}</p>
                                          </div>
                                          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#c9b52e] group-hover:translate-x-1 transition-all" />
                                      </button>
                                  ))}
                              </div>
                          ) : (
                              <div className="p-12 text-center">
                                  <p className="text-gray-400 text-sm">No products found for "{searchQuery}"</p>
                              </div>
                          )
                      ) : (
                          <div className="p-8">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Searches</p>
                              <div className="flex flex-wrap gap-2">
                                  {['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Sneakers', 'Watches'].map((term) => (
                                      <button
                                        key={term}
                                        onClick={() => setSearchQuery(term)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#c9b52e] hover:text-[#c9b52e] transition-colors"
                                      >
                                          {term}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
