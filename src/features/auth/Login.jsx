import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, Coffee } from 'lucide-react';
import supabase from '../../utils/supabase';

const ADMIN_EMAIL = 'seba@oldplace.ro';
const SALT = 'oldplace-cafe-admin-2026';

async function hashPassword(password) {
    const data = new TextEncoder().encode(SALT + password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('checking'); // 'checking' | 'setup' | 'login'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function checkSetup() {
            const { data } = await supabase
                .from('settings').select('admin_password_hash').eq('id', 1).single();
            if (data?.admin_password_hash) {
                setMode('login');
            } else {
                setMode('setup');
            }
        }
        checkSetup();
    }, []);

    const handleSetup = async (e) => {
        e.preventDefault();
        setError('');
        if (email.toLowerCase() !== ADMIN_EMAIL) { setError('Invalid email or password.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        setIsLoading(true);
        const hash = await hashPassword(password);
        const { error: updateError } = await supabase
            .from('settings').update({ admin_password_hash: hash }).eq('id', 1);
        setIsLoading(false);
        if (updateError) { setError('Failed to save. Try again.'); return; }
        sessionStorage.setItem('admin_authenticated', 'true');
        navigate('/admin');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        if (email.toLowerCase() !== ADMIN_EMAIL) { setError('Invalid email or password.'); return; }
        setIsLoading(true);
        const hash = await hashPassword(password);
        const { data } = await supabase
            .from('settings').select('admin_password_hash').eq('id', 1).single();
        setIsLoading(false);
        if (!data?.admin_password_hash || data.admin_password_hash !== hash) {
            setError('Invalid email or password.'); return;
        }
        sessionStorage.setItem('admin_authenticated', 'true');
        navigate('/admin');
    };

    const inputStyle = { border: '1px solid rgba(139,94,60,0.3)', background: 'rgba(139,94,60,0.04)', color: '#3d2010' };

    if (mode === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF2D7' }}>
                <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: '#8B5E3C', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF2D7' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-md" style={{ backgroundColor: '#8B5E3C' }}>
                        <Coffee size={30} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-serif tracking-wide" style={{ color: '#8B5E3C' }}>Admin Panel</h1>
                    <p className="mt-1 text-sm" style={{ color: '#8B5E3C', opacity: 0.7 }}>
                        {mode === 'setup' ? 'First time? Set your admin password' : 'Sign in to manage your cafe'}
                    </p>
                </div>

                <div className="rounded-2xl bg-white shadow-md p-8" style={{ border: '1px solid rgba(139,94,60,0.2)' }}>
                    <form onSubmit={mode === 'setup' ? handleSetup : handleLogin} className="space-y-5" noValidate>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C', opacity: 0.6 }} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@cafe.com" autoComplete="email"
                                    className="w-full rounded-lg pl-9 pr-4 py-3 text-sm outline-none transition-all cursor-text"
                                    style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8B5E3C' }}>
                                {mode === 'setup' ? 'Choose a password' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C', opacity: 0.6 }} />
                                <input type={showPassword ? 'text' : 'password'} value={password}
                                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                    autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
                                    className="w-full rounded-lg pl-9 pr-10 py-3 text-sm outline-none transition-all cursor-text focus:placeholder-transparent"
                                    style={inputStyle} />
                                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: '#8B5E3C', opacity: 0.6 }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'setup' && (
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Confirm password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C', opacity: 0.6 }} />
                                    <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="w-full rounded-lg pl-9 pr-10 py-3 text-sm outline-none transition-all cursor-text focus:placeholder-transparent"
                                        style={inputStyle} />
                                    <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: '#8B5E3C', opacity: 0.6 }}>
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                        )}

                        <button type="submit" disabled={isLoading}
                            className="w-full py-3 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            style={{ backgroundColor: '#8B5E3C' }}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    {mode === 'setup' ? 'Saving…' : 'Signing in…'}
                                </span>
                            ) : (
                                mode === 'setup' ? 'Set Password & Continue' : 'Sign In'
                            )}
                        </button>
                    </form>
                </div>
                <p className="text-center text-xs mt-6" style={{ color: '#8B5E3C', opacity: 0.5 }}>Cafe Management System</p>
            </div>
        </div>
    );
};

export default Login;
