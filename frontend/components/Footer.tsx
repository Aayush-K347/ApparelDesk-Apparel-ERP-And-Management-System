
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-white py-20 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-24">
        {/* Brand Column */}
        <div className="flex-1">
            <h1 className="text-3xl font-anton tracking-[0.2em] mb-6">LUVARTE</h1>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-8">
                Redefining contemporary luxury through impeccable tailoring and timeless design. Paris, France.
            </p>
            <div className="flex gap-4">
                <Facebook size={18} className="hover:text-[#c9b52e] transition-colors cursor-pointer" />
                <Instagram size={18} className="hover:text-[#c9b52e] transition-colors cursor-pointer" />
                <Twitter size={18} className="hover:text-[#c9b52e] transition-colors cursor-pointer" />
            </div>
        </div>

        {/* Links Columns */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 text-[10px] font-bold uppercase tracking-widest">
            <div>
              <h3 className="text-white mb-6">Company</h3>
              <ul className="space-y-4 text-gray-500 font-normal normal-case tracking-wide">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Sustainability</li>
                <li className="hover:text-white cursor-pointer transition-colors">Press</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-6">Support</h3>
              <ul className="space-y-4 text-gray-500 font-normal normal-case tracking-wide">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Shipping</li>
                <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-6">Legal</h3>
              <ul className="space-y-4 text-gray-500 font-normal normal-case tracking-wide">
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Cookies</li>
              </ul>
            </div>
        </div>
      </div>
      
      <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
        <p>© 2024 Luvarte Atelier. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed & Crafted in Paris</p>
      </div>
    </footer>
  );
};
