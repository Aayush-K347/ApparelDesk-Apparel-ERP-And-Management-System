import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchOffers, fetchCoupons, fetchCustomers, generateCoupons, Offer, CouponRow, PortalUser, createOffer } from '../../api';

type ViewMode = 'DASHBOARD' | 'TERMS_DETAIL' | 'OFFERS_DETAIL';

export const VendorTerms: React.FC = () => {
    const [view, setView] = useState<ViewMode>('DASHBOARD');
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [customerSelection, setCustomerSelection] = useState<'Anonymous' | 'Selected' | 'All'>('Anonymous');
    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
    const [offerName, setOfferName] = useState<string>('');
    const [offerDiscount, setOfferDiscount] = useState<number>(10);
    const [offerStart, setOfferStart] = useState<string>('');
    const [offerEnd, setOfferEnd] = useState<string>('');
    const [offerAvailableOn, setOfferAvailableOn] = useState<string>('website');
    const [coupons, setCoupons] = useState<CouponRow[]>([]);
    const [customers, setCustomers] = useState<PortalUser[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [expiration, setExpiration] = useState<string>('');
    const [maxUsage, setMaxUsage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [offerRes, couponRes, custRes] = await Promise.all([
                    fetchOffers(),
                    fetchCoupons(),
                    fetchCustomers(),
                ]);
                setOffers(offerRes);
                setCoupons(couponRes);
                setCustomers(custRes);
                if (offerRes.length && !selectedOfferId) {
                    setSelectedOfferId(offerRes[0].discount_offer_id);
                    setOfferName(offerRes[0].offer_name);
                    setOfferDiscount(Number(offerRes[0].discount_percentage));
                    setOfferStart(offerRes[0].start_date);
                    setOfferEnd(offerRes[0].end_date);
                    setOfferAvailableOn(offerRes[0].available_on);
                }
            } catch (err: any) {
                setError(err?.message || 'Unable to load offers/coupons');
            }
        })();
    }, []);

    const selectedOffer = useMemo(
        () => offers.find(o => o.discount_offer_id === selectedOfferId),
        [offers, selectedOfferId]
    );

    const refreshCoupons = async (offerId?: number) => {
        const res = await fetchCoupons(offerId ? { offer_id: offerId } : undefined);
        setCoupons(res);
    };

    if (view === 'DASHBOARD') {
        return (
            <div className="p-12 h-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded mb-4">{error}</div>}
                {success && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded mb-4">{success}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                    <div
                        onClick={() => setView('TERMS_DETAIL')}
                        className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                    >
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#488C5C] transition-colors">Payment Terms</h2>
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                            Number of Payment Terms: <span className="text-black text-lg ml-2">—</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setView('OFFERS_DETAIL')}
                        className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                     >
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#488C5C] transition-colors">Offers</h2>
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                            Active Offers: <span className="text-black text-lg ml-2">{offers.length}</span>
                        </div>
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">
                            Coupons Generated: <span className="text-black text-lg ml-2">{coupons.length}</span>
                        </div>
                    </div>
                </div>

                {/* Centered action button linking to localhost:8080 */}
                <div className="w-full max-w-4xl mt-8 flex items-center justify-center">
                    <a href="http://localhost:8080" target="_blank" rel="noreferrer" className="font-anton px-8 py-3 bg-[#488C5C] text-white rounded-[12px] text-sm uppercase tracking-widest hover:bg-[#3a7047] transition-colors">
                        Open External Wallet
                    </a>
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
                     <div className="text-4xl font-anton text-[#488C5C]">15</div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Coupons Generated</div>
                 </div>

                 <div className="max-w-3xl">
                     <div className="space-y-8">
                        <div className="group grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Offer Name</label>
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent"
                                    placeholder="e.g. 10% Discount Coupons"
                                    value={offerName}
                                    onChange={(e)=>setOfferName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Discount %</label>
                                <input
                                    type="number"
                                    className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent"
                                    value={offerDiscount}
                                    onChange={(e)=>setOfferDiscount(Number(e.target.value)||0)}
                                    min={0}
                                    max={100}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Start Date</label>
                                <input type="date" value={offerStart} onChange={(e)=>setOfferStart(e.target.value)} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent" />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">End Date</label>
                                <input type="date" value={offerEnd} onChange={(e)=>setOfferEnd(e.target.value)} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Available On</label>
                            <select
                              value={offerAvailableOn}
                              onChange={(e)=>setOfferAvailableOn(e.target.value)}
                              className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]"
                            >
                              <option value="sales">Sales</option>
                              <option value="website">Website</option>
                              <option value="both">Both</option>
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
                                         <option value="All">All Customers</option>
                                     </select>
                                 </div>

                                 {customerSelection === 'Selected' ? (
                                    <div className="grid grid-cols-3 items-start">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">Customers</label>
                                        <div className="col-span-2 border border-gray-200 p-2 text-sm rounded h-24 overflow-y-auto">
                                            <div className="flex gap-2 flex-wrap">
                                                {customers.map(c => {
                                                    const active = selectedCustomers.includes(c.contact_id);
                                                    return (
                                                        <button
                                                          key={c.contact_id}
                                                          onClick={() => {
                                                            setSelectedCustomers(prev =>
                                                              active
                                                                ? prev.filter(id => id !== c.contact_id)
                                                                : [...prev, c.contact_id]
                                                            );
                                                          }}
                                                          className={`px-2 py-1 rounded text-xs border ${active ? 'bg-[#111111] text-white border-[#111111]' : 'bg-gray-100 border-gray-200'}`}
                                                        >
                                                          {c.contact_name}
                                                        </button>
                                                    );
                                                })}
                                                {!customers.length && <span className="text-xs text-gray-500">No customers</span>}
                                            </div>
                                        </div>
                                    </div>
                                 ) : (
                                    <div className="grid grid-cols-3 items-center">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quantity</label>
                                        <input type="number" className="col-span-2 border border-gray-200 p-2 text-sm rounded" placeholder="1" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value)||1)} />
                                    </div>
                                 )}

                                 <div className="grid grid-cols-3 items-center">
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Valid Until</label>
                                     <input type="date" className="col-span-2 border border-gray-200 p-2 text-sm rounded" value={expiration} onChange={(e)=>setExpiration(e.target.value)} />
                                 </div>
                                 <div className="grid grid-cols-3 items-center">
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Max Usage</label>
                                     <input type="number" className="col-span-2 border border-gray-200 p-2 text-sm rounded" value={maxUsage} min={1} onChange={(e)=>setMaxUsage(Number(e.target.value)||1)} />
                                 </div>
                             </div>
                             
                             <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
                                 <button onClick={() => setShowCouponModal(false)} className="px-6 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                                 <button onClick={() => setShowCouponModal(false)} className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#488C5C]">Generate</button>
                             </div>
                         </div>
                     </div>
                 )}

                 {/* Coupons table */}
                 <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                        <div>
                            <p className="font-anton text-2xl">Coupons</p>
                            <p className="text-sm text-gray-500">Click generate to add new codes.</p>
                        </div>
                        <button
                          className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest rounded"
                          onClick={() => {
                            setError(null); setSuccess(null); setShowCouponModal(true);
                          }}
                        >
                          Generate Coupon Codes
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[11px] uppercase tracking-[0.15em] text-gray-500">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Valid Until</th>
                                    <th className="px-6 py-3">Program</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Customer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map(c => (
                                    <tr key={c.coupon_id} className="text-sm">
                                        <td className="px-6 py-3 font-anton text-lg">{c.coupon_code}</td>
                                        <td className="px-6 py-3">{c.expiration_date}</td>
                                        <td className="px-6 py-3">{c.discount_offer?.offer_name || '—'}</td>
                                        <td className="px-6 py-3 uppercase text-xs">
                                            <span className={`px-2 py-1 rounded-full border ${
                                                c.coupon_status === 'unused' ? 'border-green-200 text-green-700 bg-green-50' :
                                                c.coupon_status === 'used' ? 'border-gray-300 text-gray-600 bg-gray-50' :
                                                'border-red-200 text-red-600 bg-red-50'
                                            }`}>
                                                {c.coupon_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">{c.contact_detail?.contact_name || 'Anonymous'}</td>
                                    </tr>
                                ))}
                                {!coupons.length && (
                                    <tr><td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>No coupons generated yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        );
    }

    return null;
};
