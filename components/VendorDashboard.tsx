import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
    LayoutDashboard, Box, Receipt, FileText, Users, BarChart3, 
    Settings, HelpCircle, LogOut, Search, Bell, ChevronDown, Gem, 
    CreditCard, ArrowUpRight
} from 'lucide-react';
import { VendorHome } from './vendor/VendorHome';
import { VendorProducts } from './vendor/VendorProducts';
import { VendorUsers } from './vendor/VendorUsers';
import { VendorTerms } from './vendor/VendorTerms';
import { VendorBilling } from './vendor/VendorBilling';
import { VendorReports } from './vendor/VendorReports';

interface VendorDashboardProps {
    setView: (view: ViewState) => void;
}

export type VendorTab = 'DASHBOARD' | 'PRODUCTS' | 'BILLING' | 'TERMS' | 'USERS' | 'REPORTS';

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ setView }) => {
  const [activeTab, setActiveTab] = useState<VendorTab>('DASHBOARD');

  const menuItems = [
      { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'PRODUCTS', label: 'Products', icon: Box },
      { id: 'BILLING', label: 'Transactions', icon: Receipt },
      { id: 'TERMS', label: 'My Wallet', icon: CreditCard }, // Mapped Terms to Wallet concept for UI match
      { id: 'USERS', label: 'Contacts', icon: Users },
      { id: 'REPORTS', label: 'Reports', icon: BarChart3 },
  ];

  const renderContent = () => {
      switch(activeTab) {
          case 'DASHBOARD': return <VendorHome />;
          case 'PRODUCTS': return <VendorProducts />;
          case 'BILLING': return <VendorBilling />;
          case 'TERMS': return <VendorTerms />;
          case 'USERS': return <VendorUsers />;
          case 'REPORTS': return <VendorReports />;
          default: return <VendorHome />;
      }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans text-[#111111] flex overflow-hidden selection:bg-[#488C5C] selection:text-white">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col border-r border-gray-100 flex-shrink-0 z-20">
          
          {/* User Profile Card (Top Left as per reference) */}
          <div className="p-6 pb-2">
              <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => setView('LANDING')}>
                  <div className="w-8 h-8 bg-[#488C5C] text-white rounded-full flex items-center justify-center font-anton text-sm">L</div>
                  <span className="font-anton text-xl tracking-wide">LUVARTE</span>
              </div>

              <div className="bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] rounded-[20px] p-4 flex items-center gap-3 mb-6 relative overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="Profile" />
                  <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">Yash Shah</h4>
                      <p className="text-[10px] text-gray-400 truncate">Administrator</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
              </div>
          </div>

          {/* Main Menu */}
          <div className="px-6 flex-1 overflow-y-auto no-scrollbar">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Main Menu</p>
              <nav className="space-y-1">
                  {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-sm font-bold transition-all duration-300 group
                            ${activeTab === item.id 
                                ? 'bg-[#111111] text-white shadow-lg shadow-black/10' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#111111]'
                            }`}
                      >
                          <item.icon size={18} strokeWidth={2} className={`${activeTab === item.id ? 'text-[#488C5C]' : 'text-gray-400 group-hover:text-[#111111]'}`} />
                          {item.label}
                      </button>
                  ))}
              </nav>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2 mt-8">Preference</p>
              <nav className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-all">
                      <Settings size={18} strokeWidth={2} className="text-gray-400" />
                      Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-all">
                      <HelpCircle size={18} strokeWidth={2} className="text-gray-400" />
                      Help Center
                  </button>
              </nav>
          </div>

          {/* Upgrade Plan Card */}
          <div className="p-6">
              <div className="bg-[#111111] rounded-[24px] p-6 text-center text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#488C5C] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                       <Gem size={18} className="text-[#488C5C]" />
                   </div>
                   <h4 className="font-anton uppercase tracking-wide text-lg mb-2">Upgrade Plan</h4>
                   <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">Unlock smarter insights and financial control.</p>
                   <button className="w-full py-3 bg-[#488C5C] rounded-[14px] text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-colors">
                       Upgrade Now
                   </button>
              </div>
          </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 z-10">
              <div>
                  <h1 className="font-anton text-2xl uppercase tracking-wide">
                      {menuItems.find(m => m.id === activeTab)?.label}
                  </h1>
                  <p className="text-xs text-gray-400 font-medium">Track finances easily with AI insights.</p>
              </div>

              <div className="flex items-center gap-6">
                  {/* Search Bar */}
                  <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-[14px] w-80 shadow-sm border border-gray-100">
                      <Search size={18} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Search anything..." className="bg-transparent w-full text-xs font-bold placeholder:text-gray-300" />
                      <div className="flex gap-1">
                          <span className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-[10px] text-gray-400">⌘</span>
                          <span className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-[10px] text-gray-400">F</span>
                      </div>
                  </div>

                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-500">
                      <Settings size={18} />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-500 relative">
                      <Bell size={18} />
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <button onClick={() => setView('LANDING')} className="w-10 h-10 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </button>
              </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 pt-2">
              <div className="max-w-[1600px] mx-auto">
                  {renderContent()}
              </div>
          </div>
      </main>
    </div>
  );
};