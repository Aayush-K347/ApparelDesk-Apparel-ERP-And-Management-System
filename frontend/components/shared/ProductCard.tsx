
import React from 'react';
import { Product } from '../../types';
import { Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    onQuickView: (e: React.MouseEvent, product: Product) => void;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onQuickView, className = '' }) => {
    return (
        <div 
            onClick={() => onClick(product)}
            className={`group cursor-pointer animate-[fadeIn_0.5s_ease-out] relative ${className}`}
        >
            <div className="relative overflow-hidden aspect-[3/4] bg-[#E8E6E1] mb-4">
                <img 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    alt={product.name}
                    loading="lazy"
                />
                
                {/* Sale Tag */}
                {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-[#111111] text-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest z-10">Sale</div>
                )}

                {/* Quick View Button - Appears on Hover */}
                <button 
                    onClick={(e) => onQuickView(e, product)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-[#111111] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#111111] hover:text-white shadow-lg z-20"
                    title="Quick View"
                >
                    <Eye size={18} strokeWidth={1.5} />
                </button>
            </div>
            
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-[#488C5C] transition-colors truncate">{product.name}</h3>
                <div className="flex gap-3 text-xs">
                    <span className="font-bold">₹{product.price.toFixed(2)}</span>
                    {product.originalPrice && <span className="text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>}
                </div>
            </div>
        </div>
    );
};
