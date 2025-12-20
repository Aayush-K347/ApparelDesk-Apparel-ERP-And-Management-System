import React from 'react';

export const VendorReports: React.FC = () => {
    return (
        <div className="p-12 h-full flex items-center justify-center animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 w-full max-w-2xl">
                <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide border-b border-gray-100 pb-4">Generate Report</h2>
                
                <div className="space-y-8">
                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Report Type</label>
                        <select className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]">
                            <option>Sales</option>
                            <option>Purchase</option>
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Group By</label>
                        <select className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]">
                            <option>Product</option>
                            <option>Contact</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">From</label>
                        <input type="date" className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]" />
                    </div>

                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">To</label>
                        <input type="date" className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
                    <button className="px-8 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Cancel</button>
                    <button className="px-8 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c9b52e] transition-colors shadow-lg">Print</button>
                </div>
            </div>
        </div>
    );
};