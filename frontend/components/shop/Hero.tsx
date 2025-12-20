
import React, { useEffect, useRef } from 'react';
import { ViewState, Product } from '../../types';
import { ArrowRight, Gem, Star, ArrowUpRight } from 'lucide-react';

interface HeroProps {
    setView: (view: ViewState) => void;
    setSelectedGender: (gender: string) => void;
    setSelectedProduct: (product: Product) => void;
    onQuickView: (e: React.MouseEvent, product: Product) => void;
    products: Product[];
}

export const Hero: React.FC<HeroProps> = ({ setView, setSelectedGender, setSelectedProduct, products }) => {

  // Hook for intersection observer animation
  const useIntersectionObserver = (ref: React.RefObject<HTMLDivElement>) => {
      useEffect(() => {
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      entry.target.classList.add('opacity-100', 'translate-y-0');
                      entry.target.classList.remove('opacity-0', 'translate-y-20');
                  }
              });
          }, { threshold: 0.1 });

          if (ref.current) observer.observe(ref.current);
          return () => observer.disconnect();
      }, [ref]);
  };

  const FadeInSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
      const ref = useRef<HTMLDivElement>(null);
      useIntersectionObserver(ref);
      return (
          <div ref={ref} className={`transition-all duration-1000 ease-out opacity-0 translate-y-20 ${className}`}>
              {children}
          </div>
      );
  };

  const HeaderSection = () => (
    <header className="relative w-full h-screen bg-[#111111] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-60">
            <img 
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" 
              className="w-full h-full object-cover scale-105 animate-[kenburns_30s_infinite_alternate]" 
            />
        </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/10 to-[#111111]/30"></div>
      
      <div className="relative z-10 text-center text-[#F2F4F3] px-4 flex flex-col items-center">
        <div className="overflow-hidden mb-8">
             <h2 className="text-xs md:text-sm font-bold tracking-[0.8em] uppercase animate-[slideUp_1.5s_ease-out]">Spring / Summer 2024</h2>
        </div>
        <h1 className="text-[15vw] md:text-[14vw] font-anton leading-[0.8] tracking-tight text-white uppercase mix-blend-overlay opacity-90 animate-[fadeIn_2s_ease-out]">
          LUVARTE
        </h1>
        
        <div className="mt-16 flex flex-col items-center gap-4 opacity-0 animate-[fadeIn_2s_ease-out_1s_forwards]">
            <button 
                onClick={() => setView('GENDER_SELECTION')}
                className="group relative px-16 py-6 overflow-hidden bg-[#F2F4F3] text-[#111111] transition-all duration-500 hover:scale-105"
            >
                <span className="relative text-xs font-bold uppercase tracking-[0.4em]">
                    Enter Atelier
                </span>
            </button>
        </div>
      </div>
    </header>
  );

  const DecorativeOverlay = ({ category, index }: { category: string, index: number }) => (
    <div className="absolute inset-0 pointer-events-none p-6 md:p-12 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/90 uppercase border border-white/20 px-3 py-1 bg-black/20 backdrop-blur-sm shadow-sm">
                No. {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center animate-[spin_12s_linear_infinite] opacity-80 mix-blend-difference">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-white drop-shadow-md">
                    <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                    <text fontSize="13" fontWeight="bold" letterSpacing="4">
                        <textPath href="#curve">LUVARTE • EST. 2024 •</textPath>
                    </text>
                 </svg>
            </div>
        </div>
    </div>
  );

  const ProductSection = ({ title, category, heroImage, layout = 'split', index = 0, description = "" }: { title: string, category: string, heroImage: string, layout?: 'split' | 'centered', index?: number, description?: string }) => {
    if (layout === 'split') {
        const reverse = index % 2 !== 0;
        return (
            <section className={`min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F2F4F3] bg-subtle-grid overflow-hidden`}>
                {/* Image Side */}
                <div className={`relative h-[60vh] md:h-screen ${reverse ? 'md:order-2' : ''} overflow-hidden group`}>
                    <img 
                        src={heroImage} 
                        className="w-full h-full object-cover transition-transform duration-[2.5s] ease-in-out group-hover:scale-105 grayscale-[10%] group-hover:grayscale-0" 
                        alt={category} 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                    <DecorativeOverlay category={category} index={index} />
                </div>

                {/* Content Side */}
                <div className={`flex flex-col justify-center items-center text-center px-8 md:px-24 py-16 ${reverse ? 'md:order-1' : ''} relative`}>
                    {/* Background Big Number */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] leading-none font-anton text-[#111111]/[0.03] select-none pointer-events-none z-0">
                        0{index + 1}
                    </div>

                    <FadeInSection className="relative z-10 max-w-lg">
                        <div className="flex flex-col items-center gap-4 mb-10">
                            <span className="h-12 w-[1px] bg-[#111111]"></span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-[#111111] uppercase">Collection 0{index + 1}</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-anton uppercase leading-[0.85] tracking-tight mb-8 text-[#111111]">
                            {title}
                        </h2>
                        <p className="text-[#111111]/60 mb-12 leading-8 text-sm font-sans font-medium tracking-wide max-w-sm mx-auto">
                            {description || `Redefining the standard of luxury with our ${category.toLowerCase()} collection. Impeccable tailoring meets contemporary silhouette.`}
                        </p>
                        <button 
                            onClick={() => { setSelectedGender('Men'); setView('PRODUCT_LISTING'); }}
                            className="group flex items-center gap-4 border-b border-[#111111] pb-1 text-xs font-bold tracking-[0.3em] uppercase hover:text-[#488C5C] hover:border-[#488C5C] transition-all duration-300"
                        >
                            View Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </FadeInSection>
                </div>
            </section>
        );
    }
    return null;
  };

  const LogoMarquee = () => {
      const brands = ["BALENCIAGA", "GUCCI", "PRADA", "LOUIS VUITTON", "BURBERRY", "VERSACE", "DIOR", "SAINT LAURENT", "LUVARTE"];
      return (
          <div className="relative py-32 bg-[#F2F4F3] overflow-hidden flex items-center justify-center min-h-[50vh]">
               {/* Restriction Lines */}
               <div className="absolute inset-0 flex items-center justify-center">
                   {/* Line 1 - Rotated */}
                   <div className="w-[120%] h-24 bg-[#111111] rotate-[-5deg] flex items-center overflow-hidden absolute border-y-4 border-[#F2F4F3] shadow-2xl z-10">
                       <div className="flex animate-marquee whitespace-nowrap">
                           {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                               <div key={i} className="flex items-center mx-8">
                                   <Star size={16} className="text-[#488C5C] mx-4" fill="#488C5C" />
                                   <span className="text-4xl font-anton text-[#F2F4F3] tracking-widest uppercase">{brand}</span>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Line 2 - Rotated Opposite */}
                   <div className="w-[120%] h-20 bg-[#488C5C] rotate-[3deg] flex items-center overflow-hidden absolute border-y-4 border-[#F2F4F3] shadow-xl z-0">
                       <div className="flex animate-marqueeReverse whitespace-nowrap">
                            {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                               <div key={i} className="flex items-center mx-8">
                                   <span className="text-2xl font-anton text-[#111111] tracking-widest uppercase opacity-80">{brand}</span>
                                   <div className="w-2 h-2 bg-[#111111] rounded-full mx-6"></div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
          </div>
      );
  };

  const NewArrivalsMarquee = () => {
    const latestProducts = products.slice(0, 8);

    return (
        <section className="py-24 bg-[#111111] overflow-hidden border-t border-white/5 relative z-20">
            <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
                <h2 className="text-5xl md:text-8xl font-anton text-[#F2F4F3] uppercase tracking-wide opacity-20">New Arrivals</h2>
                <div className="hidden md:flex items-center gap-2 text-[#488C5C] text-[10px] font-bold uppercase tracking-widest">
                    Swipe <ArrowRight size={14} />
                </div>
            </div>
            
            <div className="flex w-full overflow-hidden relative">
                <div className="flex animate-infiniteScroll w-max hover:[animation-play-state:paused]">
                    {/* Double the list for infinite effect */}
                    {[...latestProducts, ...latestProducts, ...latestProducts].map((product, idx) => (
                        <div 
                            key={`${product.id}-${idx}`} 
                            onClick={() => { setSelectedProduct(product); setView('PRODUCT_DETAIL'); }}
                            className="w-[300px] h-[450px] mx-4 relative group cursor-pointer flex-shrink-0"
                        >
                            <div className="w-full h-full overflow-hidden bg-gray-800">
                                <img 
                                    src={product.image} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0" 
                                    alt={product.name}
                                />
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            
                            <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <h3 className="text-white font-anton text-xl uppercase tracking-wide mb-1 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#488C5C] font-bold">${product.price}</p>
                                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white">
                                        <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute top-4 right-4 bg-[#488C5C] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                New
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
  };

  return (
    <>
        <HeaderSection />
        
        <ProductSection 
            title="Essential Tees" 
            category="T-Shirts" 
            heroImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"
            layout="split" 
            index={0} 
        />
        
        <ProductSection 
            title="Modern Trousers" 
            category="Bottomwear" 
            heroImage="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1780&auto=format&fit=crop"
            layout="split" 
            index={1} 
        />
        
        <ProductSection 
            title="Heavyweight Fleece" 
            category="Hoodies" 
            heroImage="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1780&auto=format&fit=crop"
            layout="split" 
            index={2} 
        />

        <ProductSection 
            title="Timeless Luxuries" 
            category="Accessories" 
            heroImage="https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1780&auto=format&fit=crop"
            layout="split" 
            index={3} 
            description="Exquisite timepieces and signature fragrances. Curated for those who appreciate the finer details in life."
        />

        {/* New Arrivals Continuous Scroll */}
        <NewArrivalsMarquee />

        {/* Crossed Restriction Lines Marquee */}
        <LogoMarquee />

        <div className="bg-[#111111] text-white py-32 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#488C5C] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
             <div className="relative z-10">
                <Gem size={48} className="mx-auto mb-8 text-[#488C5C]" />
                <h2 className="text-5xl md:text-7xl font-anton uppercase tracking-widest mb-8">Elevate Your Style</h2>
                <p className="max-w-md mx-auto text-gray-400 mb-12 text-sm tracking-widest leading-relaxed">
                    Join the exclusive list of individuals who understand that style is not just what you wear, but how you live.
                </p>
                <button onClick={() => setView('GENDER_SELECTION')} className="text-sm font-bold uppercase tracking-[0.3em] border border-white px-12 py-4 hover:bg-white hover:text-[#111111] transition-all duration-500">
                    Begin Shopping
                </button>
            </div>
        </div>
    </>
  );
};
