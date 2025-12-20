
import React from 'react';
import { CartItem, Coupon, ViewState } from '../../types';
import { AVAILABLE_COUPONS } from '../../constants';
import { Minus, Plus, Trash2, Check } from 'lucide-react';

interface CartProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    setView: (view: ViewState) => void;
    couponCode: string;
    setCouponCode: (code: string) => void;
    appliedCoupon: Coupon | null;
    setAppliedCoupon: (coupon: Coupon | null) => void;
}

export const Cart: React.FC<CartProps> = ({ 
    cart, setCart, setView, 
    couponCode, setCouponCode, appliedCoupon, setAppliedCoupon 
}) => {
    
    const updateQuantity = (id: string, size: string, color: string, delta: number) => {
        setCart(prev => prev.map(item => {
          if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        }));
    };

    const removeFromCart = (id: string, size: string, color: string) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
    };

    const handleApplyCoupon = () => {
        const coupon = AVAILABLE_COUPONS.find(c => c.code === couponCode.toUpperCase());
        if (coupon) {
            setAppliedCoupon(coupon);
        } else {
            alert('Invalid Coupon Code');
            setAppliedCoupon(null);
        }
    };

    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedCoupon 
      ? (appliedCoupon.discountType === 'PERCENTAGE' ? cartSubtotal * (appliedCoupon.value / 100) : appliedCoupon.value)
      : 0;
    const deliveryFee = cartSubtotal > 200 ? 0 : 20.00;
    const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryFee : 0));

    return (
        <div className="pt-32 min-h-screen bg-[#F2F4F3] bg-subtle-grid px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Items List */}
                <div className="lg:col-span-7">
                    <h1 className="text-4xl font-anton uppercase mb-12">Shopping Bag ({cart.length})</h1>
                    {cart.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-dashed border-gray-200">
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-6">Your bag is empty</p>
                            <button onClick={() => setView('GENDER_SELECTION')} className="text-[10px] font-bold uppercase tracking-[0.2em] underline">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex gap-6 bg-white p-4 border border-gray-100 shadow-sm">
                                    <div className="w-24 h-32 bg-[#E8E6E1] flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold uppercase text-sm tracking-wide mb-1">{item.name}</h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.selectedColor} / {item.selectedSize}</p>
                                            </div>
                                            <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                             <div className="flex items-center border border-gray-200">
                                                  <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Minus size={12}/></button>
                                                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                  <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Plus size={12}/></button>
                                             </div>
                                             <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-10 border border-gray-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] sticky top-32">
                        <h3 className="font-anton text-2xl uppercase mb-8">Order Summary</h3>
                        
                        {/* Coupon Code */}
                        <div className="mb-8 bg-gray-50 p-6 border border-gray-200">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">Promo Code</label>
                            <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value)}
                                  placeholder="Enter Code" 
                                  className="flex-1 bg-white border border-gray-200 px-3 py-2 text-xs focus:border-[#111111] uppercase tracking-wider"
                                />
                                <button onClick={handleApplyCoupon} className="bg-[#111111] text-white px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#488C5C]">Apply</button>
                            </div>
                            {appliedCoupon && (
                                <div className="mt-3 flex items-center gap-2 text-[#488C5C] bg-green-50 p-2 border border-green-100 text-xs">
                                    <Check size={12} /> <span className="font-bold">Code Applied:</span> {appliedCoupon.description}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 text-xs text-gray-600 mb-6 pb-6 border-b border-gray-100">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#111111]">${cartSubtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-[#488C5C]">
                                    <span>Discount</span>
                                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${deliveryFee.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between font-anton text-2xl mb-8">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <button onClick={() => setView('CHECKOUT')} className="w-full bg-[#111111] text-white py-5 font-bold uppercase tracking-[0.25em] text-xs hover:bg-[#488C5C] shadow-lg">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
