import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ email: '', password: '' });

    const handleGoogleSuccess = async (tokenResponse) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/google', {
                credential: tokenResponse.credential || tokenResponse.access_token
            });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Google Authentication Failed.';
            const detailedError = err.response?.data?.error || '';
            setError(`${errorMessage} ${detailedError ? `(${detailedError})` : 'Please try again.'}`);
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', adminCreds);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Google Login was canceled or failed.'),
    });

    return (
        <div className={`flex items-center justify-center min-h-screen transition-all duration-700 ${isAdminMode ? 'hacker-bg' : 'bg-[#f8fafc]'}`}>

            {/* Hacker Mode Tech Lines */}
            {isAdminMode && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-[#00ff41] animate-pulse"></div>
                    <div className="absolute top-0 right-1/3 w-px h-full bg-[#00ff41] animate-pulse delay-700"></div>
                </div>
            )}

            <div className={`w-full max-w-md p-10 transition-all duration-500 rounded-2xl ${isAdminMode ? 'premium-glass' : 'bg-white border border-[#e2e8f0] shadow-sm'} text-center relative z-10`}>

                <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl transition-all duration-500 ${isAdminMode ? 'bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.6)]' : 'bg-indigo-600 text-white shadow-md'}`}>H</div>
                    <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${isAdminMode ? 'hacker-text' : 'text-slate-900'}`}>
                        HireSense<span className={isAdminMode ? 'text-white' : 'text-indigo-600'}>.ai</span>
                    </span>
                </div>

                <h1 className={`text-sm font-bold uppercase tracking-[0.2em] mb-10 mt-6 transition-colors duration-500 ${isAdminMode ? 'text-[#00ff41]/80' : 'text-slate-400'}`}>
                    {isAdminMode ? 'System Override : Terminal' : 'Intelligence Portal'}
                </h1>

                {error && (
                    <div className={`mb-8 p-4 text-xs font-mono border rounded-xl animate-bounce ${isAdminMode ? 'text-[#ff4141] bg-[#ff4141]/10 border-[#ff4141]/30' : 'text-red-700 bg-red-50 border-red-200'}`}>
                        {isAdminMode ? `[ERROR]: ${error.toUpperCase()}` : error}
                    </div>
                )}

                {!isAdminMode ? (
                    <div className="space-y-6">
                        <button
                            onClick={() => loginWithGoogle()}
                            disabled={loading}
                            className="w-full flex items-center justify-center px-6 py-4 border border-[#e2e8f0] rounded-xl shadow-sm bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Intelligence
                                </>
                            )}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 tracking-widest font-bold">Secure Access</span></div>
                        </div>

                        <button
                            onClick={() => setIsAdminMode(true)}
                            className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.3em]"
                        >
                            Open Developer Terminal
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#00ff41] uppercase tracking-[0.2em] ml-1">Terminal ID</label>
                            <input
                                type="text"
                                value={adminCreds.email}
                                onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                                placeholder="root@sriram.dev"
                                className="w-full bg-black/40 border border-[#00ff41]/20 rounded-xl px-4 py-4 text-[#00ff41] font-mono text-sm focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41] outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#00ff41] uppercase tracking-[0.2em] ml-1">Security Key</label>
                            <input
                                type="password"
                                value={adminCreds.password}
                                onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                placeholder="••••"
                                className="w-full bg-black/40 border border-[#00ff41]/20 rounded-xl px-4 py-4 text-[#00ff41] font-mono text-sm focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41] outline-none transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cyber-button py-4 rounded-xl flex items-center justify-center text-sm disabled:opacity-50"
                        >
                            {loading ? 'Decrypting...' : 'Override System'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAdminMode(false)}
                            className="w-full text-center text-[10px] font-bold text-[#00ff41]/60 hover:text-[#00ff41] uppercase tracking-[0.2em] transition-colors"
                        >
                            Return to Cloud
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
