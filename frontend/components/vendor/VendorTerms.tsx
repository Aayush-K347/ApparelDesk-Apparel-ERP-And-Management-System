import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type ViewMode = 'DASHBOARD' | 'TERMS_DETAIL' | 'OFFERS_DETAIL';

export const VendorTerms: React.FC = () => {
    const [view, setView] = useState<ViewMode>('DASHBOARD');
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [customerSelection, setCustomerSelection] = useState<'Anonymous' | 'Selected'>('Anonymous');

    if (view === 'DASHBOARD') {
        return (
            <div className="p-12 h-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                     <div 
                        onClick={() => setView('TERMS_DETAIL')}
                        className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                     >
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#c3f235] transition-colors">Payment Terms</h2>
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                            Number of Payment Terms: <span className="text-black text-lg ml-2">10</span>
                        </div>
                     </div>

                     <div 
                        onClick={() => setView('OFFERS_DETAIL')}
                        className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                     >
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#c3f235] transition-colors">Offers</h2>
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                            Number of Active Offers: <span className="text-black text-lg ml-2">3</span>
                        </div>
                     </div>
                 </div>
            </div>
        );
    }

    const Header = ({ title }: { title: string }) => (
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-6">
                 <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                    &larr; Back
                </button>
                <h2 className="font-anton text-2xl uppercase tracking-wide">{title}</h2>
            </div>
             <div className="flex items-center gap-4">
                 <button className="px-6 py-2 border bg-[#111111] text-white border-[#111111] text-[10px] font-bold uppercase tracking-widest transition-all">
                    New
                </button>
                 {title === 'Offers' && (
                     <button onClick={() => setShowCouponModal(true)} className="px-6 py-2 border border-gray-200 hover:border-[#111111] text-[10px] font-bold uppercase tracking-widest transition-all">
                        Generate Coupon Codes
                    </button>
                 )}
                <div className="flex gap-1 ml-4">
                    <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={14} /></button>
                    <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={14} /></button>
                </div>
            </div>
        </div>
    );

    if (view === 'TERMS_DETAIL') {
        return (
             <div className="p-8 h-full animate-[fadeIn_0.3s_ease-out]">
                <Header title="Payment Terms" />
                <div className="max-w-3xl">
                    <div className="space-y-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Name</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent" placeholder="e.g. 15 Days" />
                        </div>
                        
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input type="checkbox" className="accent-[#111111] w-4 h-4" defaultChecked />
                                <span className="text-sm font-bold">Early Discount</span>
                            </label>
                            <div className="flex items-end gap-2 pl-7">
                                <input type="number" className="w-12 border-b border-gray-300 text-center pb-1 focus:border-black" placeholder="2" />
                                <span className="text-sm">% if paid within</span>
                                <input type="number" className="w-12 border-b border-gray-300 text-center pb-1 focus:border-black" placeholder="10" />
                                <span className="text-sm">days</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Example Preview</p>
                            <div className="text-sm">
                                <p><span className="font-bold">Payment Terms:</span> 15 days</p>
                                <p><span className="font-bold">Early payment discount:</span> 2% if paid before 26/12/2025</p>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="accent-[#111111] w-4 h-4" defaultChecked />
                            <span className="text-sm font-bold">Active</span>
                        </label>
                        <p className="text-[10px] text-red-400 mt-2">* Only Active payment terms will be available in selection in invoice and sale order</p>
                    </div>
                </div>
             </div>
        );
    }

    if (view === 'OFFERS_DETAIL') {
        return (
            <div className="p-8 h-full animate-[fadeIn_0.3s_ease-out] relative">
                 <Header title="Offers" />
                 
                 {/* Stat overlay */}
                 <div className="absolute top-8 right-1/3 flex flex-col items-center">
                     <div className="text-4xl font-anton text-[#c3f235]">15</div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Coupons Generated</div>
                 </div>

                 <div className="max-w-3xl">
                     <div className="space-y-8">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Name</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent" placeholder="10% Discount Coupons" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Discount Percentage</label>
                            <span className="text-2xl font-bold font-anton">10%</span>
                        </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Start Date</label>
                                <input type="date" className="w-full border-b border-gray-200 py-2 text-sm bg-transparent" />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">End Date</label>
                                <input type="date" className="w-full border-b border-gray-200 py-2 text-sm bg-transparent" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Available On</label>
                            <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option>Sales Website</option>
                                <option>POS</option>
                            </select>
                        </div>
                     </div>
                 </div>

                 {/* Modal */}
                 {showCouponModal && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                         <div className="bg-white w-full max-w-lg p-8 shadow-2xl rounded-xl animate-[fadeIn_0.2s_ease-out]">
                             <h3 className="font-anton text-2xl uppercase mb-6 border-b border-gray-100 pb-4">Generate Coupons</h3>
                             
                             <div className="space-y-6">
                                 <div className="grid grid-cols-3 items-center">
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">For</label>
                                     <select 
                                        className="col-span-2 border border-gray-200 p-2 text-sm rounded"
                                        value={customerSelection}
                                        onChange={(e) => setCustomerSelection(e.target.value as any)}
                                    >
                                         <option value="Anonymous">Anonymous Customers</option>
                                         <option value="Selected">Selected Customers</option>
                                     </select>
                                 </div>

                                 {customerSelection === 'Selected' ? (
                                    <div className="grid grid-cols-3 items-start">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">Customers</label>
                                        <div className="col-span-2 border border-gray-200 p-2 text-sm rounded h-24 overflow-y-auto">
                                            {/* Mock Multiple Select */}
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">John Doe <X size={10} className="cursor-pointer"/></span>
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">Jane Smith <X size={10} className="cursor-pointer"/></span>
                                            </div>
                                        </div>
                                    </div>
                                 ) : (
                                    <div className="grid grid-cols-3 items-center">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quantity</label>
                                        <input type="number" className="col-span-2 border border-gray-200 p-2 text-sm rounded" placeholder="1" />
                                    </div>
                                 )}

                                 <div className="grid grid-cols-3 items-center">
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Valid Until</label>
                                     <input type="date" className="col-span-2 border border-gray-200 p-2 text-sm rounded" />
                                 </div>
                             </div>
                             
                             <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
                                 <button onClick={() => setShowCouponModal(false)} className="px-6 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                                 <button onClick={() => setShowCouponModal(false)} className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c3f235]">Generate</button>
                             </div>
                         </div>
                     </div>
                 )}
            </div>
        );
    }

    return null;
};