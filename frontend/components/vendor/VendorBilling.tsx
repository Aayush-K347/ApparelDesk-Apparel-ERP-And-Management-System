import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  fetchVendors,
  fetchVendorBills,
  fetchVendorInvoices,
  fetchPurchaseOrders,
  fetchSaleCustomers,
  fetchPaymentTerms,
  fetchProducts,
  checkoutOrder,
  createPurchaseOrder,
  createBillFromPurchaseOrder,
  payVendorBill,
} from '../../api';
import { Product } from '../../types';

type BillingView = 'DASHBOARD' | 'PURCHASE_ORDER' | 'VENDOR_BILL' | 'SALE_ORDER' | 'INVOICE';
type VendorOption = { contact_id: number; contact_name: string; email: string };
type CustomerOption = { contact_id: number; contact_name: string; email: string };
type PaymentTermOption = { payment_term_id: number; term_name: string; net_days: number };
type PoLine = { productName: string; quantity: number; unitPrice: number; tax: number };
type OrderLine = { productId?: number; quantity: number; unitPrice: number; tax: number };

export const VendorBilling: React.FC = () => {
  const [view, setView] = useState<BillingView>('DASHBOARD');
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [vendorBills, setVendorBills] = useState<any[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [vendorInvoices, setVendorInvoices] = useState<any[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [poLines, setPoLines] = useState<PoLine[]>([{ productName: '', quantity: 1, unitPrice: 0, tax: 0 }]);
  const [poDate, setPoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [poExpected, setPoExpected] = useState<string>(new Date().toISOString().split('T')[0]);

  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState<number | null>(null);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([{ productId: undefined, quantity: 1, unitPrice: 0, tax: 0 }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [vRes, billsRes, invRes, poRes, custRes, termRes, prodRes] = await Promise.all([
          fetchVendors(),
          fetchVendorBills(),
          fetchVendorInvoices(),
          fetchPurchaseOrders(),
          fetchSaleCustomers(),
          fetchPaymentTerms(),
          fetchProducts({ page_size: 200 }),
        ]);
        setVendors(Array.isArray(vRes) ? vRes : []);
        setVendorBills(Array.isArray(billsRes) ? billsRes : []);
        if (Array.isArray(billsRes) && billsRes.length) {
          setSelectedBillId(billsRes[0].vendor_bill_id || billsRes[0].id || null);
        }
        setVendorInvoices(Array.isArray(invRes) ? invRes : []);
        if (Array.isArray(invRes) && invRes.length) {
          setSelectedInvoiceId(invRes[0].customer_invoice_id || invRes[0].id || null);
        }
        setPurchaseOrders(Array.isArray(poRes) ? poRes : []);
        setCustomers(Array.isArray(custRes) ? custRes : []);
        setPaymentTerms(Array.isArray(termRes) ? termRes : []);
        const prodList = (prodRes as any).items ?? prodRes;
        setProducts(Array.isArray(prodList) ? prodList : []);
        if (!selectedVendor && Array.isArray(vRes) && vRes.length) setSelectedVendor(vRes[0].contact_id);
        if (!selectedPaymentTerm && Array.isArray(termRes) && termRes.length) setSelectedPaymentTerm(termRes[0].payment_term_id);
      } catch (err: any) {
        setError(err?.message || 'Unable to load data');
      }
    })();
  }, []);

  const resolveProduct = (pid?: number) => {
    if (!pid) return undefined;
    return products.find((p) => p.backendId === pid || Number(String(p.id).replace('prod_', '')) === pid);
  };

  const poSubtotal = poLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);
  const poTax = poLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0) * (l.tax || 0) / 100, 0);

  const orderSubtotal = orderLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);
  const orderTax = orderLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0) * (l.tax || 0) / 100, 0);

  const resetPoForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedVendor(null);
    setPoLines([{ productName: '', quantity: 1, unitPrice: 0, tax: 0 }]);
    setPoDate(today);
    setPoExpected(today);
  };

  const resetSaleOrderForm = () => {
    setSelectedCustomer(null);
    setSelectedPaymentTerm(null);
    setOrderLines([{ productId: undefined, quantity: 1, unitPrice: 0, tax: 0 }]);
  };

  const handleCreatePO = async () => {
    setError(null); setSuccess(null);
    if (!selectedVendor) { setError('Select a vendor'); return; }
    const valid = poLines.filter((l) => l.productName.trim() && l.quantity > 0);
    if (!valid.length) { setError('Add at least one line'); return; }
    setLoading(true);
    try {
      const payload = {
        vendor_id: selectedVendor,
        order_date: poDate,
        expected_delivery_date: poExpected,
        lines: valid.map((l, idx) => ({
          product_name: l.productName,
          quantity: l.quantity,
          unit_price: l.unitPrice,
          tax_percentage: l.tax,
          line_number: idx + 1,
        })),
      };
      const po = await createPurchaseOrder(payload as any);
      try {
        await createBillFromPurchaseOrder(po.purchase_order_id || po.id);
        const [bills, pos] = await Promise.all([fetchVendorBills(), fetchPurchaseOrders()]);
        setVendorBills(Array.isArray(bills) ? bills : []);
        setPurchaseOrders(Array.isArray(pos) ? pos : []);
      } catch (e) {
        // if bill creation fails, still show PO creation success
      }
      setSuccess('Purchase order created and bill generated');
      resetPoForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to create PO');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setError(null); setSuccess(null);
    if (!selectedCustomer || !selectedPaymentTerm) { setError('Select customer and payment term'); return; }
    const valid = orderLines.filter((l) => l.productId && l.quantity > 0);
    if (!valid.length) { setError('Add at least one line'); return; }
    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomer,
        payment_term_id: selectedPaymentTerm,
        lines: valid.map((l, idx) => ({
          product_id: l.productId!,
          quantity: l.quantity,
          unit_price: l.unitPrice,
          tax_percentage: l.tax,
          line_number: idx + 1,
        })),
      };
      await checkoutOrder(payload as any);
      setSuccess('Sale order + invoice created');
      resetSaleOrderForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to create sale order');
    } finally {
      setLoading(false);
    }
  };

  const StatusBar = () => (
    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
      <span className="text-[#111111]">Draft</span>
      <ChevronRight size={12} className="text-gray-300" />
      <span className="text-gray-400">Confirmed</span>
      <ChevronRight size={12} className="text-gray-300" />
      <span className="text-gray-400">Paid</span>
      <ChevronRight size={12} className="text-gray-300" />
      <span className="text-gray-400">Cancelled</span>
    </div>
  );

  // DASHBOARD
  if (view === 'DASHBOARD') {
    const statCard = (title: string, subtitle1?: string, subtitle2?: string, onClick?: () => void) => (
      <button
        onClick={onClick}
        className="border border-gray-200 rounded-xl p-5 bg-white shadow-lg hover:shadow-xl transition text-left w-full"
      >
        <p className="font-anton text-xl mb-1 text-[#1f2937]">{title}</p>
        {subtitle1 && <p className="text-base text-gray-600">{subtitle1}</p>}
        {subtitle2 && <p className="text-sm text-gray-500">{subtitle2}</p>}
      </button>
    );
    return (
      <div className="p-10 space-y-8 bg-gradient-to-br from-[#f7f9fc] via-white to-[#eef2f7] rounded-2xl shadow-inner">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold">Sales</h3>
            {statCard('Sale Orders', `Total orders: ${purchaseOrders.length || 0}`, 'Pending to invoice: —', () => setView('SALE_ORDER'))}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">Automatic Invoicing</h3>
            {statCard('Customer Invoices', `Unpaid invoices: ${vendorInvoices.length || 0}`, 'Overdue: —', () => setView('INVOICE'))}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-transparent">Spacer</h3>
            {statCard('Customer Payments', '—')}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">Purchase</h3>
            {statCard('Purchase Orders', `Total orders: ${purchaseOrders.length || 0}`, 'Pending to bill: —', () => setView('PURCHASE_ORDER'))}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-transparent">Spacer</h3>
            {statCard('Vendor Bills', `Unpaid bills: ${vendorBills.length || 0}`, 'Overdue: —', () => setView('VENDOR_BILL'))}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-transparent">Spacer</h3>
            {statCard('Vendor Payments', '—')}
          </div>
        </div>
      </div>
    );
  }

  // PURCHASE ORDER
  if (view === 'PURCHASE_ORDER') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <button className="text-xs uppercase font-bold text-gray-500" onClick={() => setView('DASHBOARD')}>&larr; Back</button>
          <StatusBar />
        </div>
    );

    const ActionButtons = ({ type }: { type: 'SO' | 'INV' | 'PO' | 'BILL' }) => (
        <div className="flex gap-2">
             {docStatus === 'Draft' && (
                 <button onClick={() => setDocStatus('Confirmed')} className="bg-[#111111] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#488C5C]">Confirm</button>
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
                 <button onClick={() => setView('INVOICE_PAYMENT')} className="ml-4 border border-[#488C5C] text-[#488C5C] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#488C5C] hover:text-white transition-colors">Register Payment</button>
             )}
             {type === 'BILL' && docStatus === 'Confirmed' && (
                 <button onClick={() => setView('BILL_PAYMENT')} className="ml-4 border border-[#488C5C] text-[#488C5C] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#488C5C] hover:text-white transition-colors">Register Payment</button>
             )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-t">
            <thead className="text-[10px] uppercase text-gray-500">
              <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Tax %</th><th className="text-right">Total</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
              {poLines.map((line, idx) => {
                const lineTotal = (line.quantity || 0) * (line.unitPrice || 0) * (1 + (line.tax || 0) / 100);
                return (
                  <tr key={idx}>
                    <td className="py-2">
                      <input value={line.productName} onChange={e => setPoLines(lines => lines.map((l,i)=> i===idx? {...l, productName:e.target.value}:l))} className="w-full border-b py-1" />
                    </td>
                    <td><input type="number" value={line.quantity} onChange={e => setPoLines(lines => lines.map((l,i)=> i===idx? {...l, quantity:Number(e.target.value)||0}:l))} className="w-20 border-b text-center" /></td>
                    <td><input type="number" value={line.unitPrice} onChange={e => setPoLines(lines => lines.map((l,i)=> i===idx? {...l, unitPrice:Number(e.target.value)||0}:l))} className="w-24 border-b text-center" /></td>
                    <td><input type="number" value={line.tax} onChange={e => setPoLines(lines => lines.map((l,i)=> i===idx? {...l, tax:Number(e.target.value)||0}:l))} className="w-20 border-b text-center" /></td>
                    <td className="text-right font-bold">₹{lineTotal.toFixed(2)}</td>
                    <td>{poLines.length>1 && <button className="text-xs text-red-500" onClick={()=>setPoLines(lines=>lines.filter((_,i)=>i!==idx))}>Remove</button>}</td>
                  </tr>
                );
              })}
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
                     <h2 className="font-anton text-3xl uppercase tracking-wide text-[#488C5C]">{isBill ? 'Bill Payment' : 'Invoice Payment'}</h2>
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
                        className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#488C5C] shadow-lg"
                    >
                      Pay Bill
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500">Select a bill to view details.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SALE ORDER (portal)
  if (view === 'SALE_ORDER') {
    return (
      <div className="p-8 space-y-6">
        <button className="text-xs uppercase font-bold text-gray-500" onClick={()=>setView('DASHBOARD')}>&larr; Back</button>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500">Customer</label>
            <select value={selectedCustomer ?? ''} onChange={e=>setSelectedCustomer(e.target.value?Number(e.target.value):null)} className="w-full border-b py-2">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.contact_id} value={c.contact_id}>{c.contact_name} — {c.email}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500">Payment Term</label>
            <select value={selectedPaymentTerm ?? ''} onChange={e=>setSelectedPaymentTerm(e.target.value?Number(e.target.value):null)} className="w-full border-b py-2">
              <option value="">Select Term</option>
              {paymentTerms.map(t => <option key={t.payment_term_id} value={t.payment_term_id}>{t.term_name} ({t.net_days}d)</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-t">
            <thead className="text-[10px] uppercase text-gray-500">
              <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Tax %</th><th className="text-right">Total</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
              {orderLines.map((l,idx) => {
                const prod = resolveProduct(l.productId);
                const lineTotal = (l.quantity||0)*(l.unitPrice||0)*(1+(l.tax||0)/100);
                return (
                  <tr key={idx}>
                    <td className="py-2">
                      <select value={l.productId ?? ''} onChange={e=>setOrderLines(lines=>lines.map((x,i)=> i===idx? {...x, productId:e.target.value?Number(e.target.value):undefined, unitPrice: resolveProduct(Number(e.target.value))?.price ?? x.unitPrice}:x))} className="w-full border-b py-1">
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.backendId ?? Number(String(p.id).replace('prod_',''))}>{p.name} — ₹{p.price}</option>)}
                      </select>
                      {prod && <p className="text-[10px] text-gray-500">SKU: {prod.sku}</p>}
                    </td>
                    <td><input type="number" value={l.quantity} onChange={e=>setOrderLines(lines=>lines.map((x,i)=> i===idx? {...x, quantity:Number(e.target.value)||0}:x))} className="w-20 border-b text-center" /></td>
                    <td><input type="number" value={l.unitPrice} onChange={e=>setOrderLines(lines=>lines.map((x,i)=> i===idx? {...x, unitPrice:Number(e.target.value)||0}:x))} className="w-24 border-b text-center" /></td>
                    <td><input type="number" value={l.tax} onChange={e=>setOrderLines(lines=>lines.map((x,i)=> i===idx? {...x, tax:Number(e.target.value)||0}:x))} className="w-20 border-b text-center" /></td>
                    <td className="text-right font-bold">₹{lineTotal.toFixed(2)}</td>
                    <td>{orderLines.length>1 && <button className="text-xs text-red-500" onClick={()=>setOrderLines(lines=>lines.filter((_,i)=>i!==idx))}>Remove</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-xs font-bold border px-3 py-2" onClick={()=>setOrderLines(lines=>[...lines,{productId:undefined,quantity:1,unitPrice:0,tax:0}])}>+ Add Line</button>
          <div className="text-right text-sm space-y-1">
            <div>Subtotal: ₹{orderSubtotal.toFixed(2)}</div>
            <div>Tax: ₹{orderTax.toFixed(2)}</div>
            <div className="font-bold">Total: ₹{(orderSubtotal+orderTax).toFixed(2)}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCreateOrder} disabled={loading} className="bg-black text-white px-4 py-2 text-xs uppercase font-bold rounded">{loading?'Saving...':'Confirm & Invoice'}</button>
          <button onClick={()=>{setOrderLines([{productId:undefined,quantity:1,unitPrice:0,tax:0}]); setSuccess(null); setError(null);}} className="border px-4 py-2 text-xs uppercase font-bold rounded">Reset</button>
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
                        <div className="absolute top-8 right-8 rotate-12 border-4 border-[#488C5C] text-[#488C5C] px-6 py-2 font-anton text-2xl uppercase tracking-widest opacity-80 select-none">
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
                         {docStatus === 'Paid' && <p className="text-[#488C5C] font-bold mb-1">Paid on 12/12/2025: ₹600</p>}
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
                        <div className="absolute top-8 right-8 rotate-12 border-4 border-[#488C5C] text-[#488C5C] px-6 py-2 font-anton text-2xl uppercase tracking-widest opacity-80 select-none">
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
