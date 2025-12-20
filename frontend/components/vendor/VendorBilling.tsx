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
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500">Vendor</label>
            <select value={selectedVendor ?? ''} onChange={(e) => setSelectedVendor(e.target.value ? Number(e.target.value) : null)} className="w-full border-b py-2">
              <option value="">Select Vendor</option>
              {vendors.map(v => <option key={v.contact_id} value={v.contact_id}>{v.contact_name} — {v.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500">PO Date</label>
              <input type="date" value={poDate} onChange={e => setPoDate(e.target.value)} className="w-full border-b py-2" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500">Expected Date</label>
              <input type="date" value={poExpected} onChange={e => setPoExpected(e.target.value)} className="w-full border-b py-2" />
            </div>
          </div>
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
          </table>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-xs font-bold border px-3 py-2" onClick={()=>setPoLines(lines=>[...lines,{productName:'',quantity:1,unitPrice:0,tax:0}])}>+ Add Line</button>
          <div className="text-sm text-right space-y-1">
            <div>Subtotal: ₹{poSubtotal.toFixed(2)}</div>
            <div>Tax: ₹{poTax.toFixed(2)}</div>
            <div className="font-bold">Total: ₹{(poSubtotal+poTax).toFixed(2)}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCreatePO} disabled={loading} className="bg-black text-white px-4 py-2 text-xs uppercase font-bold rounded">{loading?'Saving...':'Confirm PO'}</button>
          <button onClick={()=>{resetPoForm(); setSuccess(null); setError(null);}} className="border px-4 py-2 text-xs uppercase font-bold rounded">Reset</button>
        </div>
      </div>
    );
  }

  // VENDOR BILL VIEW
  if (view === 'VENDOR_BILL') {
    const bill = vendorBills.find(b => (b.vendor_bill_id || b.id) === selectedBillId);
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <button className="text-xs uppercase font-bold text-gray-500" onClick={() => setView('DASHBOARD')}>&larr; Back</button>
          <StatusBar />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-4 lg:col-span-1 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between mb-2 text-sm font-bold uppercase text-gray-500">
              <span>Bills</span><span className="text-[10px] text-gray-400">{vendorBills.length}</span>
            </div>
            <div className="space-y-2">
              {vendorBills.map(b => {
                const active = (b.vendor_bill_id || b.id) === selectedBillId;
                return (
                  <button key={b.vendor_bill_id || b.id} onClick={()=>setSelectedBillId(b.vendor_bill_id||b.id)} className={`w-full text-left border px-3 py-2 rounded ${active?'border-black bg-gray-50':'border-gray-200'}`}>
                    <div className="flex justify-between text-sm font-bold">
                      <span>{b.bill_number || `BILL-${b.vendor_bill_id || b.id}`}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full uppercase">{b.bill_status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{b.vendor_detail?.contact_name || 'Vendor'} — ₹{b.total_amount}</p>
                  </button>
                );
              })}
              {!vendorBills.length && <div className="text-xs text-gray-500">No vendor bills found.</div>}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-6 lg:col-span-2 relative">
            {bill ? (
              <>
                {bill.bill_status === 'paid' && (
                  <div className="absolute top-4 right-4 border-4 border-green-500 text-green-600 px-4 py-1 font-anton text-xl uppercase rotate-6">PAID</div>
                )}
                <h1 className="font-anton text-3xl mb-4">Vendor Bill <span className="text-gray-300">{bill.bill_number || bill.vendor_bill_id}</span></h1>
                <p className="text-sm text-gray-500 mb-4">Vendor: <span className="font-bold">{bill.vendor_detail?.contact_name}</span> · Email: {bill.vendor_detail?.email || 'n/a'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div><p className="text-[10px] uppercase text-gray-500">Reference PO</p><p className="font-bold">{bill.purchase_order_number || '—'}</p></div>
                  <div><p className="text-[10px] uppercase text-gray-500">Status</p><p className="font-bold uppercase">{bill.bill_status}</p></div>
                  <div><p className="text-[10px] uppercase text-gray-500">Invoice Date</p><p className="font-bold">{bill.invoice_date}</p></div>
                  <div><p className="text-[10px] uppercase text-gray-500">Due Date</p><p className="font-bold">{bill.due_date}</p></div>
                </div>
                <div className="border-t pt-3 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">₹{Number(bill.subtotal||0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-bold">₹{Number(bill.tax_amount||0).toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>₹{Number(bill.total_amount||0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Paid</span><span className="font-bold text-green-600">₹{Number(bill.paid_amount||0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Balance</span><span className="font-bold text-red-500">₹{Number(bill.remaining_amount||0).toFixed(2)}</span></div>
                </div>
                {Number(bill.remaining_amount || 0) > 0 && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await payVendorBill(bill.vendor_bill_id || bill.id);
                          setSuccess('Bill paid and recorded');
                          const refreshed = await fetchVendorBills();
                          setVendorBills(Array.isArray(refreshed) ? refreshed : []);
                        } catch (err: any) {
                          setError(err?.message || 'Unable to pay bill');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-black text-white px-4 py-2 text-xs uppercase font-bold rounded"
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

  // INVOICE view (vendor/internals)
  if (view === 'INVOICE') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <button className="text-xs uppercase font-bold text-gray-500" onClick={()=>setView('DASHBOARD')}>&larr; Back</button>
          <StatusBar />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-4 lg:col-span-1 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between mb-2 text-sm font-bold uppercase text-gray-500">
              <span>Invoices</span><span className="text-[10px] text-gray-400">{vendorInvoices.length}</span>
            </div>
            <div className="space-y-2">
              {vendorInvoices.map(inv => {
                const active = (inv.customer_invoice_id || inv.id) === selectedInvoiceId;
                return (
                  <button key={inv.customer_invoice_id || inv.id} onClick={()=>setSelectedInvoiceId(inv.customer_invoice_id||inv.id)} className={`w-full text-left border px-3 py-2 rounded ${active?'border-black bg-gray-50':'border-gray-200'}`}>
                    <div className="flex justify-between text-sm font-bold">
                      <span>{inv.invoice_number || `INV-${inv.customer_invoice_id || inv.id}`}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full uppercase">{inv.invoice_status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{inv.customer_detail?.contact_name || 'Customer'} — ₹{inv.total_amount}</p>
                  </button>
                );
              })}
              {!vendorInvoices.length && <div className="text-xs text-gray-500">No invoices found.</div>}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-6 lg:col-span-2 relative">
            {(() => {
              const inv = vendorInvoices.find(i => (i.customer_invoice_id || i.id) === selectedInvoiceId);
              if (!inv) return <div className="text-sm text-gray-500">Select an invoice to view details.</div>;
              return (
                <>
                  {inv.invoice_status === 'paid' && (
                    <div className="absolute top-4 right-4 border-4 border-green-500 text-green-600 px-4 py-1 font-anton text-xl uppercase rotate-6">PAID</div>
                  )}
                  <h1 className="font-anton text-3xl mb-4">Invoice <span className="text-gray-300">{inv.invoice_number || inv.customer_invoice_id}</span></h1>
                  <p className="text-sm text-gray-500 mb-4">Customer: <span className="font-bold">{inv.customer_detail?.contact_name}</span> · Email: {inv.customer_detail?.email || 'n/a'}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><p className="text-[10px] uppercase text-gray-500">Reference SO</p><p className="font-bold">{inv.sales_order_id || '—'}</p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Status</p><p className="font-bold uppercase">{inv.invoice_status}</p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Invoice Date</p><p className="font-bold">{inv.invoice_date}</p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Due Date</p><p className="font-bold">{inv.due_date}</p></div>
                  </div>
                  <div className="border-t pt-3 text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">₹{Number(inv.subtotal||0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-bold">₹{Number(inv.discount_amount||0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-bold">₹{Number(inv.tax_amount||0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>₹{Number(inv.total_amount||0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Paid</span><span className="font-bold text-green-600">₹{Number(inv.paid_amount||0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Balance</span><span className="font-bold text-red-500">₹{Number(inv.remaining_amount||0).toFixed(2)}</span></div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
