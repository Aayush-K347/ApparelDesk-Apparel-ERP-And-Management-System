
import React from 'react';
import { ViewState } from '../../types';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';

interface OrderSuccessProps {
    setView: (view: ViewState) => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ setView }) => {
    const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div className="min-h-screen bg-[#F2F4F3] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c3f235] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            <div className="w-full max-w-2xl bg-white p-12 md:p-16 text-center relative z-10 shadow-2xl rounded-[32px] border border-white/50 animate-[slideUp_0.8s_ease-out]">
                {/* Animated Checkmark */}
                <div className="w-24 h-24 bg-[#c3f235] rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-200 animate-[fadeIn_1s_ease-out]">
                    <Check size={48} className="text-white animate-[kenburns_0.5s_ease-in]" strokeWidth={3} />
                </div>

                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c3f235] mb-4">Payment Successful</h2>
                <h1 className="font-anton text-5xl md:text-6xl uppercase mb-6 leading-none text-[#111111]">
                    Order Placed
                </h1>
                
                <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-10">
                    Thank you for your purchase. Your order has been confirmed and is being prepared for shipment. You will receive a confirmation email shortly.
                </p>

                <div className="bg-[#F8F9FD] p-6 rounded-xl border border-gray-100 max-w-sm mx-auto mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order Reference</p>
                    <p className="font-mono text-xl font-bold tracking-wider">{orderNumber}</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <button 
                        onClick={() => setView('GENDER_SELECTION')}
                        className="bg-[#111111] text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#c3f235] transition-colors shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Continue Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={() => setView('USER_PROFILE')}
                        className="bg-white text-[#111111] border border-gray-200 px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:border-[#111111] transition-colors flex items-center justify-center gap-2"
                    >
                        View Order
                    </button>
                </div>
            </div>
        </div>
    );
};
