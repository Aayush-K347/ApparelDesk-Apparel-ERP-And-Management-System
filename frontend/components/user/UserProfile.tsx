import React from 'react';
import { Address, SalesOrderResponse, ViewState } from '../../types';
import { Package, MapPin, Plus, ArrowLeft, Printer } from 'lucide-react';

interface UserProfileProps {
    selectedOrder: SalesOrderResponse | null;
    setSelectedOrder: (order: SalesOrderResponse | null) => void;
    orders: SalesOrderResponse[];
    addresses: Address[];
    setView?: (view: ViewState) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
    selectedOrder,
    setSelectedOrder,
    orders,
    addresses,
    setView,
}) => {
    const orderList = Array.isArray(orders) ? orders : [];
    const addressList = Array.isArray(addresses) ? addresses : [];
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
                                 <h1 className="font-anton text-4xl uppercase mb-2">Order #{selectedOrder.so_number}</h1>
                                 <p className="text-xs text-gray-500 uppercase tracking-widest">
                                    {selectedOrder.order_date} • {selectedOrder.lines.length} Items
                                </p>
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
                                 <p className="text-sm font-bold leading-relaxed">
                                    {selectedOrder.shipping_address_line1}
                                    {selectedOrder.shipping_address_line2 ? `, ${selectedOrder.shipping_address_line2}` : ''}
                                    {selectedOrder.shipping_city ? `, ${selectedOrder.shipping_city}` : ''}
                                    {selectedOrder.shipping_state ? `, ${selectedOrder.shipping_state}` : ''}
                                    {selectedOrder.shipping_pincode ? `, ${selectedOrder.shipping_pincode}` : ''}
                                 </p>
                             </div>
                             <div>
                                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Payment</h3>
                                 <p className="text-sm font-bold mb-1"><span className="text-green-600">●</span> Paid</p>
                                 <p className="text-xs text-gray-500">Invoice generated on checkout</p>
                             </div>
                             <div>
                                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Status</h3>
                                 <div className="flex items-center gap-2">
                                     <div className="h-2 w-2 bg-[#c3f235] rounded-full animate-pulse"></div>
                                     <span className="text-sm font-bold">{selectedOrder.order_status}</span>
                                 </div>
                             </div>
                         </div>

                         <div className="mb-12">
                             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Order Items</h3>
                             <div className="space-y-6">
                                 {selectedOrder.lines.map((item, i) => (
                                     <div key={i} className="flex gap-6 items-center border-b border-gray-50 pb-6 last:border-0">
                                         <div className="w-16 h-20 bg-[#E8E6E1] flex items-center justify-center text-[10px] uppercase tracking-widest">
                                            {item.product_detail?.code || item.product}
                                         </div>
                                         <div className="flex-1">
                                             <h4 className="font-bold text-xs uppercase tracking-wide">{item.product_detail?.name || 'Product'}</h4>
                                             <p className="text-[10px] text-gray-500 mt-1">Qty: {Number(item.quantity)} x ₹{Number(item.unit_price).toFixed(2)}</p>
                                         </div>
                                         <span className="font-bold text-sm">₹{Number(item.line_total).toFixed(2)}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="bg-gray-50 p-8 flex flex-col items-end gap-3 text-xs">
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Subtotal</span>
                                 <span className="font-bold">₹{Number(selectedOrder.subtotal).toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Tax</span>
                                 <span className="font-bold">₹{Number(selectedOrder.tax_amount).toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between">
                                 <span className="text-gray-500">Discount</span>
                                 <span className="font-bold text-[#c3f235]">-₹{Number(selectedOrder.discount_amount).toFixed(2)}</span>
                             </div>
                             <div className="w-64 flex justify-between text-lg border-t border-gray-200 pt-3 mt-1">
                                 <span className="font-anton uppercase">Total</span>
                                 <span className="font-bold">₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        );
    }

    // List view
    return (
        <div className="pt-32 min-h-screen bg-[#F2F4F3] bg-subtle-grid px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => setView && setView('LANDING')}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#111111] transition-colors mb-8"
                >
                    <ArrowLeft size={12} /> Back to Home
                </button>

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
                    <div className="lg:col-span-3 space-y-10">
                         <div className="space-y-6">
                             {orderList.map(order => (
                                 <div key={order.sales_order_id || order.so_number} className="bg-white border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-all">
                                     <div className="flex gap-6 items-center w-full md:w-auto">
                                         <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full">
                                             <Package size={20} className="text-[#111111]" />
                                         </div>
                                         <div>
                                             <h3 className="font-bold text-lg mb-1">{order.so_number}</h3>
                                             <p className="text-[10px] uppercase tracking-widest text-gray-500">{order.order_date} • {order.order_status}</p>
                                         </div>
                                     </div>
                                     <div className="text-right w-full md:w-auto">
                                         <p className="font-anton text-xl mb-2">₹{Number(order.total_amount).toFixed(2)}</p>
                                         <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-[#c3f235] hover:border-[#c3f235] transition-colors"
                                        >
                                            View Details
                                         </button>
                                     </div>
                                 </div>
                             ))}
                             {orderList.length === 0 && (
                                <div className="bg-white border border-gray-100 p-8 text-sm text-gray-500">
                                    You have no orders yet.
                                </div>
                             )}
                         </div>

                         <div className="mt-8">
                            <h2 className="text-xl font-anton uppercase mb-4 flex items-center gap-2"><MapPin size={16}/> Saved Addresses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addressList.map(addr => (
                                    <div key={addr.address_id} className="border border-gray-100 bg-white p-4">
                                        <p className="text-xs uppercase text-gray-500 mb-2">{addr.label}</p>
                                        <p className="text-sm font-bold leading-relaxed">
                                            {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br/>
                                            {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.pincode}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            {addr.is_default_shipping && 'Default Shipping'} {addr.is_default_billing && 'Default Billing'}
                                        </p>
                                    </div>
                                ))}
                                {addressList.length === 0 && (
                                    <div className="border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                                        No addresses saved yet.
                                    </div>
                                )}
                                <div className="border border-dashed border-gray-300 bg-white p-4 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                    <Plus size={14} className="mr-2"/> Manage in Checkout
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
