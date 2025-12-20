
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { ArrowRight, Briefcase, Lock, Key } from 'lucide-react';

interface VendorLoginProps {
    setView: (view: ViewState) => void;
}

export const VendorLogin: React.FC<VendorLoginProps> = ({ setView }) => {
    const [vendorPassword, setVendorPassword] = useState('');
    const [vendorId, setVendorId] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setView('VENDOR_DASHBOARD');
    };

    return (
      <div className="min-h-screen flex bg-[#111111]">
          {/* Left Side - Dark Admin Aesthetic */}
          <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
                    alt="Vendor Background"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent"></div>
                
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
                    <div className="font-anton tracking-widest text-2xl text-[#488C5C]">LUVARTE.ADMIN</div>
                    <div className="max-w-lg">
                        <h2 className="text-5xl font-anton uppercase leading-none mb-6">
                            Vendor Portal
                        </h2>
                        <div className="h-1 w-20 bg-[#488C5C] mb-8"></div>
                        <p className="text-sm tracking-[0.2em] font-bold uppercase opacity-60 leading-relaxed mb-4">
                            Manage inventory, track sales performance, and handle financial settlements in real-time.
                        </p>
                        <div className="flex gap-8 mt-12">
                             <div>
                                 <div className="text-2xl font-anton mb-1">15k+</div>
                                 <div className="text-[10px] uppercase tracking-widest opacity-50">Active Users</div>
                             </div>
                             <div>
                                 <div className="text-2xl font-anton mb-1">$2.4M</div>
                                 <div className="text-[10px] uppercase tracking-widest opacity-50">Monthly Volume</div>
                             </div>
                        </div>
                    </div>
                </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 bg-[#F2F4F3] flex items-center justify-center p-8 relative">
              <button 
                  onClick={() => setView('LANDING')} 
                  className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors"
              >
                  Back to Shop <ArrowRight size={14} />
              </button>

              <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
                  <div className="mb-12">
                      <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-full mb-6">
                          <Briefcase size={20} />
                      </div>
                      <h3 className="font-anton text-4xl uppercase mb-2">Restricted Access</h3>
                      <p className="text-gray-400 text-xs uppercase tracking-widest">
                          Authorized Vendors Only
                      </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-8">
                      <div className="group">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Vendor ID</label>
                          <div className="relative">
                              <input 
                                type="text" 
                                value={vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors font-bold placeholder:text-gray-300" 
                                placeholder="VID-0000" 
                              />
                              <Key className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                          </div>
                      </div>

                      <div className="group">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Access Key</label>
                          <div className="relative">
                              <input 
                                type="password" 
                                value={vendorPassword}
                                onChange={(e) => setVendorPassword(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300" 
                                placeholder="••••••••" 
                              />
                              <Lock className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                          </div>
                      </div>

                      <button 
                          type="submit"
                          className="w-full bg-[#111111] text-white py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#488C5C] transition-colors shadow-xl flex items-center justify-center gap-3"
                      >
                          Access Dashboard <ArrowRight size={14} />
                      </button>
                  </form>

                  <div className="mt-12 text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                          Having trouble? <a href="#" className="underline hover:text-[#111111]">Contact Support</a>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    );
};
