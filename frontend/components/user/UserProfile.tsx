
import React from 'react';
import { UserOrder } from '../../types';
import { MOCK_USER_ORDERS } from '../../constants';
import { ArrowLeft, Printer, Package } from 'lucide-react';

interface UserProfileProps {
    selectedOrder: UserOrder | null;
    setSelectedOrder: (order: UserOrder | null) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ selectedOrder, setSelectedOrder }) => {
    // If an order is selected, show detail view
    if (selectedOrder) {
        return (
            <div className="pt-24 min-h-screen bg-[#F2F4F3] bg-subtle-grid pb-24 px-6 md:px-12">
                 <div className="max-w-5xl mx-auto">
                     <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8 hover:text-[#111111]">
                         <ArrowLeft size={12} /> Back to Orders
                     </button>
                     
                     <div className="bg-white border border-gray-100 shadow-xl p-10 md:p-16 relative">
                         <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                             <div>
                                 <h1 className="font-anton text-4xl uppercase mb-2">Order #{selectedOrder.id}</h1>
                                 <p className="text-xs text-gray-500 uppercase tracking-widest">{selectedOrder.date} • {selectedOrder.items.length} Items</p>
                             </div>
                             <div className="text-right">
                                 <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">
                                     <Printer size={14} /> Print Invoice
                                 </button>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                             <div>
                                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Shipping To</h3>
                                 <p className="text-sm font-bold leading-relaxed">{selectedOrder.shippingAddress}</p>
                             </div>
                             <div>
                                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Payment</h3>
                                 <p className="text-sm font-bold mb-1"><span className="text-green-600">●</span> {selectedOrder.paymentStatus}</p>
                                 <p className="text-xs text-gray-500">Invoice: {selectedOrder.invoiceReference}</p>
                             </div>
                             <div>
                                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Status</h3>
                                 <div className="flex items-center gap-2">
                                     <div className="h-2 w-2 bg-[#488C5C] rounded-full animate-pulse"></div>
                                     <span className="text-sm font-bold">{selectedOrder.status}</span>
                                 </div>
                             </div>
                         </div>

                         <div className="mb-12">
                             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Order Items</h3>
                             <div className="space-y-6">
                                 {selectedOrder.items.map((item, i) => (
                                     <div key={i} className="flex gap-6 items-center border-b border-gray-50 pb-6 last:border-0">
                                         <img src={item.image} className="w-16 h-20 object-cover bg-[#E8E6E1]" />
                                         <div className="flex-1">
                                             <h4 className="font-bold text-xs uppercase tracking-wide">{item.name}</h4>
                                             <p className="text-[10px] text-gray-500 mt-1">Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                                         </div>
                                         <span className="font-bold text-sm">${item.total.toFixed(2)}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="bg-gray-50 p-8 flex flex-col items-end gap-3 text-xs">
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Subtotal</span>
                                 <span className="font-bold">${selectedOrder.subtotal.toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Tax</span>
                                 <span className="font-bold">${selectedOrder.tax.toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Discount</span>
                                 <span className="font-bold text-[#488C5C]">-${selectedOrder.discount.toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between text-lg border-t border-gray-200 pt-3 mt-1">
                                 <span className="font-anton uppercase">Total</span>
                                 <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        );
    }

    // Default List View
    return (
        <div className="pt-32 min-h-screen bg-[#F2F4F3] bg-subtle-grid px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-anton font-bold uppercase tracking-wide mb-12">My Account</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest">Order History</button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Addresses</button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Wishlist</button>
                        <button className="w-full text-left px-4 py-3 text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest mt-8 transition-colors">Sign Out</button>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                         <div className="space-y-6">
                             {MOCK_USER_ORDERS.map(order => (
                                 <div key={order.id} className="bg-white border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-all">
                                     <div className="flex gap-6 items-center w-full md:w-auto">
                                         <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full">
                                             <Package size={20} className="text-[#111111]" />
                                         </div>
                                         <div>
                                             <h3 className="font-bold text-lg mb-1">{order.id}</h3>
                                             <p className="text-[10px] uppercase tracking-widest text-gray-500">{order.date} • {order.status}</p>
                                         </div>
                                     </div>
                                     <div className="text-right w-full md:w-auto">
                                         <p className="font-anton text-xl mb-2">${order.total.toFixed(2)}</p>
                                         <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-[#488C5C] hover:border-[#488C5C] transition-colors"
                                        >
                                            View Details
                                         </button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
