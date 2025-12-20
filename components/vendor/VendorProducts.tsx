import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload, Check } from 'lucide-react';

export const VendorProducts: React.FC = () => {
    const [status, setStatus] = useState<'New' | 'Confirmed' | 'Archived'>('New');

    return (
        <div className="p-8 h-full flex flex-col">
            {/* Top Toolbar */}
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div className="flex gap-2">
                    {['New', 'Confirmed', 'Archived'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s as any)}
                            className={`px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                status === s 
                                ? 'bg-[#111111] text-white border-[#111111]' 
                                : 'bg-transparent text-gray-400 border-gray-200 hover:border-[#111111] hover:text-[#111111]'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#488C5C]"></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Published</span>
                    </label>
                    <div className="flex gap-1">
                        <button className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
                        <button className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Form Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Column */}
                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Product Name</label>
                        <input type="text" className="w-full border-b border-gray-200 py-2 text-xl font-display font-bold focus:border-[#111111] transition-colors bg-transparent" placeholder="e.g. Essential Heavyweight Hoodie" />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Category</label>
                            <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option>Shirts & Tops</option>
                                <option>Bottoms</option>
                                <option>Outerwear</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Product Type</label>
                            <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option>Consumable</option>
                                <option>Service</option>
                                <option>Storable Product</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Material</label>
                        <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                            <option>100% Cotton</option>
                            <option>Polyester Blend</option>
                            <option>Denim</option>
                        </select>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Colors</label>
                        <div className="flex flex-wrap gap-3">
                            {['#111111', '#F3F0E6', '#708090', '#488C5C', '#8B4513'].map((color, idx) => (
                                <label key={idx} className="cursor-pointer relative">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-[#111111]" style={{backgroundColor: color}}></div>
                                </label>
                            ))}
                            <button className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center hover:border-[#111111] transition-colors text-gray-400">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="group w-1/2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Current Stock</label>
                        <input type="number" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] transition-colors bg-transparent" placeholder="0" />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Product Images</label>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-20 h-24 border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <Upload size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Pricing */}
                <div className="space-y-8 bg-gray-50 p-8 rounded-xl border border-gray-100">
                    <h3 className="font-anton text-xl tracking-wider mb-6">Pricing</h3>
                    
                    <div className="grid grid-cols-2 gap-8">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Sales Price</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <span className="text-gray-400">$</span>
                                <input type="number" className="w-full py-2 pl-2 text-sm bg-transparent" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Sales Tax</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <input type="number" className="w-full py-2 text-sm bg-transparent" placeholder="0" />
                                <span className="text-gray-400">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Purchase Price</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <span className="text-gray-400">$</span>
                                <input type="number" className="w-full py-2 pl-2 text-sm bg-transparent" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#488C5C] transition-colors">Purchase Tax</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <input type="number" className="w-full py-2 text-sm bg-transparent" placeholder="0" />
                                <span className="text-gray-400">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};