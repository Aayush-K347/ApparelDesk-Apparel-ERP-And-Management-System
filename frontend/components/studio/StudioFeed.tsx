
import React, { useState, useMemo } from 'react';
import { ViewState, Product } from '../../types';
import { MOCK_STUDIO_POSTS } from '../../constants';
import { StudioPost } from './StudioPost';
import { Camera, Sparkles, Zap, Trophy, UserCheck, ArrowLeft } from 'lucide-react';

interface StudioFeedProps {
    setView: (view: ViewState) => void;
    setSelectedProduct: (product: Product) => void;
}

export const StudioFeed: React.FC<StudioFeedProps> = ({ setView, setSelectedProduct }) => {
    const [activeFilter, setActiveFilter] = useState('ALL');

    // Robust Filtering Logic
    const filteredPosts = useMemo(() => {
        switch(activeFilter) {
            case 'VERIFIED':
                return MOCK_STUDIO_POSTS.filter(post => post.creator.isVerified);
            case 'TRENDING':
                // Simulate trending logic: Recent posts or high engagement relative to age
                // For mock: Posts with > 1000 likes
                return MOCK_STUDIO_POSTS.filter(post => post.likes > 1000);
            case 'TOP':
                // Sort by likes descending
                return [...MOCK_STUDIO_POSTS].sort((a, b) => b.likes - a.likes);
            case 'ALL':
            default:
                return MOCK_STUDIO_POSTS;
        }
    }, [activeFilter]);

    return (
        <div className="min-h-screen bg-[#F2F4F3] bg-subtle-grid pb-32 relative">
            
            {/* Back Button */}
            <div className="absolute top-28 left-6 md:left-12 z-20">
                <button onClick={() => setView('LANDING')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#111111] transition-colors">
                    <ArrowLeft size={12} /> Back to Home
                </button>
            </div>

            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#488C5C]/5 rounded-full blur-[150px]"></div>
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#111111]/5 rounded-full blur-[150px]"></div>
            </div>

            {/* Editorial Header */}
            <div className="relative pt-32 pb-16 text-center px-6 z-10">
                 <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-[#111111]/10 rounded-full bg-white/60 backdrop-blur-md shadow-sm">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#488C5C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#488C5C]"></span>
                     </span>
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]">LUVARTE Studio</span>
                 </div>
                 
                 <h1 className="text-[15vw] md:text-[10vw] font-anton leading-[0.8] text-[#111111] uppercase tracking-tighter mb-8 animate-[fadeIn_0.8s_ease-out]">
                     Inspiration
                 </h1>
                 
                 <div className="max-w-xl mx-auto">
                     <p className="text-sm font-medium text-gray-500 leading-relaxed tracking-wide">
                         A living moodboard of global style. Discover how our community wears Luvarte. 
                         <br className="hidden md:block"/> Shop the looks directly from the feed.
                     </p>
                 </div>
            </div>

            {/* Sticky Filter Bar */}
            <div className="sticky top-[88px] z-40 bg-[#F2F4F3]/95 backdrop-blur-xl border-y border-[#111111]/5 py-4 mb-12 shadow-sm transition-all">
                <div className="container mx-auto px-6 overflow-x-auto no-scrollbar flex justify-center gap-2 md:gap-4">
                     {[
                         { id: 'ALL', label: 'For You', icon: Sparkles },
                         { id: 'TRENDING', label: 'Trending', icon: Zap },
                         { id: 'VERIFIED', label: 'Verified Creators', icon: UserCheck },
                         { id: 'TOP', label: 'Top Looks', icon: Trophy }
                     ].map((filter) => (
                         <button
                            key={filter.id}
                            onClick={() => { setActiveFilter(filter.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border
                                ${activeFilter === filter.id 
                                    ? 'bg-[#111111] text-white border-[#111111] shadow-lg transform scale-105' 
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-[#111111] hover:text-[#111111]'
                                }
                            `}
                         >
                             <filter.icon size={12} className={activeFilter === filter.id ? 'text-[#488C5C]' : ''} />
                             <span className="whitespace-nowrap">{filter.label}</span>
                         </button>
                     ))}
                </div>
            </div>

            {/* Masonry Feed Grid */}
            <div className="container mx-auto px-4 md:px-8 relative z-10 min-h-[50vh]">
                {filteredPosts.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="break-inside-avoid animate-[fadeIn_0.5s_ease-out]">
                                <StudioPost 
                                    post={post} 
                                    setView={setView} 
                                    setSelectedProduct={setSelectedProduct} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Camera size={48} className="text-gray-300 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No posts found for this filter</p>
                    </div>
                )}
            </div>

            {/* Bottom Interaction Area */}
            <div className="relative z-20 mt-24 text-center pb-24">
                <div className="inline-block p-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full mb-8">
                     <button className="bg-[#111111] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group">
                         <Camera size={28} className="group-hover:rotate-12 transition-transform duration-300" />
                     </button>
                </div>
                <h3 className="font-anton text-3xl uppercase mb-2">Share Your Style</h3>
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-8">Tag @luvarte_paris to be featured</p>
                <button className="border-b border-[#111111] pb-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#488C5C] hover:border-[#488C5C] transition-colors">
                    Join Creator Program
                </button>
            </div>
        </div>
    );
};
