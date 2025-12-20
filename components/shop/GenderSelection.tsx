
import React from 'react';
import { ViewState } from '../../types';

interface GenderSelectionProps {
    setSelectedGender: (gender: string) => void;
    setView: (view: ViewState) => void;
    setSelectedGroup: (group: string | null) => void;
    setSelectedCategory: (cat: string | null) => void;
}

export const GenderSelection: React.FC<GenderSelectionProps> = ({ setSelectedGender, setView, setSelectedGroup, setSelectedCategory }) => {
    return (
      <div className="pt-32 min-h-screen bg-[#F2F4F3] bg-subtle-grid px-6 md:px-12 pb-24">
          <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
              <h1 className="text-5xl md:text-8xl font-anton font-bold uppercase tracking-wide mb-4">Choose Category</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Select Department</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto h-[60vh]">
              {[
                  { id: 'Men', img: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=1000' },
                  { id: 'Women', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000' },
                  { id: 'Children', img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000' }
              ].map((cat, idx) => (
                  <div 
                    key={cat.id} 
                    onClick={() => { setSelectedGender(cat.id); setView('PRODUCT_LISTING'); setSelectedGroup(null); setSelectedCategory(null); }}
                    className="relative group cursor-pointer overflow-hidden rounded-sm shadow-xl"
                  >
                      <img src={cat.img} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <h2 className="text-4xl font-anton text-white uppercase tracking-wider group-hover:tracking-[0.2em] transition-all duration-500">{cat.id}</h2>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    );
};
