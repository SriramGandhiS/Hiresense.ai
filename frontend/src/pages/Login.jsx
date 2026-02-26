import React, { useState, useEffect } from 'react';
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
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] relative overflow-hidden px-4">
            <div className={`w-full max-w-md p-8 sm:p-12 bg-white rounded-[24px] shadow-soft border border-gray-100 text-center relative z-10 transition-all duration-500`}>
                <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">H</div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black tracking-tight text-gray-900">
                            hiresense<span className="text-indigo-600">.ai</span>
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mt-1 font-bold">Authorized Access Intel</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 text-xs font-bold border border-red-100 bg-red-50 text-red-600 rounded-xl">
                        {error.toUpperCase()}
                    </div>
                )}

                {!isAdminMode ? (
                    <div className="space-y-6">
                        <button
                            onClick={() => loginWithGoogle()}
                            disabled={loading}
                            className="w-full relative group transition-transform active:scale-95"
                        >
                            <div className="flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
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
                                        Log In with Google
                                    </>
                                )}
                            </div>
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-4 text-gray-400 font-bold">Secure Auth Gateway</span></div>
                        </div>

                        <button
                            onClick={() => setIsAdminMode(true)}
                            className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
                        >
                            Execute Terminal Override
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Access Token ID</label>
                            <input
                                type="text"
                                value={adminCreds.email}
                                onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                                placeholder="root@hiresense.ai"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Security Signature</label>
                            <input
                                type="password"
                                value={adminCreds.password}
                                onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                placeholder="ΓÇóΓÇóΓÇóΓÇó"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Establish Override'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAdminMode(false)}
                            className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                        >
                            Cancel Internal Access
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
