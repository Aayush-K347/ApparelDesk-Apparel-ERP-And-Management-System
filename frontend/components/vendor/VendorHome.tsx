import React from 'react';
import { 
    Plus, ArrowUpRight, ArrowDownLeft, Wallet, 
    MoreHorizontal, Mic, Paperclip, Send, RefreshCw,
    TrendingUp, DollarSign, PieChart, Activity
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Mock Data for Charts
const CASHFLOW_DATA = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 5800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
  { name: 'Aug', income: 4000, expense: 2400 },
  { name: 'Sep', income: 3000, expense: 1398 },
  { name: 'Oct', income: 2000, expense: 5800 },
  { name: 'Nov', income: 2780, expense: 3908 },
  { name: 'Dec', income: 3490, expense: 4300 },
];

const STAT_DATA = [
  { name: 'Rent', value: 3500, color: '#111111' },
  { name: 'Invest', value: 2100, color: '#c3f235' },
  { name: 'Food', value: 1200, color: '#E5E7EB' },
];

export const VendorHome: React.FC = () => {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            {/* TOP ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                
                {/* 1. Total Balance Card (Green) */}
                <div className="xl:col-span-4 bg-[#c3f235] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl shadow-[#c3f235]/20">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                    <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
                                <h2 className="text-4xl font-anton tracking-wide">$20,670 <span className="text-base font-sans opacity-60 font-normal">USD</span></h2>
                            </div>
                            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm">
                                <Plus size={20} />
                            </button>
                        </div>
                        
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white text-[#c3f235] py-3 rounded-[16px] font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <ArrowDownLeft size={16} /> Deposit
                            </button>
                            <button className="flex-1 bg-[#111111] text-white py-3 rounded-[16px] font-bold text-sm hover:bg-black/80 transition-colors shadow-sm flex items-center justify-center gap-2">
                                Send <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. AI Enhancements (Stats) */}
                <div className="xl:col-span-5 bg-white rounded-[32px] p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">AI Enhancements</h3>
                        <button className="text-[10px] font-bold uppercase tracking-wider border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50">+ Add Enhancements</button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Income', val: '$14,480.24', change: '+1.78%', icon: DollarSign },
                            { label: 'Expense', val: '$14,480.24', change: '+1.02%', icon: TrendingUp },
                            { label: 'Savings', val: '$14,480.24', change: '+2.90%', icon: Wallet }
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#F8F9FD] p-4 rounded-[20px]">
                                <div className="flex items-center gap-2 mb-3 text-gray-500">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <stat.icon size={12} className="text-[#c3f235]" />
                                    </div>
                                    <span className="text-xs font-bold">{stat.label}</span>
                                </div>
                                <h4 className="font-bold text-sm mb-1">{stat.val}</h4>
                                <span className="text-[10px] font-bold text-[#c3f235] bg-[#c3f235]/10 px-1.5 py-0.5 rounded">{stat.change}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Finance Score */}
                <div className="xl:col-span-3 bg-white rounded-[32px] p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">Finance Score</h3>
                        <button className="text-gray-400 hover:text-black"><MoreHorizontal size={20} /></button>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Finance Quality</p>
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-3xl font-anton tracking-wide">Excellent</h2>
                            <span className="text-xl font-bold">92%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-[#111111] rounded-full relative">
                                <div className="absolute right-0 top-0 bottom-0 w-20 bg-[#c3f235]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MIDDLE ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                
                {/* 4. Cashflow Chart */}
                <div className="xl:col-span-7 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Cashflow</h3>
                            <div className="flex items-baseline gap-4">
                                <h2 className="text-3xl font-anton tracking-wide">$562,000</h2>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Total Balance</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2 text-xs font-bold">
                                 <span className="w-3 h-3 bg-[#111111] rounded-full"></span> Income
                                 <span className="w-3 h-3 bg-[#c3f235] rounded-full ml-2"></span> Expense
                             </div>
                             <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold px-3 py-2 cursor-pointer outline-none">
                                 <option>This Year</option>
                                 <option>Last Year</option>
                             </select>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CASHFLOW_DATA} barGap={8} barSize={12}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(value) => `${value/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: '#F3F4F6'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="income" fill="#111111" radius={[4, 4, 4, 4]} />
                                <Bar dataKey="expense" fill="#c3f235" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. AI Assistant */}
                <div className="xl:col-span-5 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col relative overflow-hidden">
                     <div className="absolute top-4 right-4">
                         <button className="text-gray-400 hover:text-black"><MoreHorizontal size={20} /></button>
                     </div>
                     
                     <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
                         <div className="w-20 h-20 bg-gradient-to-br from-[#c3f235] to-[#111111] rounded-full mb-6 shadow-lg shadow-green-900/20 animate-pulse"></div>
                         <h3 className="font-bold text-lg mb-4">What Can I help with?</h3>
                         
                         <div className="flex flex-wrap justify-center gap-2 mb-8">
                             {['Show me my cash flow', 'Help me set a savings goal', 'Forecast my balance', 'Plan my monthly budget'].map((tag, i) => (
                                 <span key={i} className="text-[10px] border border-gray-200 px-3 py-1.5 rounded-full text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                     {tag}
                                 </span>
                             ))}
                         </div>
                     </div>

                     <div className="bg-[#F8F9FD] rounded-[20px] p-2 flex items-center gap-2 mt-auto">
                         <div className="bg-white rounded-[16px] px-4 py-2 flex-1 text-xs text-gray-400">
                             Ask anything...
                         </div>
                         <button className="p-2 text-gray-400 hover:text-black"><Mic size={18} /></button>
                         <button className="p-2 text-gray-400 hover:text-black"><Paperclip size={18} /></button>
                         <button className="bg-[#c3f235] text-white px-4 py-2 rounded-[14px] flex items-center gap-2 text-xs font-bold hover:bg-[#3a754b] transition-colors">
                             <Send size={14} /> Send
                         </button>
                     </div>
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* 6. Recent Transactions */}
                <div className="xl:col-span-6 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Recent Transactions</h3>
                        <div className="flex gap-4">
                            <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold px-3 py-2 cursor-pointer outline-none">
                                <option>This Month</option>
                            </select>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw size={14} /></button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: 'Dividend Payout', type: 'Investments', date: '2024-09-25 10:00', amount: '+$200.00', status: 'Completed', color: 'text-[#c3f235]' },
                            { name: 'Grocery Shopping', type: 'Food & Dining', date: '2024-09-24 14:30', amount: '-$154.20', status: 'Completed', color: 'text-red-500' },
                            { name: 'Freelance Payment', type: 'Income', date: '2024-09-23 15:00', amount: '+$850.00', status: 'Completed', color: 'text-[#c3f235]' },
                            { name: 'Electricity Bill', type: 'Utilities', date: '2024-09-22 09:15', amount: '-$120.75', status: 'Completed', color: 'text-red-500' }
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg font-bold group-hover:bg-[#111111] group-hover:text-white transition-colors">
                                        {tx.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{tx.name}</h4>
                                        <p className="text-[10px] text-gray-400">{tx.type}</p>
                                    </div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] font-bold text-gray-400">{tx.date}</p>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className={`font-bold text-sm ${tx.color}`}>{tx.amount}</p>
                                    <p className="text-[10px] text-green-600 bg-green-50 px-2 rounded-full inline-block mt-1">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Statistic Donut */}
                <div className="xl:col-span-3 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Statistic</h3>
                        <span className="text-xs font-bold text-gray-400">This Month</span>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-8">
                         <span>Income ($4,800)</span>
                         <span className="text-[#c3f235]">Expense ($3,500)</span>
                    </div>

                    <div className="h-[200px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie 
                                    data={STAT_DATA} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value" 
                                    stroke="none"
                                >
                                    {STAT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </RePieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total Expense</span>
                            <span className="text-2xl font-anton mt-1">$3,500</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {STAT_DATA.map((item, i) => (
                             <div key={i} className="flex justify-between items-center text-xs">
                                 <div className="flex items-center gap-2">
                                     <span className="w-8 text-center font-bold bg-gray-50 rounded py-0.5">{((item.value/6800)*100).toFixed(0)}%</span>
                                     <span className="font-bold text-gray-600">{item.name}</span>
                                 </div>
                                 <span className="font-bold">${item.value}</span>
                             </div>
                        ))}
                    </div>
                </div>

                {/* 8. Exchange */}
                <div className="xl:col-span-3 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Exchange</h3>
                        <button className="text-[10px] font-bold border border-gray-200 px-3 py-1 rounded-full">Currencies</button>
                    </div>

                    <div className="text-center text-gray-400 text-xs font-bold mb-4">
                        1 USD = 0.77 GBP
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="bg-gray-50 px-4 py-3 rounded-[16px] flex items-center gap-2 cursor-pointer border border-gray-100 flex-1 justify-center">
                            <span className="text-lg">🇺🇸</span> <span className="font-bold text-sm">USD</span> <ChevronDown size={14} />
                        </div>
                        <RefreshCw size={20} className="text-[#c3f235]" />
                        <div className="bg-gray-50 px-4 py-3 rounded-[16px] flex items-center gap-2 cursor-pointer border border-gray-100 flex-1 justify-center">
                             <span className="text-lg">🇬🇧</span> <span className="font-bold text-sm">GBP</span> <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-anton tracking-wide">$100.00</h2>
                        <p className="text-xs text-gray-400 mt-1">Available: $1600.86</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-gray-500 mb-6">
                        <div>
                            <p className="text-gray-400 mb-1">Tax (2%)</p>
                            <p className="text-black text-sm">$2.00</p>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-1">Fee (1%)</p>
                            <p className="text-black text-sm">$1.00</p>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-1">Total</p>
                            <p className="text-black text-sm">€90.7</p>
                        </div>
                    </div>

                    <button className="w-full bg-[#82E664] hover:bg-[#72d654] text-[#111111] font-bold py-3.5 rounded-[16px] transition-colors shadow-sm shadow-green-200">
                        Exchange
                    </button>
                </div>

            </div>
        </div>
    );
};

// Sub-component for icons to avoid TS errors if not imported
const ChevronDown = ({size, className}: {size:number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
