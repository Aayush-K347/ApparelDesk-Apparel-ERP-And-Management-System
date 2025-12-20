
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { ArrowRight, Mail, Lock, User, Github, Twitter, Shield } from 'lucide-react';

interface UserAuthProps {
    setView: (view: ViewState) => void;
    onLogin: (email: string, password: string, fullName?: string, mode?: 'login' | 'register', isVendor?: boolean) => Promise<void> | void;
}

export const UserAuth: React.FC<UserAuthProps> = ({ setView, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isVendor, setIsVendor] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onLogin(email, password, fullName || email, isLogin ? 'login' : 'register', isVendor);
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F2F4F3]">
            {/* Left Side - Editorial Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img 
                    src={isLogin 
                        ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                        : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                    }
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] hover:scale-105 opacity-90 grayscale-[20%]"
                    alt="Fashion Editorial"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
                    <div className="font-anton tracking-widest text-2xl">LUVARTE</div>
                    <div>
                        <h2 className="text-6xl font-anton uppercase leading-none mb-6">
                            {isLogin ? "Welcome Back." : "Join the Elite."}
                        </h2>
                        <p className="text-sm tracking-[0.2em] font-bold uppercase opacity-80 max-w-md leading-relaxed">
                            {isLogin 
                                ? "Access your curated wardrobe, track orders, and discover exclusive collections." 
                                : "Create an account to unlock personalized recommendations and priority access to new drops."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <button 
                    onClick={() => setView('LANDING')} 
                    className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors"
                >
                    Return to Store <ArrowRight size={14} />
                </button>

                <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
                    <div className="mb-12">
                        <h3 className="font-anton text-4xl uppercase mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">
                            {isLogin ? 'Enter your credentials below' : 'Fill in your details to register'}
                        </p>
                    </div>

                    {error && <div className="mb-4 text-red-500 text-xs font-bold uppercase tracking-widest">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {!isLogin && (
                             <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Full Name</label>
                                <div className="relative">
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300" placeholder="John Doe" />
                                    <User className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300" 
                                    placeholder="name@example.com" 
                                />
                                <Mail className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Password</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300" 
                                    placeholder="••••••••" 
                                />
                                <Lock className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-[#111111] transition-colors">Confirm Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border-b border-gray-200 py-3 pl-0 bg-transparent text-sm focus:border-[#111111] transition-colors placeholder:text-gray-300" 
                                        placeholder="••••••••" 
                                    />
                                    <Lock className="absolute right-0 top-3 text-gray-300 group-focus-within:text-[#111111] transition-colors" size={16} />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 cursor-pointer">
                                <input type="checkbox" checked={isVendor} onChange={(e) => setIsVendor(e.target.checked)} className="w-4 h-4" />
                                <Shield size={14} /> Sign up as Vendor
                            </label>
                        )}

                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-[10px] text-gray-400 hover:text-[#111111] uppercase tracking-widest font-bold">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#111111] text-white py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#c9b52e] transition-colors shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Or continue with</p>
                        <div className="flex justify-center gap-4 mb-8">
                            <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
                                <Github size={16} />
                            </button>
                            <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
                                <Twitter size={16} />
                            </button>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-[#111111] underline hover:text-[#c9b52e]"
                            >
                                {isLogin ? 'Register' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
