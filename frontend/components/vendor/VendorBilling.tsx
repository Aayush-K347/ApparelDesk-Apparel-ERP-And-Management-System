import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, FileText, Printer, Send, CreditCard, X } from 'lucide-react';

type BillingView = 'DASHBOARD' | 'SALE_ORDER' | 'INVOICE' | 'INVOICE_PAYMENT' | 'PURCHASE_ORDER' | 'VENDOR_BILL' | 'BILL_PAYMENT';

export const VendorBilling: React.FC = () => {
    const [view, setView] = useState<BillingView>('DASHBOARD');
    const [docStatus, setDocStatus] = useState<'Draft' | 'Confirmed' | 'Cancelled' | 'Paid'>('Draft');

    // State for payment forms
    const [paymentAmount, setPaymentAmount] = useState(1200);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    // MOCK DATA for tables
    const LINE_ITEMS = [
        { product: 'Red Shirt', qty: 2, price: 600, untaxed: 1200, tax: '10%', taxAmt: 120, total: 1320 },
        { product: 'Discount 10%', qty: 1, price: -60, untaxed: -120, tax: '', taxAmt: 0, total: -120 },
    ];

    const resetToDraft = () => {
        setDocStatus('Draft');
    };

    if (view === 'DASHBOARD') {
        return (
            <div className="p-12 h-full flex flex-col gap-12 animate-[fadeIn_0.5s_ease-out]">
                {/* Sales Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-anton text-2xl uppercase">Sales</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="accent-[#111111]" defaultChecked /> Automatic Invoicing
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div 
                            onClick={() => { setView('SALE_ORDER'); resetToDraft(); }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                        >
                            <h3 className="font-bold uppercase tracking-wide mb-4">Sale Orders</h3>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Total orders current month: 164</p>
                                <p>Pending Orders to invoice: 10</p>
                            </div>
                        </div>
                        <div 
                            onClick={() => { setView('INVOICE'); resetToDraft(); }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                        >
                            <h3 className="font-bold uppercase tracking-wide mb-4">Customer Invoices</h3>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Unpaid Invoices: 84</p>
                                <p>Overdue: 12</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1">
                            <h3 className="font-bold uppercase tracking-wide mb-4">Customer Payments</h3>
                        </div>
                    </div>
                </div>

                {/* Purchase Section */}
                <div>
                    <h2 className="font-anton text-2xl uppercase mb-6">Purchase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div 
                            onClick={() => { setView('PURCHASE_ORDER'); resetToDraft(); }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                        >
                            <h3 className="font-bold uppercase tracking-wide mb-4">Purchase Orders</h3>
                             <div className="text-xs text-gray-500 space-y-1">
                                <p>Total orders current month: 154</p>
                                <p>Pending Orders to Bill: 10</p>
                            </div>
                        </div>
                        <div 
                             onClick={() => { setView('VENDOR_BILL'); resetToDraft(); }}
                             className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                        >
                            <h3 className="font-bold uppercase tracking-wide mb-4">Vendor Bills</h3>
                             <div className="text-xs text-gray-500 space-y-1">
                                <p>Unpaid Bills: 24</p>
                                <p>Overdue: 7</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1">
                            <h3 className="font-bold uppercase tracking-wide mb-4">Vendor Payments</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Shared Components for Forms
    const StatusBar = () => (
        <div className="flex items-center text-[10px] font-bold uppercase tracking-widest gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <span className={docStatus === 'Draft' ? 'text-[#111111]' : 'text-gray-400'}>Draft</span>
            <ChevronRight size={12} className="text-gray-300"/>
            <span className={docStatus === 'Confirmed' ? 'text-[#111111]' : 'text-gray-400'}>Confirmed</span>
            <ChevronRight size={12} className="text-gray-300"/>
            <span className={docStatus === 'Paid' ? 'text-[#c3f235]' : 'text-gray-400'}>Paid</span>
            <ChevronRight size={12} className="text-gray-300"/>
            <span className={docStatus === 'Cancelled' ? 'text-red-500' : 'text-gray-400'}>Cancelled</span>
        </div>
    );

    const ActionButtons = ({ type }: { type: 'SO' | 'INV' | 'PO' | 'BILL' }) => (
        <div className="flex gap-2">
             {docStatus === 'Draft' && (
                 <button onClick={() => setDocStatus('Confirmed')} className="bg-[#111111] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c3f235]">Confirm</button>
             )}
             <button className="border border-gray-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">Print</button>
             <button className="border border-gray-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">Send</button>
             {docStatus !== 'Paid' && (
                 <button onClick={() => setDocStatus('Cancelled')} className="border border-gray-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 text-red-500 hover:text-red-600">Cancel</button>
             )}
             
             {type === 'SO' && docStatus === 'Confirmed' && (
                 <button onClick={() => { setView('INVOICE'); resetToDraft(); }} className="ml-4 border border-[#111111] text-[#111111] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors">Create Invoice</button>
             )}
             {type === 'PO' && docStatus === 'Confirmed' && (
                 <button onClick={() => { setView('VENDOR_BILL'); resetToDraft(); }} className="ml-4 border border-[#111111] text-[#111111] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors">Create Bill</button>
             )}
              {type === 'INV' && docStatus === 'Confirmed' && (
                 <button onClick={() => setView('INVOICE_PAYMENT')} className="ml-4 border border-[#c3f235] text-[#c3f235] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c3f235] hover:text-white transition-colors">Register Payment</button>
             )}
             {type === 'BILL' && docStatus === 'Confirmed' && (
                 <button onClick={() => setView('BILL_PAYMENT')} className="ml-4 border border-[#c3f235] text-[#c3f235] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c3f235] hover:text-white transition-colors">Register Payment</button>
             )}
        </div>
    );

    const ItemTable = () => (
        <table className="w-full text-left text-sm mt-8 border-t border-gray-100">
            <thead className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <tr>
                    <th className="py-4">Product</th>
                    <th className="py-4">Qty</th>
                    <th className="py-4">Unit Price</th>
                    <th className="py-4">Untaxed</th>
                    <th className="py-4">Tax</th>
                    <th className="py-4">Tax Amt</th>
                    <th className="py-4 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {LINE_ITEMS.map((item, idx) => (
                    <tr key={idx}>
                        <td className="py-4 font-bold">{item.product}</td>
                        <td className="py-4">{item.qty}</td>
                        <td className="py-4">{item.price}</td>
                        <td className="py-4">{item.untaxed}</td>
                        <td className="py-4">{item.tax}</td>
                        <td className="py-4">{item.taxAmt}</td>
                        <td className="py-4 text-right font-bold">{item.total}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="border-t border-gray-200">
                <tr>
                    <td colSpan={6} className="py-4 text-right font-bold uppercase tracking-widest text-xs">Total</td>
                    <td className="py-4 text-right font-bold text-lg">1200</td>
                </tr>
            </tfoot>
        </table>
    );

    const PaymentForm = ({ isBill }: { isBill: boolean }) => (
        <div className="p-8 h-full animate-[fadeIn_0.3s_ease-out] flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl p-10 rounded-xl shadow-2xl border border-gray-100">
                 <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                     <h2 className="font-anton text-3xl uppercase tracking-wide text-[#c3f235]">{isBill ? 'Bill Payment' : 'Invoice Payment'}</h2>
                     <button onClick={() => setView(isBill ? 'VENDOR_BILL' : 'INVOICE')} className="text-gray-400 hover:text-black">
                         <X size={24} />
                     </button>
                 </div>

                 {/* Early Payment Notification */}
                 <div className="bg-blue-50 text-blue-700 text-xs p-4 rounded mb-8 border border-blue-100">
                     Early Payment Discount of 15.22 has been applied.
                 </div>

                 <div className="space-y-6">
                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Payment Type</label>
                         <div className="flex gap-6">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="payType" defaultChecked={!isBill} className="accent-[#111111]" /> 
                                 <span className="text-sm">Send</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="payType" defaultChecked={isBill} className="accent-[#111111]" /> 
                                 <span className="text-sm">Receive</span>
                             </label>
                         </div>
                     </div>

                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Partner Type</label>
                         <div className="flex gap-6">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="partnerType" defaultChecked={!isBill} className="accent-[#111111]" /> 
                                 <span className="text-sm">Customer</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="partnerType" defaultChecked={isBill} className="accent-[#111111]" /> 
                                 <span className="text-sm">Vendor</span>
                             </label>
                         </div>
                     </div>

                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Partner</label>
                         <input type="text" defaultValue={isBill ? "Fabric Supplier Co." : "John Doe"} className="flex-1 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]" />
                     </div>

                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</label>
                         <div className="flex-1 flex items-center border-b border-gray-200 focus-within:border-[#111111]">
                             <span className="text-gray-400 font-bold">₹</span>
                             <input 
                                type="number" 
                                value={paymentAmount} 
                                onChange={(e) => setPaymentAmount(Number(e.target.value))} 
                                className="w-full py-2 pl-2 bg-transparent text-lg font-bold" 
                            />
                         </div>
                     </div>

                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</label>
                         <input 
                            type="date" 
                            value={paymentDate} 
                            onChange={(e) => setPaymentDate(e.target.value)} 
                            className="flex-1 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]" 
                        />
                     </div>

                     <div className="flex items-center">
                         <label className="w-1/3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Memo</label>
                         <input type="text" placeholder={isBill ? "Bill Payment" : "Invoice Payment"} className="flex-1 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]" />
                     </div>
                 </div>

                 <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                     <button onClick={() => setView(isBill ? 'VENDOR_BILL' : 'INVOICE')} className="px-6 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                     <button 
                        onClick={() => {
                            setDocStatus('Paid');
                            setView(isBill ? 'VENDOR_BILL' : 'INVOICE');
                        }}
                        className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c3f235] shadow-lg"
                    >
                        Confirm
                     </button>
                 </div>
            </div>
        </div>
    );

    if (view === 'INVOICE_PAYMENT') return <PaymentForm isBill={false} />;
    if (view === 'BILL_PAYMENT') return <PaymentForm isBill={true} />;

    if (view === 'SALE_ORDER') {
        return (
            <div className="p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                     <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">&larr; Billing</button>
                     <div className="flex items-center gap-4">
                        <ActionButtons type="SO" />
                        <StatusBar />
                     </div>
                </div>

                <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-lg relative">
                     {/* Smart Button Link */}
                     {docStatus === 'Confirmed' && (
                         <div onClick={() => { setView('INVOICE'); resetToDraft(); }} className="absolute top-0 right-0 border-l border-b border-gray-200 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#111111] hover:text-white transition-colors">
                             Invoices
                         </div>
                     )}

                     <h1 className="font-anton text-4xl mb-8">Sale Order <span className="text-gray-300">S0001</span></h1>
                     
                     <div className="grid grid-cols-2 gap-12 mb-8">
                         <div className="space-y-4">
                             <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Customer</label>
                                <input type="text" className="w-full border-b border-gray-200 py-1 font-bold focus:border-[#111111] bg-transparent" placeholder="Select Customer" />
                            </div>
                         </div>
                         <div className="space-y-4">
                              <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Payment Term</label>
                                <select className="w-full border-b border-gray-200 py-1 text-sm bg-transparent">
                                    <option>Immediate Payment</option>
                                    <option>15 Days</option>
                                </select>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">SO Date</label>
                                <input type="date" className="w-full border-b border-gray-200 py-1 text-sm bg-transparent" />
                            </div>
                         </div>
                     </div>

                     <ItemTable />
                     
                     <div className="mt-8 flex gap-4">
                         <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Coupon Code" className="border border-gray-200 p-2 text-xs rounded" />
                            <button className="bg-gray-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200">Apply</button>
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    if (view === 'INVOICE') {
        return (
             <div className="p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                     <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">&larr; Billing</button>
                     <div className="flex items-center gap-4">
                        <ActionButtons type="INV" />
                        <StatusBar />
                     </div>
                </div>

                <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-lg relative">
                    {/* Ribbon for Paid Status */}
                    {docStatus === 'Paid' && (
                        <div className="absolute top-8 right-8 rotate-12 border-4 border-[#c3f235] text-[#c3f235] px-6 py-2 font-anton text-2xl uppercase tracking-widest opacity-80 select-none">
                            PAID
                        </div>
                    )}

                    {/* Smart Button Link */}
                     <div onClick={() => { setView('SALE_ORDER'); setDocStatus('Confirmed'); }} className="absolute top-0 right-0 border-l border-b border-gray-200 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#111111] hover:text-white transition-colors">
                         Sale Order
                     </div>

                     <h1 className="font-anton text-4xl mb-8">Invoice <span className="text-gray-300">INV/0001</span></h1>
                     
                     <div className="grid grid-cols-2 gap-12 mb-8">
                         <div className="space-y-4">
                             <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Customer</label>
                                <input type="text" className="w-full border-b border-gray-200 py-1 font-bold focus:border-[#111111] bg-transparent" defaultValue="John Doe" />
                            </div>
                         </div>
                         <div className="space-y-4">
                              <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Reference</label>
                                <input type="text" className="w-full border-b border-gray-200 py-1 text-sm bg-transparent" defaultValue="S0001" />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Invoice Date</label>
                                <input type="date" className="w-full border-b border-gray-200 py-1 text-sm bg-transparent" />
                            </div>
                         </div>
                     </div>

                     <ItemTable />
                     
                     <div className="mt-4 text-right text-xs text-gray-500">
                         {docStatus === 'Paid' && <p className="text-[#c3f235] font-bold mb-1">Paid on 12/12/2025: ₹600</p>}
                         <p className="font-bold text-black">Amount Due: {docStatus === 'Paid' ? '₹0' : '₹600'}</p>
                     </div>
                </div>
            </div>
        );
    }
    
    // Simplification: Purchase Order and Vendor Bill follow nearly identical structure to SO/Invoice
    if (view === 'PURCHASE_ORDER' || view === 'VENDOR_BILL') {
        const isPO = view === 'PURCHASE_ORDER';
         return (
             <div className="p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                     <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">&larr; Billing</button>
                     <div className="flex items-center gap-4">
                        <ActionButtons type={isPO ? 'PO' : 'BILL'} />
                        <StatusBar />
                     </div>
                </div>

                <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-lg relative">
                    {/* Ribbon for Paid Status */}
                    {!isPO && docStatus === 'Paid' && (
                        <div className="absolute top-8 right-8 rotate-12 border-4 border-[#c3f235] text-[#c3f235] px-6 py-2 font-anton text-2xl uppercase tracking-widest opacity-80 select-none">
                            PAID
                        </div>
                    )}

                     <div onClick={() => { setView(isPO ? 'VENDOR_BILL' : 'PURCHASE_ORDER'); resetToDraft(); }} className="absolute top-0 right-0 border-l border-b border-gray-200 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#111111] hover:text-white transition-colors">
                         {isPO ? 'Vendor Bill' : 'Purchase Order'}
                     </div>

                     <h1 className="font-anton text-4xl mb-8">{isPO ? 'Purchase Order' : 'Vendor Bill'} <span className="text-gray-300">{isPO ? 'P0001' : 'BILL/0001'}</span></h1>
                     
                     <div className="grid grid-cols-2 gap-12 mb-8">
                         <div className="space-y-4">
                             <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Vendor</label>
                                <input type="text" className="w-full border-b border-gray-200 py-1 font-bold focus:border-[#111111] bg-transparent" placeholder="Select Vendor" />
                            </div>
                         </div>
                         <div className="space-y-4">
                              <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">{isPO ? 'PO Date' : 'Bill Date'}</label>
                                <input type="date" className="w-full border-b border-gray-200 py-1 text-sm bg-transparent" />
                            </div>
                         </div>
                     </div>

                     <ItemTable />
                </div>
            </div>
        );
    }

    return null;
};
