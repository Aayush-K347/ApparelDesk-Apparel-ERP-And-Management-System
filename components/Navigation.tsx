
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Briefcase } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  cartCount: number;
  setView: (view: ViewState) => void;
  isTransparent?: boolean;
  isAuthenticated: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ cartCount, setView, isTransparent = false, isAuthenticated }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.25em] uppercase">
          <button onClick={() => setView('GENDER_SELECTION')} className="hover:text-[#488C5C] transition-colors relative group py-2">
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#488C5C] transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
          <button onClick={() => setView('GENDER_SELECTION')} className="hover:text-[#488C5C] transition-colors relative group py-2">
            Collections
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#488C5C] transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
          <button onClick={() => setView('LANDING')} className="hover:text-[#488C5C] transition-colors relative group py-2">
            Editorial
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#488C5C] transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
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
        <div className="flex gap-8 items-center">
          <button className="hover:text-[#488C5C] transition-colors hidden md:block group">
            <Search size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
          </button>
          <button className="hover:text-[#488C5C] transition-colors relative group" onClick={() => setView('CART')}>
            <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#488C5C] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-md animate-in fade-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
          <button className="hover:text-[#488C5C] transition-colors group relative" onClick={handleUserClick} title="My Account">
              <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500 ease-out" />
              {isAuthenticated && <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#488C5C] rounded-full"></div>}
          </button>
          <button className="hover:text-[#488C5C] transition-colors group border-l border-current pl-6 ml-2" onClick={() => setView('VENDOR_LOGIN')} title="Vendor Access">
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
                  <button className="text-left hover:text-[#488C5C] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>Shop All</button>
                  <button className="text-left hover:text-[#488C5C] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>New Arrivals</button>
                  <button className="text-left hover:text-[#488C5C] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('GENDER_SELECTION'); setMobileMenuOpen(false); }}>Collections</button>
                  <button className="text-left hover:text-[#488C5C] transition-colors hover:translate-x-4 duration-300" onClick={() => { handleUserClick(); setMobileMenuOpen(false); }}>My Profile</button>
                  <button className="text-left hover:text-[#488C5C] transition-colors hover:translate-x-4 duration-300" onClick={() => { setView('VENDOR_LOGIN'); setMobileMenuOpen(false); }}>Vendor Portal</button>
              </div>
          </div>
      )}
    </>
  );
};
