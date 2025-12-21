import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react';
import { vendorFetchProducts, vendorCreateProduct } from '../../api';
import { Product } from '../../types';

export const VendorProducts: React.FC = () => {
    const [status, setStatus] = useState<'New' | 'Confirmed' | 'Archived'>('New');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        product_name: '',
        product_category: 'men',
        product_type: 'shirt',
        material: 'Cotton',
        description: '',
        sales_price: 0,
        purchase_price: 0,
        colors: '',
        images: '',
        is_published: true,
    });

    const load = async () => {
        setLoading(true);
        try {
            const data = await vendorFetchProducts();
            setProducts(data);
            setError(null);
        } catch (e) {
            setError('Unable to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const created = await vendorCreateProduct({
                product_name: form.product_name,
                product_category: form.product_category as any,
                product_type: form.product_type as any,
                material: form.material,
                description: form.description,
                sales_price: Number(form.sales_price),
                purchase_price: Number(form.purchase_price),
                colors: form.colors
                    .split(',')
                    .map(c => c.trim())
                    .filter(Boolean),
                images: form.images
                    .split(',')
                    .map(i => i.trim())
                    .filter(Boolean),
                is_published: form.is_published,
            });
            // Optimistically prepend the new product so it shows up immediately
            if (created) {
                setProducts(prev => [created, ...prev]);
            } else {
                await load();
            }
            setForm({
                product_name: '',
                product_category: 'men',
                product_type: 'shirt',
                material: 'Cotton',
                description: '',
                sales_price: 0,
                purchase_price: 0,
                colors: '',
                images: '',
                is_published: true,
            });
        } catch (err) {
            setError('Unable to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            {/* Top Toolbar */}
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div className="flex gap-2">
                    {['New', 'Confirmed', 'Archived'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s as any)}
                            className={`px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                status === s 
                                ? 'bg-[#111111] text-white border-[#111111]' 
                                : 'bg-transparent text-gray-400 border-gray-200 hover:border-[#111111] hover:text-[#111111]'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c9b52e]"></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Published</span>
                    </label>
                    <div className="flex gap-1">
                        <button className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
                        <button className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Form Area */}
            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Product Name</label>
                        <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} type="text" className="w-full border-b border-gray-200 py-2 text-xl font-display font-bold focus:border-[#111111] transition-colors bg-transparent" placeholder="e.g. Essential Heavyweight Hoodie" required />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Gender</label>
                            <select value={form.product_category} onChange={(e) => setForm({ ...form, product_category: e.target.value })} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="children">Children</option>
                                <option value="unisex">Unisex</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Product Type</label>
                            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option value="shirt">Shirt</option>
                                <option value="pant">Pant</option>
                                <option value="t-shirt">T-Shirt</option>
                                <option value="jeans">Jeans</option>
                                <option value="kurta">Kurta</option>
                                <option value="dress">Dress</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Material</label>
                        <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]" />
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 p-3 text-sm bg-transparent focus:border-[#111111]" rows={3} />
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Colors (comma separated)</label>
                        <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]" placeholder="Ecru,Burgundy" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Product Images (comma separated URLs)</label>
                        <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]" placeholder="https://...,https://..." />
                    </div>
                </div>

                {/* Right Column - Pricing */}
                <div className="space-y-8 bg-gray-50 p-8 rounded-xl border border-gray-100">
                    <h3 className="font-anton text-xl tracking-wider mb-6">Pricing</h3>
                    
                    <div className="grid grid-cols-2 gap-8">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Sales Price</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <span className="text-gray-400">₹</span>
                                <input value={form.sales_price} onChange={(e) => setForm({ ...form, sales_price: Number(e.target.value) })} type="number" className="w-full py-2 pl-2 text-sm bg-transparent" placeholder="0.00" required />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#c9b52e] transition-colors">Purchase Price</label>
                            <div className="flex items-center border-b border-gray-200 focus-within:border-[#111111] transition-colors">
                                <span className="text-gray-400">₹</span>
                                <input value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: Number(e.target.value) })} type="number" className="w-full py-2 pl-2 text-sm bg-transparent" placeholder="0.00" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Published</span>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#111111] text-white py-4 rounded-lg text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#c9b52e] transition-colors disabled:opacity-60">
                        {loading ? 'Saving…' : 'Save Product'}
                    </button>
                </div>
            </form>

            <div className="mt-12">
                <h3 className="font-anton text-xl mb-4">Your Products</h3>
                {loading && <p className="text-sm text-gray-500">Loading…</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                            <img src={p.image} className="w-full h-40 object-cover rounded-md mb-3" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest">{p.gender} • {p.category}</div>
                            <div className="font-bold text-lg">{p.name}</div>
                            <div className="text-sm text-gray-600">₹{p.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
