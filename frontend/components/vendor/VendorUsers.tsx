import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Users as UsersIcon } from 'lucide-react';

type UserView = 'DASHBOARD' | 'USER_LIST' | 'CONTACT_LIST' | 'USER_DETAIL' | 'CONTACT_DETAIL';

export const VendorUsers: React.FC = () => {
    const [view, setView] = useState<UserView>('DASHBOARD');
    const [status, setStatus] = useState<'New' | 'Confirmed' | 'Archived'>('New');

    // Dashboard View
    if (view === 'DASHBOARD') {
        return (
            <div className="p-12 h-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                     {/* Users Card */}
                     <div 
                        onClick={() => setView('USER_DETAIL')} // Skip list for demo, go straight to detail form as per wireframe implication of "New"
                        className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <User size={100} />
                        </div>
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#c9b52e] transition-colors">Users</h2>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Internal Users</span>
                                <span className="font-bold text-lg">10</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Portal Users</span>
                                <span className="font-bold text-lg">354</span>
                             </div>
                        </div>
                     </div>

                     {/* Contacts Card */}
                     <div 
                        onClick={() => setView('CONTACT_DETAIL')} 
                        className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <UsersIcon size={100} />
                        </div>
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#c9b52e] transition-colors">Contacts</h2>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Customers</span>
                                <span className="font-bold text-lg">364</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Vendors</span>
                                <span className="font-bold text-lg">25</span>
                             </div>
                        </div>
                     </div>
                 </div>
            </div>
        );
    }

    // Shared Header for forms
    const Header = ({ title }: { title: string }) => (
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-6">
                <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                    &larr; Back
                </button>
                <h2 className="font-anton text-2xl uppercase tracking-wide">{title}</h2>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="flex gap-2">
                    {['New', 'Confirmed', 'Archived'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s as any)}
                            className={`px-4 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                status === s 
                                ? 'bg-[#111111] text-white border-[#111111]' 
                                : 'bg-transparent text-gray-400 border-gray-200 hover:border-[#111111] hover:text-[#111111]'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                {title === 'Users' && (
                     <button className="px-4 py-1.5 border border-gray-200 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                        Change Password
                     </button>
                )}
                <div className="flex gap-1 ml-4">
                    <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={14} /></button>
                    <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={14} /></button>
                </div>
            </div>
        </div>
    );

    if (view === 'USER_DETAIL') {
        return (
            <div className="p-8 h-full animate-[fadeIn_0.3s_ease-out]">
                <Header title="Users" />
                <div className="max-w-3xl">
                    <div className="space-y-6">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">User Name</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
                            <input type="email" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Phone</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                        </div>
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Address</label>
                            <div className="space-y-2">
                                <input type="text" placeholder="Street" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                <div className="grid grid-cols-3 gap-4">
                                     <input type="text" placeholder="City" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                     <input type="text" placeholder="State" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                     <input type="text" placeholder="Pincode" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                </div>
                            </div>
                        </div>
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Role</label>
                            <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option>Internal User</option>
                                <option>Portal User</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'CONTACT_DETAIL') {
        return (
            <div className="p-8 h-full animate-[fadeIn_0.3s_ease-out]">
                <Header title="Contacts" />
                <div className="max-w-3xl">
                    <div className="space-y-6">
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Contact Name</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
                            <input type="email" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Phone</label>
                            <input type="text" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                        </div>
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Address</label>
                            <div className="space-y-2">
                                <input type="text" placeholder="Street" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                <div className="grid grid-cols-3 gap-4">
                                     <input type="text" placeholder="City" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                     <input type="text" placeholder="State" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                     <input type="text" placeholder="Pincode" className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent" />
                                </div>
                            </div>
                        </div>
                         <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Type</label>
                            <select className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111]">
                                <option>Customer</option>
                                <option>Vendor</option>
                                <option>Both</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};