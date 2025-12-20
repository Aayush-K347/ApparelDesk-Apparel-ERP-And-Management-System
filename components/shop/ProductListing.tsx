
import React, { useState } from 'react';
import { Product, ViewState } from '../../types';
import { MOCK_PRODUCTS, NAV_HIERARCHY } from '../../constants';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../shared/ProductCard';

interface ProductListingProps {
    selectedGender: string | null;
    selectedGroup: string | null;
    selectedCategory: string | null;
    setSelectedGroup: (group: string | null) => void;
    setSelectedCategory: (cat: string | null) => void;
    setSelectedProduct: (product: Product) => void;
    setView: (view: ViewState) => void;
    onQuickView: (e: React.MouseEvent, product: Product) => void;
}

export const ProductListing: React.FC<ProductListingProps> = ({ 
    selectedGender, selectedGroup, selectedCategory,
    setSelectedGroup, setSelectedCategory, setSelectedProduct, setView, onQuickView
}) => {
    // Filters State
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [filterSizes, setFilterSizes] = useState<string[]>([]);
    const [filterColors, setFilterColors] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'POPULAR'>('NEWEST');

    // Breadcrumb Logic
    const breadcrumbs = [
        { label: 'Shop', action: () => setView('GENDER_SELECTION') },
        ...(selectedGender ? [{ label: selectedGender, action: () => { setSelectedGroup(null); setSelectedCategory(null); } }] : []),
        ...(selectedGroup ? [{ label: selectedGroup, action: () => setSelectedCategory(null) }] : []),
        ...(selectedCategory ? [{ label: selectedCategory, action: () => {} }] : [])
    ];

    // Filter Logic
    let filteredProducts = MOCK_PRODUCTS.filter(p => {
        if (selectedGender && p.gender !== selectedGender) return false;
        if (selectedGroup && p.group !== selectedGroup) return false;
        if (selectedCategory && p.category !== selectedCategory) return false;
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        if (filterSizes.length > 0 && !p.sizes.some(s => filterSizes.includes(s))) return false;
        if (filterColors.length > 0 && !p.colors.some(c => filterColors.includes(c))) return false;
        return true;
    });

    // Sort Logic
    filteredProducts.sort((a, b) => {
        switch(sortBy) {
            case 'PRICE_LOW': return a.price - b.price;
            case 'PRICE_HIGH': return b.price - a.price;
            case 'POPULAR': return b.popularityScore - a.popularityScore;
            default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    return (
        <div className="pt-24 min-h-screen bg-[#F2F4F3] bg-subtle-grid pb-24">
            {/* Breadcrumbs */}
            <div className="px-6 md:px-12 py-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-20 z-30">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={i}>
                            <span 
                                onClick={crumb.action}
                                className={`cursor-pointer hover:text-[#488C5C] transition-colors ${i === breadcrumbs.length - 1 ? 'text-[#111111]' : ''}`}
                            >
                                {crumb.label}
                            </span>
                            {i < breadcrumbs.length - 1 && <ChevronRight size={10} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-12">
                {/* SIDEBAR FILTERS */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-8 h-fit md:sticky md:top-40">
                    {/* Category Nav */}
                    <div>
                        <h3 className="font-anton text-xl uppercase mb-4">Categories</h3>
                        <div className="space-y-2">
                            {selectedGender && Object.keys(NAV_HIERARCHY[selectedGender as keyof typeof NAV_HIERARCHY]).map(group => (
                                <div key={group}>
                                    <button 
                                        onClick={() => { setSelectedGroup(group); setSelectedCategory(null); }}
                                        className={`text-xs font-bold uppercase tracking-widest w-full text-left py-1 hover:text-[#488C5C] ${selectedGroup === group ? 'text-[#488C5C]' : 'text-gray-500'}`}
                                    >
                                        {group}
                                    </button>
                                    {selectedGroup === group && (
                                        <div className="pl-4 mt-2 space-y-1 border-l border-gray-200">
                                            {(NAV_HIERARCHY[selectedGender as keyof typeof NAV_HIERARCHY] as any)[group].map((cat: string) => (
                                                <button 
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`block text-[10px] uppercase tracking-wider py-1 hover:text-[#111111] ${selectedCategory === cat ? 'text-[#111111] font-bold' : 'text-gray-400'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-anton text-xl uppercase mb-4">Price Range</h3>
                        <input 
                            type="range" min="0" max="300" step="10" 
                            value={priceRange[1]} 
                            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                            className="w-full accent-[#111111]"
                        />
                        <div className="flex justify-between text-xs font-bold mt-2">
                            <span>$0</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-anton text-xl uppercase mb-4">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Noir', 'Ecru', 'Navy', 'Olive', 'Burgundy'].map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setFilterColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                    className={`w-6 h-6 rounded-full border ${filterColors.includes(c) ? 'ring-2 ring-offset-2 ring-[#111111]' : 'border-gray-200'}`}
                                    style={{backgroundColor: c === 'Noir' ? '#111' : c === 'Ecru' ? '#F3F0E6' : c === 'Navy' ? '#000080' : c === 'Olive' ? '#808000' : '#800020'}}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredProducts.length} Products Found</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort By</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent border-b border-gray-300 text-xs font-bold uppercase tracking-widest pb-1 focus:border-[#111111]"
                            >
                                <option value="NEWEST">Newest First</option>
                                <option value="PRICE_LOW">Price: Low to High</option>
                                <option value="PRICE_HIGH">Price: High to Low</option>
                                <option value="POPULAR">Popularity</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {filteredProducts.map((p) => (
                            <ProductCard 
                                key={p.id} 
                                product={p} 
                                onClick={(p) => { setSelectedProduct(p); setView('PRODUCT_DETAIL'); }}
                                onQuickView={onQuickView}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
