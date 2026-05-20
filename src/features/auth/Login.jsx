import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, Coffee } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        // TODO: wire to Supabase auth
        setTimeout(() => {
            setIsLoading(false);
            navigate('/admin');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF2D7' }}>
            <div className="w-full max-w-md">

                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-md" style={{ backgroundColor: '#8B5E3C' }}>
                        <Coffee size={30} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-serif tracking-wide" style={{ color: '#8B5E3C' }}>Admin Panel</h1>
                    <p className="mt-1 text-sm" style={{ color: '#8B5E3C', opacity: 0.7 }}>Sign in to manage your cafe</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white shadow-md p-8" style={{ border: '1px solid rgba(139,94,60,0.2)' }}>
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8B5E3C' }}>
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C', opacity: 0.6 }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@yourcafe.com"
                                    className="w-full rounded-lg pl-9 pr-4 py-3 text-sm outline-none transition-all"
                                    style={{ border: '1px solid rgba(139,94,60,0.3)', background: 'rgba(139,94,60,0.04)', color: '#3d2010' }}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8B5E3C' }}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C', opacity: 0.6 }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg pl-9 pr-10 py-3 text-sm outline-none transition-all"
                                    style={{ border: '1px solid rgba(139,94,60,0.3)', background: 'rgba(139,94,60,0.04)', color: '#3d2010' }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                                    style={{ color: '#8B5E3C', opacity: 0.6 }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#8B5E3C' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: '#8B5E3C', opacity: 0.5 }}>
                    Cafe Management System
                </p>
            </div>
        </div>
    );
};

export default Login;
