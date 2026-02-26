import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import GradientText from '../reactbits/GradientText';
import StarBorder from '../reactbits/StarBorder';
import ClickSpark from '../reactbits/ClickSpark';
const companyNames = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Stripe', 'Notion', 'Figma'];

const HeroSection = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ email: '', password: '' });
    const [isCinematicActive, setIsCinematicActive] = useState(false);
    const [authData, setAuthData] = useState(null);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const handleGoogleSuccess = async (tokenResponse) => {
        setLoading(true); setError('');
        try {
            const res = await api.post('/auth/google', { credential: tokenResponse.access_token || tokenResponse.credential });
            setAuthData(res.data);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication Failed.');
        } finally { setLoading(false); }
    };

    const loginWithGoogle = useGoogleLogin({ onSuccess: handleGoogleSuccess, onError: () => setError('Google Login failed.') });

    const handleAdminLogin = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const res = await api.post('/auth/login', adminCreds);
            setAuthData(res.data);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin authentication failed.');
        } finally { setLoading(false); }
    };

    return (
        <ClickSpark sparkColor="#7c6fff" sparkSize={12} sparkRadius={20} sparkCount={8} duration={500} easing="ease-out" extraScale={1.2}>
            <section className="relative min-h-screen overflow-hidden bg-black flex flex-col">



                <style>{`@keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

                {/* ── HERO BODY ── */}
                <div className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-28 gap-0 transition-opacity duration-500 ${isCinematicActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                    {/* BIG: Hiresense with animated gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="mb-4 text-center w-full"
                    >
                        <GradientText
                            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                            animationSpeed={isCinematicActive ? 0 : 6}
                            showBorder={false}
                            yoyo={true}
                            className="text-7xl md:text-8xl font-black tracking-tight leading-none"
                        >
                            Hiresense
                        </GradientText>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-white/40 text-xs font-black uppercase tracking-[0.5em] mb-12 text-center"
                    >
                        career intelligence, redefined.
                    </motion.p>

                    {/* Auth Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1, ease: 'circOut' }}
                        className="w-full max-w-xs"
                    >
                        <AnimatePresence mode="wait">
                            {!isAdminMode ? (
                                <motion.div key="google" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-4">
                                    <StarBorder as="div" color="#7c6fff" speed={isCinematicActive ? "0s" : "4s"} className="w-full">
                                        <button onClick={() => loginWithGoogle()} disabled={loading} className="w-full text-[11px] tracking-[0.2em] font-black uppercase">
                                            {loading ? 'Authenticating...' : 'Continue with Google'}
                                        </button>
                                    </StarBorder>

                                    <div className="flex items-center gap-3 w-full">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">or</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    <button
                                        onClick={() => setIsAdminMode(true)}
                                        className="text-[10px] font-black text-white/35 hover:text-white/60 transition-colors uppercase tracking-[0.4em] w-full py-2 border border-white/10 rounded-2xl"
                                    >
                                        Admin Override
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form key="admin" onSubmit={handleAdminLogin} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-3 w-full">
                                    <input type="text" placeholder="ACCESS ID" value={adminCreds.email} onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-2xl px-6 py-4 text-white text-[11px] tracking-widest outline-none focus:border-white/40 transition-all text-center placeholder:text-white/20" required />
                                    <input type="password" placeholder="SIGNATURE" value={adminCreds.password} onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-2xl px-6 py-4 text-white text-[11px] tracking-widest outline-none focus:border-white/40 transition-all text-center placeholder:text-white/20" required />
                                    <button type="submit" disabled={loading} className="premium-button-white w-full py-4 mt-1 text-[11px]">
                                        {loading ? 'Authorizing...' : 'Authorize'}
                                    </button>
                                    <button type="button" onClick={() => setIsAdminMode(false)} className="text-[9px] font-black text-white/25 hover:text-white/50 transition-colors uppercase tracking-[0.4em]">
                                        Cancel
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                                {error}
                            </motion.p>
                        )}
                    </motion.div>
                </div>

                {/* ── FOOTER TICKER — pinned to bottom ── */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.5 }}
                    className={`absolute bottom-0 left-0 right-0 z-10 pb-8 flex flex-col items-center gap-3 transition-opacity duration-700 ${isCinematicActive ? 'opacity-0' : 'opacity-100'}`}
                >
                    <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Trusted by professionals at</p>
                    <div className="relative overflow-hidden w-full max-w-xl" style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}>
                        <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'scroll-left 28s linear infinite', width: 'max-content' }}>
                            {[...companyNames, ...companyNames].map((name, i) => (
                                <span key={i} className="text-white/20 text-[10px] font-black uppercase tracking-[0.25em] flex-shrink-0">{name}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>
        </ClickSpark >
    );
};

export default HeroSection;
