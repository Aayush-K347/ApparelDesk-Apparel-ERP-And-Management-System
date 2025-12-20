
import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem, Coupon, SalesOrderResponse, Address } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { VendorDashboard } from './components/VendorDashboard';
import { ShoppingBag, Check } from 'lucide-react';
import { ENABLE_STUDIO } from './constants';
import { fetchProducts, fetchProductsByUrl, validateCoupon, loginUser, registerUser, registerVendor, fetchProfile, checkoutOrder, createPayment, clearTokens, fetchAddresses, fetchOrders, fetchCart, saveCart } from './api';

// New Components
import { Hero } from './components/shop/Hero';
import { GenderSelection } from './components/shop/GenderSelection';
import { ProductListing } from './components/shop/ProductListing';
import { ProductDetail } from './components/shop/ProductDetail';
import { Cart } from './components/shop/Cart';
import { Checkout } from './components/shop/Checkout';
import { OrderSuccess } from './components/shop/OrderSuccess';
import { UserProfile } from './components/user/UserProfile';
import { VendorLogin } from './components/auth/VendorLogin';
import { UserAuth } from './components/auth/UserAuth';
import { QuickViewModal } from './components/shared/QuickViewModal';
import { StudioFeed } from './components/studio/StudioFeed';
import ClickSpark from './components/shared/ClickSpark';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  
  // Navigation State
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderResponse | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contactId, setContactId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<SalesOrderResponse[]>([]);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [nextProductsUrl, setNextProductsUrl] = useState<string | null>(null);

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

  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const { items, next } = await fetchProducts();
        setProducts(items);
        setNextProductsUrl(next);
        setProductError(null);
      } catch (err) {
        setProductError('Unable to load products. Please refresh.');
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const loadMoreProducts = async () => {
    if (!nextProductsUrl) return;
    setIsLoadingProducts(true);
    try {
      const { items, next } = await fetchProductsByUrl(nextProductsUrl);
      setProducts(prev => [...prev, ...items]);
      setNextProductsUrl(next);
    } catch (err) {
      setProductError('Unable to load more products.');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchProfile();
        setContactId(profile.contact_id);
        setUserRole(profile.user_role);
        setIsAuthenticated(true);
        await Promise.all([loadAddresses(), loadOrders(), loadCartFromBackend()]);
      } catch (err) {
        setIsAuthenticated(false);
        setContactId(null);
        setUserRole(null);
        setAddresses([]);
        setOrders([]);
        setCart([]);
      }
    }
    loadProfile();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } catch (err) {
      // ignore for now
    }
  };

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      // ignore for now
    }
  };

  const mapCartItemFromBackend = (item: any): CartItem => {
    const productId = item.product;
    const detail = item.product_detail || {};
    return {
      id: `prod_${productId}`,
      backendId: productId,
      name: detail.name || 'Product',
      gender: 'Men',
      group: 'Topwear',
      category: detail.code || '',
      price: Number(detail.price || 0),
      image: detail.image || '',
      images: detail.image ? [detail.image] : [],
      description: '',
      sku: detail.code || '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [item.selected_color || 'Default'],
      material: 'Cotton',
      vendor: 'LUVARTE',
      reviews: [],
      popularityScore: 0,
      createdAt: new Date().toISOString(),
      quantity: Number(item.quantity || 0),
      selectedSize: item.selected_size || 'M',
      selectedColor: item.selected_color || 'Default',
    };
  };

  const loadCartFromBackend = async () => {
    try {
      const data = await fetchCart();
      const mapped = Array.isArray(data.items) ? data.items.map(mapCartItemFromBackend) : [];
      setCart(mapped);
    } catch (err) {
      // ignore loading cart errors
    }
  };

  const persistCart = async (items: CartItem[]) => {
    if (!isAuthenticated) return;
    try {
      const payload = items.map(item => ({
        product_id: item.backendId || parseInt(item.id.replace('prod_', ''), 10),
        quantity: item.quantity,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
      }));
      await saveCart(payload);
    } catch (err) {
      // ignore save errors for now
    }
  };

  const updateCart = (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCart(prev => {
      const next = typeof updater === 'function' ? (updater as (p: CartItem[]) => CartItem[])(prev) : updater;
      persistCart(next);
      return next;
    });
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    updateCart(prev => {
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

  const handlePlaceOrder = async (shipping: { email: string; firstName: string; lastName: string; address: string; city: string; postalCode: string; }) => {
      if (!isAuthenticated || !contactId) {
        alert('Please sign in before checkout.');
        setView('USER_AUTH');
        return;
      }
      if (!cart.length) return;
      try {
        const lines = cart.map((item, idx) => ({
          product_id: item.backendId || parseInt(item.id.replace('prod_', ''), 10),
          quantity: item.quantity,
          unit_price: item.price,
          tax_percentage: 0,
          line_number: idx + 1,
        }));

        const { order, invoice } = await checkoutOrder({
          payment_term_id: 1,
          coupon_code: appliedCoupon?.code,
          shipping_address_line1: shipping.address,
          shipping_city: shipping.city,
          shipping_state: '',
          shipping_pincode: shipping.postalCode,
          lines,
        });

        await createPayment(invoice.customer_invoice_id, invoice.total_amount);

        updateCart(() => []); // Clear cart
        setAppliedCoupon(null);
        setCouponCode('');
        await loadOrders();
        setView('ORDER_SUCCESS');
      } catch (err) {
        alert('Checkout failed. Please try again.');
      }
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
      e.stopPropagation(); // Prevent navigation to PDP
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
  };

  const handleApplyCoupon = async (code: string) => {
      const coupon = await validateCoupon(code);
      if (coupon) {
          setAppliedCoupon(coupon);
      } else {
          setAppliedCoupon(null);
      }
  };

  const handleUserLogin = async (email: string, password: string, fullName?: string, mode: 'login' | 'register' = 'login', isVendor?: boolean) => {
      try {
        if (mode === 'register') {
          if (isVendor) {
            await registerVendor({ email, password, fullName: fullName || email });
          } else {
            await registerUser({ email, password, fullName: fullName || email });
          }
        }
        await loginUser({ email, password });
        const profile = await fetchProfile();
        setContactId(profile.contact_id);
        setUserRole(profile.user_role);
        setIsAuthenticated(true);
        if (isVendor) {
          setView('VENDOR_DASHBOARD');
        } else {
          setView('USER_PROFILE');
        }
        await Promise.all([loadAddresses(), loadOrders(), loadCartFromBackend()]);
      } catch (err) {
        alert('Authentication failed. Please check your details.');
      }
  };

  const handleLogout = () => {
      clearTokens();
      setIsAuthenticated(false);
      setContactId(null);
      setUserRole(null);
      setCart([]);
      setView('LANDING');
  };

  return (
    <ClickSpark sparkColor="#488C5C" sparkRadius={25} duration={600}>
    <div className="font-sans antialiased text-[#111111] selection:bg-[#488C5C] selection:text-white relative">
      {view !== 'VENDOR_LOGIN' && view !== 'VENDOR_DASHBOARD' && view !== 'CHECKOUT' && view !== 'ORDER_SUCCESS' && view !== 'USER_AUTH' && (
        <Navigation 
            cartCount={cart.length} 
            setView={setView} 
            isTransparent={view === 'LANDING'}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            setSelectedProduct={setSelectedProduct}
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
            products={products}
          />
      )}

      {view === 'STUDIO' && ENABLE_STUDIO && (
          <>
            <StudioFeed 
                setView={setView}
                setSelectedProduct={setSelectedProduct}
            />
            <Footer />
          </>
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
                products={products}
                isLoading={isLoadingProducts}
                error={productError ?? undefined}
                hasMore={!!nextProductsUrl}
                onLoadMore={loadMoreProducts}
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
                setCart={updateCart}
                setView={setView}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                onValidateCoupon={handleApplyCoupon}
            />
            <Footer />
          </>
      )}

      {view === 'CHECKOUT' && (
          <Checkout 
              cart={cart}
              setView={setView}
              onPlaceOrder={handlePlaceOrder}
              appliedCoupon={appliedCoupon}
              isLoadingProducts={isLoadingProducts}
          />
      )}

      {view === 'ORDER_SUCCESS' && (
          <OrderSuccess setView={setView} />
      )}

      {view === 'USER_PROFILE' && (
          <>
        <UserProfile 
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                orders={orders}
                addresses={addresses}
            />
            <Footer />
          </>
      )}
      
      {view === 'USER_AUTH' && (
          <UserAuth setView={setView} onLogin={handleUserLogin} />
      )}

      {view === 'VENDOR_LOGIN' && <VendorLogin setView={setView} onVendorAuth={() => setIsAuthenticated(true)} />}
      
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
    </ClickSpark>
  );
};

export default App;
