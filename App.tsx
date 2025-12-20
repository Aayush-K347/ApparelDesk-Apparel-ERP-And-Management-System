
import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem, Coupon, UserOrder } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { VendorDashboard } from './components/VendorDashboard';
import { ShoppingBag, Check } from 'lucide-react';

// New Components
import { Hero } from './components/shop/Hero';
import { GenderSelection } from './components/shop/GenderSelection';
import { ProductListing } from './components/shop/ProductListing';
import { ProductDetail } from './components/shop/ProductDetail';
import { Cart } from './components/shop/Cart';
import { UserProfile } from './components/user/UserProfile';
import { VendorLogin } from './components/auth/VendorLogin';
import { UserAuth } from './components/auth/UserAuth';
import { QuickViewModal } from './components/shared/QuickViewModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  
  // Navigation State
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{ show: boolean; message: string; subtext?: string; image?: string }>({ 
      show: false, 
      message: '', 
      subtext: '' 
  });

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view, selectedGender, selectedGroup, selectedCategory]);

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id && p.selectedSize === size && p.selectedColor === color);
      if (existing) {
        return prev.map(p => p.id === product.id && p.selectedSize === size && p.selectedColor === color ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });

    // Trigger Notification
    setNotification({ 
        show: true, 
        message: 'Added to Bag', 
        subtext: `${quantity} x ${product.name}`,
        image: product.image 
    });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
      e.stopPropagation(); // Prevent navigation to PDP
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
  };

  const handleUserLogin = () => {
      setIsAuthenticated(true);
      setView('USER_PROFILE');
  };

  return (
    <div className="font-sans antialiased text-[#111111] selection:bg-[#488C5C] selection:text-white relative">
      {view !== 'VENDOR_LOGIN' && view !== 'VENDOR_DASHBOARD' && view !== 'CHECKOUT' && view !== 'ORDER_SUCCESS' && view !== 'USER_AUTH' && (
        <Navigation 
            cartCount={cart.length} 
            setView={setView} 
            isTransparent={view === 'LANDING'}
            isAuthenticated={isAuthenticated}
        />
      )}

      {/* Simplified Header for Checkout */}
      {(view === 'CHECKOUT' || view === 'ORDER_SUCCESS') && (
        <header className="fixed top-0 w-full z-50 py-6 px-6 md:px-12 flex justify-center bg-[#F2F4F3]/90 backdrop-blur-md border-b border-[#111111]/5">
            <h1 className="font-anton font-bold text-2xl tracking-[0.3em] cursor-pointer" onClick={() => setView('LANDING')}>LUVARTE</h1>
        </header>
      )}

      {view === 'LANDING' && (
          <Hero 
            setView={setView} 
            setSelectedGender={setSelectedGender} 
            setSelectedProduct={setSelectedProduct}
            onQuickView={handleQuickView}
          />
      )}

      {view === 'GENDER_SELECTION' && (
          <>
            <GenderSelection 
                setSelectedGender={setSelectedGender} 
                setView={setView} 
                setSelectedGroup={setSelectedGroup} 
                setSelectedCategory={setSelectedCategory} 
            />
            <Footer />
          </>
      )}

      {view === 'PRODUCT_LISTING' && (
          <>
            <ProductListing 
                selectedGender={selectedGender}
                selectedGroup={selectedGroup}
                selectedCategory={selectedCategory}
                setSelectedGroup={setSelectedGroup}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                setView={setView}
                onQuickView={handleQuickView}
            />
            <Footer />
          </>
      )}

      {view === 'PRODUCT_DETAIL' && (
        <>
            <ProductDetail 
                selectedProduct={selectedProduct}
                setView={setView}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
                onQuickView={handleQuickView}
            />
            <Footer />
        </>
      )}

      {view === 'CART' && (
          <>
            <Cart 
                cart={cart}
                setCart={setCart}
                setView={setView}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
            />
            <Footer />
          </>
      )}

      {view === 'USER_PROFILE' && (
          <>
            <UserProfile 
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
            />
            <Footer />
          </>
      )}
      
      {view === 'USER_AUTH' && (
          <UserAuth setView={setView} onLogin={handleUserLogin} />
      )}

      {view === 'VENDOR_LOGIN' && <VendorLogin setView={setView} />}
      
      {view === 'VENDOR_DASHBOARD' && (
        <VendorDashboard setView={setView} />
      )}

      {/* Toast Notification */}
      <div className={`fixed top-24 right-6 md:right-12 z-[100] transition-all duration-500 ease-out transform ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="bg-[#111111] text-white p-4 pr-6 flex items-center gap-4 shadow-2xl border border-white/10 min-w-[300px]">
              {notification.image ? (
                  <img src={notification.image} className="w-10 h-12 object-cover bg-gray-800" />
              ) : (
                  <div className="w-10 h-12 bg-white/10 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-white" />
                  </div>
              )}
              <div className="flex-1">
                  <h4 className="font-anton uppercase tracking-wider text-sm flex items-center gap-2">
                      {notification.message}
                      <Check size={14} className="text-[#488C5C]" />
                  </h4>
                  {notification.subtext && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 truncate max-w-[200px]">{notification.subtext}</p>
                  )}
              </div>
          </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={addToCart}
      />

    </div>
  );
};

export default App;
