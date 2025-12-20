
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full hover:bg-[#111111] hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Image */}
                <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto bg-[#E8E6E1]">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#488C5C] mb-2">{product.gender}</span>
                    <h2 className="text-3xl font-anton uppercase mb-4">{product.name}</h2>
                    <p className="text-xl font-bold mb-6">${product.price.toFixed(2)}</p>
                    
                    <p className="text-xs text-gray-500 mb-8 leading-relaxed line-clamp-3">{product.description}</p>

                    <div className="space-y-6 mb-8">
                         {/* Size */}
                         <div>
                             <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Size: {size}</span>
                             <div className="flex gap-2">
                                 {product.sizes.map(s => (
                                     <button 
                                        key={s} 
                                        onClick={() => setSize(s)}
                                        className={`w-10 h-10 border text-[10px] font-bold transition-all ${size === s ? 'bg-[#111111] text-white border-[#111111]' : 'bg-transparent text-gray-500 border-gray-200 hover:border-[#111111]'}`}
                                     >
                                         {s}
                                     </button>
                                 ))}
                             </div>
                         </div>
                         
                         {/* Color */}
                         <div>
                             <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Color: {color}</span>
                             <div className="flex gap-2">
                                 {product.colors.map(c => (
                                     <button 
                                        key={c} 
                                        onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full border border-gray-200 transition-all ${color === c ? 'ring-2 ring-offset-2 ring-[#111111]' : 'hover:scale-110'}`}
                                        style={{backgroundColor: c === 'Noir' ? '#111' : c === 'Ecru' ? '#F3F0E6' : c === 'Navy' ? '#000080' : c === 'Olive' ? '#808000' : c === 'Burgundy' ? '#800020' : '#888'}} 
                                     />
                                 ))}
                             </div>
                         </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center border border-gray-200">
                             <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"><Minus size={14}/></button>
                             <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                             <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"><Plus size={14}/></button>
                        </div>
                        <button 
                            onClick={() => { onAddToCart(product, quantity, size, color); onClose(); }}
                            className="flex-1 bg-[#111111] text-white font-bold uppercase tracking-[0.25em] text-[10px] hover:bg-[#488C5C] transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
