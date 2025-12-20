
import React, { useState } from 'react';
import { Product, ViewState } from '../../types';
import { MOCK_PRODUCTS } from '../../constants';
import { ArrowLeft, Minus, Plus, Truck, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../shared/ProductCard';

interface ProductDetailProps {
    selectedProduct: Product | null;
    setView: (view: ViewState) => void;
    addToCart: (product: Product, quantity: number, size: string, color: string) => void;
    setSelectedProduct: (product: Product) => void;
    onQuickView: (e: React.MouseEvent, product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ selectedProduct, setView, addToCart, setSelectedProduct, onQuickView }) => {
    if (!selectedProduct) return null;
    
    const [activeImg, setActiveImg] = useState(selectedProduct.image);
    const [size, setSize] = useState(selectedProduct.sizes[0]);
    const [color, setColor] = useState(selectedProduct.colors[0]);
    const [quantity, setQuantity] = useState(1);
    
    // Ensure gallery has at least main image repeated if empty (fallback)
    const gallery = selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image, selectedProduct.image, selectedProduct.image];

    // Filter Related Products (Same category, different ID)
    const relatedProducts = MOCK_PRODUCTS
        .filter(p => p.group === selectedProduct.group && p.id !== selectedProduct.id)
        .slice(0, 4);

    return (
        <div className="pt-24 min-h-screen bg-[#F2F4F3] bg-subtle-grid pb-24">
             {/* Back Nav */}
             <div className="px-6 md:px-12 mb-8">
                 <button onClick={() => setView('PRODUCT_LISTING')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#111111]">
                     <ArrowLeft size={12} /> Back to Collection
                 </button>
             </div>

             <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                     {/* GALLERY */}
                     <div className="flex flex-col-reverse lg:flex-row gap-6 animate-[fadeIn_0.5s_ease-out]">
                         {/* Thumbnails */}
                         <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                             {gallery.map((img, i) => (
                                 <div 
                                    key={i} 
                                    onClick={() => setActiveImg(img)}
                                    className={`w-20 h-24 flex-shrink-0 cursor-pointer border ${activeImg === img ? 'border-[#111111]' : 'border-transparent'} hover:border-gray-300 transition-all`}
                                 >
                                     <img src={img} className="w-full h-full object-cover" />
                                 </div>
                             ))}
                         </div>
                         {/* Main Image */}
                         <div className="flex-1 aspect-[3/4] bg-[#E8E6E1] overflow-hidden">
                             <img src={activeImg} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                         </div>
                     </div>

                     {/* DETAILS */}
                     <div className="flex flex-col justify-center animate-[fadeIn_0.5s_ease-out_0.2s_forwards] opacity-0">
                         <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c3f235] mb-2">{selectedProduct.gender} / {selectedProduct.category}</span>
                         <h1 className="text-4xl md:text-5xl font-anton font-bold uppercase mb-4 leading-tight">{selectedProduct.name}</h1>
                         <div className="flex items-center gap-4 text-2xl font-bold mb-8">
                             <span>₹{selectedProduct.price.toFixed(2)}</span>
                             {selectedProduct.originalPrice && <span className="text-gray-400 line-through text-lg">₹{selectedProduct.originalPrice.toFixed(2)}</span>}
                         </div>

                         <p className="text-sm text-gray-600 leading-relaxed mb-8">{selectedProduct.description}</p>

                         {/* Selectors */}
                         <div className="space-y-6 mb-8 border-t border-b border-gray-200 py-8">
                             {/* Color */}
                             <div>
                                 <span className="text-[10px] font-bold uppercase tracking-widest block mb-3">Select Color: <span className="text-gray-500">{color}</span></span>
                                 <div className="flex gap-3">
                                     {selectedProduct.colors.map(c => (
                                         <button 
                                            key={c} 
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border border-gray-200 transition-all ${color === c ? 'ring-2 ring-offset-2 ring-[#111111]' : 'hover:scale-110'}`}
                                            style={{backgroundColor: c === 'Noir' ? '#111' : c === 'Ecru' ? '#F3F0E6' : c === 'Navy' ? '#000080' : c === 'Olive' ? '#808000' : c === 'Burgundy' ? '#800020' : '#888'}} 
                                         />
                                     ))}
                                 </div>
                             </div>

                             {/* Size */}
                             <div>
                                 <span className="text-[10px] font-bold uppercase tracking-widest block mb-3">Select Size: <span className="text-gray-500">{size}</span></span>
                                 <div className="flex gap-3">
                                     {selectedProduct.sizes.map(s => (
                                         <button 
                                            key={s} 
                                            onClick={() => setSize(s)}
                                            className={`w-12 h-12 border flex items-center justify-center text-xs font-bold transition-all ${size === s ? 'bg-[#111111] text-white border-[#111111]' : 'bg-transparent text-gray-500 border-gray-200 hover:border-[#111111]'}`}
                                         >
                                             {s}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             {/* Quantity */}
                             <div>
                                 <span className="text-[10px] font-bold uppercase tracking-widest block mb-3">Quantity</span>
                                 <div className="flex items-center border border-gray-200 w-fit">
                                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Minus size={14}/></button>
                                     <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                     <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Plus size={14}/></button>
                                 </div>
                             </div>
                         </div>

                         <button 
                            onClick={() => { addToCart(selectedProduct!, quantity, size, color); setView('CART'); }}
                            className="w-full bg-[#111111] text-white py-5 font-bold uppercase tracking-[0.25em] text-xs hover:bg-[#c3f235] transition-colors shadow-xl mb-6"
                        >
                             Add to Cart
                         </button>

                         {/* Terms */}
                         <div className="bg-white p-6 border border-gray-100 space-y-4">
                             <div className="flex gap-3 items-start">
                                 <Truck size={18} className="text-[#c3f235] mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-[10px] uppercase tracking-widest mb-1">Fast Shipping</h4>
                                     <p className="text-xs text-gray-500">Free delivery on orders over ₹200. Standard shipping 2-3 business days.</p>
                                 </div>
                             </div>
                             <div className="flex gap-3 items-start">
                                 <ShieldCheck size={18} className="text-[#c3f235] mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-[10px] uppercase tracking-widest mb-1">Guarantee</h4>
                                     <p className="text-xs text-gray-500">30-day money-back guarantee. No questions asked returns.</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* RELATED ITEMS */}
                 {relatedProducts.length > 0 && (
                     <div className="border-t border-gray-200 pt-16">
                         <div className="flex items-center gap-4 mb-10">
                            <span className="h-[1px] w-12 bg-[#c3f235]"></span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-[#c3f235] uppercase">You May Also Like</span>
                        </div>
                         <h2 className="text-3xl font-anton uppercase mb-12">Related Items</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                             {relatedProducts.map(product => (
                                 <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onClick={(p) => { setSelectedProduct(p); window.scrollTo({top:0, behavior:'smooth'}); }}
                                    onQuickView={onQuickView}
                                 />
                             ))}
                         </div>
                     </div>
                 )}
             </div>
        </div>
    );
};
