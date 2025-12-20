
import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Minus, Plus } from 'lucide-react';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    const [size, setSize] = useState(product.sizes[0]);
    const [color, setColor] = useState(product.colors[0]);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with heavy blur for focus */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row rounded-xl overflow-hidden z-[10000]">
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-[#111111] hover:text-white transition-colors border border-black/10"
                >
                    <X size={20} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 relative bg-[#E8E6E1]">
                    <img 
                        src={product.image} 
                        className="w-full h-full object-cover aspect-[3/4] md:aspect-auto" 
                        alt={product.name} 
                    />
                    {/* Floating Product Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                        {product.vendor}
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-[#c3f235] rounded-full"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{product.gender} Collection</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-anton uppercase mb-4 leading-none">{product.name}</h2>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-bold">₹{product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-gray-400 line-through text-lg">₹{product.originalPrice.toFixed(2)}</span>
                            )}
                            {product.popularityScore > 80 && (
                                <span className="text-[9px] font-bold bg-[#111111] text-white px-2 py-1 uppercase tracking-wider">Trending</span>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed line-clamp-4">{product.description}</p>
                    </div>

                    <div className="space-y-8">
                         {/* Selectors Row */}
                         <div className="grid grid-cols-2 gap-8">
                             <div>
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Size</span>
                                 <div className="flex flex-wrap gap-2">
                                     {product.sizes.map(s => (
                                         <button 
                                            key={s} 
                                            onClick={() => setSize(s)}
                                            className={`min-w-[40px] h-10 px-2 border text-[10px] font-bold transition-all duration-200 ${
                                                size === s 
                                                ? 'bg-[#111111] text-white border-[#111111]' 
                                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-[#111111]'
                                            }`}
                                         >
                                             {s}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             
                             <div>
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Color</span>
                                 <div className="flex gap-3">
                                     {product.colors.map(c => (
                                         <button 
                                            key={c} 
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border transition-all duration-200 relative ${
                                                color === c 
                                                ? 'ring-2 ring-offset-2 ring-[#111111] border-transparent scale-110' 
                                                : 'border-gray-200 hover:scale-110'
                                            }`}
                                            style={{backgroundColor: c === 'Noir' ? '#111' : c === 'Ecru' ? '#F3F0E6' : c === 'Navy' ? '#000080' : c === 'Olive' ? '#808000' : c === 'Burgundy' ? '#800020' : '#888'}} 
                                         />
                                     ))}
                                 </div>
                             </div>
                         </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center border border-gray-200 h-14">
                                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={14}/></button>
                                 <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                                 <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={14}/></button>
                            </div>
                            <button 
                                onClick={() => { onAddToCart(product, quantity, size, color); onClose(); }}
                                className="flex-1 bg-[#111111] text-white font-bold uppercase tracking-[0.25em] text-[10px] hover:bg-[#c3f235] transition-all duration-300 shadow-xl"
                            >
                                Add to Bag — ₹{(product.price * quantity).toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
