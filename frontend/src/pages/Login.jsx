import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Hyperspeed from '../components/reactbits/Hyperspeed';
import ElectricBorder from '../components/reactbits/ElectricBorder';
import TargetCursor from '../components/reactbits/TargetCursor';
import GradientText from '../components/reactbits/GradientText';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ email: '', password: '' });
    const [isCinematicActive, setIsCinematicActive] = useState(false);
    const [authData, setAuthData] = useState(null);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const handleGoogleSuccess = async (tokenResponse) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/google', {
                credential: tokenResponse.access_token || tokenResponse.credential
            });
            setAuthData(res.data);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication Failed.');
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };



    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Google Login was canceled or failed.'),
    });

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', adminCreds);
            setAuthData(res.data);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] bg-transparent px-4 pb-20 pt-10">
            <TargetCursor
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />
            <div className="w-full max-w-md relative z-10 transition-all duration-500 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl">
                <div className="p-8 sm:p-12 text-center bg-transparent">
                    <div className="flex flex-col items-center justify-center space-y-4 mb-10 relative">
                        <div className="w-20 h-20 flex items-center justify-center bg-transparent relative z-10">
                            <GradientText
                                colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                                animationSpeed={6}
                                showBorder={false}
                                className="font-serif italic font-black text-5xl tracking-widest ml-2 drop-shadow-[0_0_20px_rgba(255,159,252,0.6)]"
                            >
                                HS
                            </GradientText>
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-3xl font-black tracking-tight text-white mb-2">
                                hiresense.ai
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl">
                            {error.toUpperCase()}
                        </div>
                    )}

                    {!isAdminMode ? (
                        <div className="space-y-6 relative">
                            <button
                                onClick={() => loginWithGoogle()}
                                disabled={loading}
                                className="w-full relative group transition-transform active:scale-95 cursor-target"
                            >
                                <div className="flex items-center justify-center px-6 py-4 bg-transparent border border-white/10 hover:border-white/30 rounded-xl text-sm font-bold text-white transition-colors cursor-target">
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5 mr-3 drop-shadow-md" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            <GradientText colors={["#5227FF", "#FF9FFC", "#B19EEF"]} animationSpeed={8} showBorder={false}>
                                                Log In with Google
                                            </GradientText>
                                        </>
                                    )}
                                </div>
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-transparent px-4 text-white/40 font-bold backdrop-blur-xl">Secure Auth Gateway</span></div>
                            </div>

                            <button
                                onClick={() => setIsAdminMode(true)}
                                className="text-[10px] font-bold text-white/40 hover:text-indigo-400 transition-all uppercase tracking-widest cursor-target"
                            >
                                Execute Terminal Override
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-1">Access Token ID</label>
                                <input
                                    type="text"
                                    value={adminCreds.email}
                                    onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                                    placeholder="root@hiresense.ai"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-white/20 cursor-target"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-1">Security Signature</label>
                                <input
                                    type="password"
                                    value={adminCreds.password}
                                    onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                    placeholder="••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-white/20 cursor-target"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-target"
                            >
                                {loading ? 'Authenticating...' : (
                                    <GradientText colors={["#5227FF", "#FF9FFC", "#B19EEF"]} animationSpeed={8} showBorder={false}>
                                        Establish Override
                                    </GradientText>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAdminMode(false)}
                                className="w-full text-center text-[10px] font-bold text-white/40 hover:text-white/80 uppercase tracking-widest transition-colors cursor-target"
                            >
                                Cancel Internal Access
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
