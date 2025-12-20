
import React from 'react';
import { ViewState } from '../../types';
import { ArrowLeft } from 'lucide-react';

interface GenderSelectionProps {
    setSelectedGender: (gender: string) => void;
    setView: (view: ViewState) => void;
    setSelectedGroup: (group: string | null) => void;
    setSelectedCategory: (cat: string | null) => void;
}

export const GenderSelection: React.FC<GenderSelectionProps> = ({ setSelectedGender, setView, setSelectedGroup, setSelectedCategory }) => {
    return (
      <div className="pt-32 min-h-screen bg-[#F2F4F3] bg-subtle-grid px-6 md:px-12 pb-24">
          {/* Back Button */}
          <div className="mb-8 animate-[fadeIn_0.3s_ease-out]">
              <button onClick={() => setView('LANDING')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#111111] transition-colors">
                  <ArrowLeft size={12} /> Back to Home
              </button>
          </div>

          <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
              <h1 className="text-5xl md:text-8xl font-anton font-bold uppercase tracking-wide mb-4">Choose Category</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Select Department</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto h-[60vh]">
              {[
                  { id: 'Men', img: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
                  { id: 'Women', img: 'https://plus.unsplash.com/premium_photo-1689371957762-b5f8d601933e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
                  { id: 'Children', img: 'https://plus.unsplash.com/premium_photo-1682097392622-1fe359c57ed5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
              ].map((cat, idx) => (
                  <div 
                    key={cat.id} 
                    onClick={() => { setSelectedGender(cat.id); setView('PRODUCT_LISTING'); setSelectedGroup(null); setSelectedCategory(null); }}
                    className="relative group cursor-pointer overflow-hidden rounded-sm shadow-xl h-[60vh]"
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
