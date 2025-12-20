
import React, { useState } from 'react';
import { ViewState, CartItem, Coupon } from '../../types';
import { ArrowLeft, CreditCard, Lock, Truck, CheckCircle } from 'lucide-react';

interface ShippingInfo {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
}

interface CheckoutProps {
    cart: CartItem[];
    setView: (view: ViewState) => void;
    onPlaceOrder: (shipping: ShippingInfo) => Promise<void>;
    appliedCoupon: Coupon | null;
    isLoadingProducts?: boolean;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, setView, onPlaceOrder, appliedCoupon, isLoadingProducts }) => {
    const [step, setStep] = useState<'SHIPPING' | 'PAYMENT'>('SHIPPING');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shipping, setShipping] = useState<ShippingInfo>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
    });

    // Calculation Logic
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedCoupon 
      ? (appliedCoupon.discountType === 'PERCENTAGE' ? cartSubtotal * (appliedCoupon.value / 100) : appliedCoupon.value)
      : 0;
    const deliveryFee = cartSubtotal > 200 ? 0 : 20.00;
    const total = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        await onPlaceOrder(shipping);
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-[#F2F4F3] pt-24 pb-24 px-6 md:px-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* LEFT COLUMN - FORMS */}
                <div className="lg:col-span-7">
                    {/* Breadcrumb-ish */}
                    <button onClick={() => setView('CART')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] mb-8 transition-colors">
                         <ArrowLeft size={12} /> Return to Cart
                    </button>

                    <div className="space-y-8">
                        {/* Shipping Section */}
                        <div className={`bg-white p-8 md:p-10 border border-gray-200 shadow-sm transition-opacity duration-500 ${step === 'PAYMENT' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="font-anton text-2xl uppercase tracking-wide">Shipping Details</h2>
                                <Truck size={20} className="text-[#488C5C]" />
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={shipping.email}
                                        onChange={(e) => setShipping({...shipping, email: e.target.value})}
                                        className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">First Name</label>
                                    <input type="text" value={shipping.firstName} onChange={(e) => setShipping({...shipping, firstName: e.target.value})} className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Last Name</label>
                                    <input type="text" value={shipping.lastName} onChange={(e) => setShipping({...shipping, lastName: e.target.value})} className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" />
                                </div>
                                <div className="group md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Address</label>
                                    <input type="text" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" placeholder="Street, Apt, Suite" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">City</label>
                                    <input type="text" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Postal Code</label>
                                    <input type="text" value={shipping.postalCode} onChange={(e) => setShipping({...shipping, postalCode: e.target.value})} className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" />
                                </div>
                            </form>
                            
                            {step === 'SHIPPING' && (
                                <div className="mt-8 flex justify-end">
                                    <button 
                                        onClick={() => setStep('PAYMENT')}
                                        className="bg-[#111111] text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#488C5C] transition-colors shadow-lg"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className={`bg-white p-8 md:p-10 border border-gray-200 shadow-sm transition-all duration-500 ${step === 'SHIPPING' ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100 ring-2 ring-[#488C5C]/10'}`}>
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="font-anton text-2xl uppercase tracking-wide">Payment Method</h2>
                                <div className="flex items-center gap-2 text-[#488C5C] text-[10px] font-bold uppercase tracking-widest">
                                    <Lock size={14} /> Secure Encrypted
                                </div>
                            </div>

                            <form onSubmit={handleProcessPayment}>
                                <div className="mb-8">
                                    <div className="flex gap-4 mb-6">
                                        <button type="button" className="flex-1 py-3 border-2 border-[#111111] bg-[#F9FAFB] flex items-center justify-center gap-2 font-bold text-sm">
                                            <CreditCard size={18} /> Card
                                        </button>
                                        <button type="button" className="flex-1 py-3 border border-gray-200 text-gray-400 hover:border-gray-300 flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                                            PayPal
                                        </button>
                                        <button type="button" className="flex-1 py-3 border border-gray-200 text-gray-400 hover:border-gray-300 flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                                            Apple Pay
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Card Number</label>
                                            <div className="relative">
                                                <input type="text" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors font-mono" placeholder="0000 0000 0000 0000" />
                                                <div className="absolute right-0 top-3 flex gap-2">
                                                    <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                                                    <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="group">
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Expiry Date</label>
                                                <input type="text" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors font-mono" placeholder="MM / YY" />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">CVC</label>
                                                <input type="text" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors font-mono" placeholder="123" />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Cardholder Name</label>
                                            <input type="text" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:border-[#111111] transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between items-center">
                                    <button 
                                        type="button"
                                        onClick={() => setStep('SHIPPING')}
                                        className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#111111]"
                                    >
                                        Back to Shipping
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing || isLoadingProducts}
                                        className="bg-[#111111] text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#488C5C] transition-colors shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay ₹${total.toFixed(2)}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - SUMMARY */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 space-y-8">
                        {/* Order Summary Card */}
                        <div className="bg-white p-10 border border-gray-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]">
                             <h3 className="font-anton text-2xl uppercase mb-8">Order Summary</h3>
                             
                             <div className="max-h-[300px] overflow-y-auto pr-2 mb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                                 {cart.map((item, idx) => (
                                     <div key={idx} className="flex gap-4">
                                         <div className="w-16 h-20 bg-[#E8E6E1] flex-shrink-0 relative">
                                             <img src={item.image} className="w-full h-full object-cover" />
                                             <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#111111] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                                 {item.quantity}
                                             </span>
                                         </div>
                                         <div className="flex-1">
                                             <h4 className="font-bold text-xs uppercase tracking-wide">{item.name}</h4>
                                             <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{item.selectedSize} / {item.selectedColor}</p>
                                         </div>
                                         <div className="font-bold text-sm">
                                             ₹{(item.price * item.quantity).toFixed(2)}
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             <div className="space-y-4 text-xs text-gray-600 border-t border-gray-100 pt-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#111111]">₹{cartSubtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-[#488C5C]">
                                        <span>Discount</span>
                                        <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
                                </div>
                            </div>

                            <div className="flex justify-between font-anton text-2xl mt-8 pt-6 border-t border-[#111111]">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 border border-gray-100 flex items-center gap-3">
                                <CheckCircle className="text-[#488C5C]" size={20} />
                                <div>
                                    <p className="font-bold text-[10px] uppercase tracking-widest">Secure Checkout</p>
                                    <p className="text-[9px] text-gray-400">256-bit SSL Encryption</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 border border-gray-100 flex items-center gap-3">
                                <Truck className="text-[#488C5C]" size={20} />
                                <div>
                                    <p className="font-bold text-[10px] uppercase tracking-widest">Fast Delivery</p>
                                    <p className="text-[9px] text-gray-400">2-3 Business Days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
