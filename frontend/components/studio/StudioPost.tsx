
import React, { useState } from 'react';
import { StudioPost as StudioPostType, Product, ViewState } from '../../types';
import { MOCK_PRODUCTS } from '../../constants';
import { Heart, Share2, ShoppingBag, BadgeCheck, X, ArrowRight, Tag } from 'lucide-react';

interface StudioPostProps {
    post: StudioPostType;
    setView: (view: ViewState) => void;
    setSelectedProduct: (product: Product) => void;
}

export const StudioPost: React.FC<StudioPostProps> = ({ post, setView, setSelectedProduct }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);
    const [showProducts, setShowProducts] = useState(false);

    // Find products linked to this post
    const linkedProducts = post.productIds.map(id => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
    const displayProducts = linkedProducts.length > 0 ? linkedProducts : MOCK_PRODUCTS.slice(0, 3); 

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="relative group animate-[fadeIn_0.5s_ease-out]">
            {/* Card Container */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-gray-100">
                
                {/* Image Section */}
                <div 
                    className="relative cursor-pointer overflow-hidden" 
                    onClick={() => setShowProducts(true)}
                >
                    <img 
                        src={post.mediaUrl} 
                        alt="Look" 
                        className="w-full h-auto block object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-90 transition-opacity duration-300"></div>

                    {/* Top Creator Badge */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                         <div className="flex items-center gap-2 backdrop-blur-md bg-black/20 p-1.5 rounded-full pr-4 border border-white/10">
                            <img 
                                src={post.creator.avatar} 
                                alt={post.creator.name} 
                                className="w-8 h-8 rounded-full border border-white/20 object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-[10px] tracking-wide flex items-center gap-1">
                                    {post.creator.name}
                                    {post.creator.isVerified && <BadgeCheck size={10} className="text-[#488C5C] fill-white" />}
                                </span>
                            </div>
                         </div>
                    </div>

                    {/* Bottom Info Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-xs font-medium leading-relaxed line-clamp-2 mb-4 drop-shadow-md">
                            {post.caption}
                        </p>
                        
                        <div className="flex justify-between items-end">
                            {/* Floating Shop Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowProducts(true); }}
                                className="bg-white text-[#111111] pl-3 pr-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#488C5C] hover:text-white transition-all duration-300 shadow-lg group/btn"
                            >
                                <div className="bg-[#111111] text-white rounded-full p-1 group-hover/btn:bg-white group-hover/btn:text-[#488C5C] transition-colors">
                                    <ShoppingBag size={12} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Shop ({displayProducts.length})</span>
                            </button>

                            {/* Interactions */}
                            <div className="flex gap-2">
                                <button onClick={handleLike} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-red-500 transition-all text-white group/heart">
                                    <Heart size={16} className={`transition-transform duration-300 group-hover/heart:scale-125 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white">
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Shop Indication Tag (Aesthetic Touch) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                         <Tag size={20} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Slide-Up Product Drawer */}
            <div 
                className={`fixed inset-0 z-50 flex flex-col justify-end transition-visibility duration-500 ${showProducts ? 'visible' : 'invisible'}`}
            >
                <div 
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showProducts ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setShowProducts(false)}
                ></div>
                
                <div 
                    className={`relative bg-[#F2F4F3] rounded-t-[32px] overflow-hidden shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${showProducts ? 'translate-y-0' : 'translate-y-full'}`}
                    style={{ maxHeight: '85vh' }}
                >
                    <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10 flex justify-between items-center">
                         <div>
                             <h3 className="font-anton text-2xl uppercase tracking-wide">Shop The Look</h3>
                             <p className="text-[10px] text-gray-400 uppercase tracking-widest">Curated by {post.creator.name}</p>
                         </div>
                         <button onClick={() => setShowProducts(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                             <X size={16} />
                         </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                        {displayProducts.map((product) => (
                            <div 
                                key={product.id}
                                onClick={() => { setSelectedProduct(product); setView('PRODUCT_DETAIL'); }}
                                className="bg-white p-3 rounded-2xl flex gap-4 cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-gray-200 group/item"
                            >
                                <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={product.image} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{product.name}</h4>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.vendor}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 -rotate-45 group-hover/item:rotate-0 group-hover/item:text-[#488C5C] transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className="font-anton text-lg">₹{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-gray-300 line-through">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white border-t border-gray-200">
                         <button 
                            onClick={() => { setShowProducts(false); setView('PRODUCT_LISTING'); }}
                            className="w-full bg-[#111111] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#488C5C] transition-colors shadow-lg"
                        >
                             View All Products
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
