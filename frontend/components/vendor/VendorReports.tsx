import React, { useEffect, useState } from 'react';
import { fetchVendorInvoices, fetchVendorBills, fetchReportSummary } from '../../api';

export const VendorReports: React.FC = () => {
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [billCount, setBillCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [groupBy, setGroupBy] = useState<'product' | 'contact'>('product');
    const [rows, setRows] = useState<any[]>([]);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [inv, bills, summary] = await Promise.all([
                    fetchVendorInvoices(),
                    fetchVendorBills(),
                    fetchReportSummary(groupBy),
                ]);
                setInvoiceCount(Array.isArray(inv) ? inv.length : 0);
                setBillCount(Array.isArray(bills) ? bills.length : 0);
                setRows(summary?.rows || []);
            } catch (err: any) {
                setError(err?.message || 'Unable to load report data');
            }
        })();
    }, [groupBy]);

    return (
        <div className="p-12 h-full flex items-center justify-center animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 w-full max-w-2xl">
                <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide border-b border-gray-100 pb-4">Generate Report</h2>
                
                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded mb-6">{error}</div>}

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer Invoices</p>
                        <p className="font-anton text-3xl">{invoiceCount}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Vendor Bills</p>
                        <p className="font-anton text-3xl">{billCount}</p>
                    </div>
                </div>

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
                        <select
                          className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]"
                          value={groupBy}
                          onChange={(e)=>setGroupBy(e.target.value as any)}
                        >
                            <option value="product">Product</option>
                            <option value="contact">Contact</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">From</label>
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e)=>setFromDate(e.target.value)}
                          className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]"
                        />
                    </div>

                    <div className="grid grid-cols-3 items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">To</label>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e)=>setToDate(e.target.value)}
                          className="col-span-2 border-b border-gray-200 py-2 bg-transparent text-sm focus:border-[#111111]"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
                    <button className="px-8 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Cancel</button>
                    <button
                        className="px-8 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c9b52e] transition-colors shadow-lg"
                        onClick={() => {
                            const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').toString().replace(/\/$/, '');
                            window.open(`${base}/api/sales/reports/invoices-bills.pdf?group_by=${groupBy}`, '_blank');
                        }}
                    >
                        Print / Download PDF
                    </button>
                </div>

                <div className="mt-10 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-anton text-xl">Report Preview</h3>
                        <p className="text-xs text-gray-500">Grouped by {groupBy === 'product' ? 'Product' : 'Contact'}</p>
                    </div>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <button
                          className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#c9b52e] transition"
                          disabled={!fromDate || !toDate}
                          onClick={() => setShowTable(true)}
                        >
                          Show Tabular Data
                        </button>
                        {!fromDate || !toDate ? (
                          <span className="text-xs text-gray-500">Select From/To dates to enable.</span>
                        ) : null}
                    </div>
                    {showTable ? (
                      <div className="overflow-x-auto">
                          <table className="w-full">
                              <thead className="bg-gray-50 text-[11px] uppercase tracking-[0.2em] text-gray-500">
                                  <tr>
                                      {groupBy === 'product' ? (
                                          <>
                                              <th className="px-6 py-3 text-left font-anton">Product</th>
                                              <th className="px-6 py-3 text-left font-anton">Sales Total</th>
                                              <th className="px-6 py-3 text-left font-anton">Purchase Total</th>
                                          </>
                                      ) : (
                                          <>
                                              <th className="px-6 py-3 text-left font-anton">Partner</th>
                                              <th className="px-6 py-3 text-left font-anton">Invoice Total</th>
                                              <th className="px-6 py-3 text-left font-anton">Bill Total</th>
                                          </>
                                      )}
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {rows.map((r, idx) => (
                                      <tr key={idx} className="text-sm">
                                          {groupBy === 'product' ? (
                                              <>
                                                  <td className="px-6 py-3 font-anton">{r.product}</td>
                                                  <td className="px-6 py-3">₹{Number(r.sales_total || 0).toFixed(2)}</td>
                                                  <td className="px-6 py-3">₹{Number(r.purchase_total || 0).toFixed(2)}</td>
                                              </>
                                          ) : (
                                              <>
                                                  <td className="px-6 py-3 font-anton">{r.partner}</td>
                                                  <td className="px-6 py-3">₹{Number(r.invoice_total || 0).toFixed(2)}</td>
                                                  <td className="px-6 py-3">₹{Number(r.bill_total || 0).toFixed(2)}</td>
                                              </>
                                          )}
                                      </tr>
                                  ))}
                                  {!rows.length && (
                                      <tr><td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>No data available.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                    ) : (
                      <div className="px-6 py-6 text-sm text-gray-500">Tabular data will appear after you set dates and click "Show Tabular Data".</div>
                    )}
                </div>
            </div>
        </div>
    );
};
