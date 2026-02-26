import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Hyperspeed from '../components/reactbits/Hyperspeed';
import TargetCursor from '../components/reactbits/TargetCursor';
import GradientText from '../components/reactbits/GradientText';
import RotatingText from '../components/reactbits/RotatingText';

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
        <div className="relative flex items-center justify-center min-h-screen bg-transparent overflow-hidden px-4">
            <TargetCursor
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />
            {/* Background Layer: Hyperspeed */}
            <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
                <Hyperspeed
                    effectOptions={{ "distortion": "turbulentDistortion", "length": 400, "roadWidth": 14, "islandWidth": 3, "lanesPerRoad": 4, "fov": 100, "fovSpeedUp": 160, "speedUp": 3.5, "carLightsFade": 0.4, "totalSideLightSticks": 40, "lightPairsPerRoadWay": 60, "shoulderLinesWidthPercentage": 0.05, "brokenLinesWidthPercentage": 0.1, "brokenLinesLengthPercentage": 0.5, "lightStickWidth": [0.2, 0.8], "lightStickHeight": [2.0, 2.5], "movingAwaySpeed": [80, 110], "movingCloserSpeed": [-150, -200], "carLightsLength": [25, 100], "carLightsRadius": [0.08, 0.2], "carWidthPercentage": [0.3, 0.5], "carShiftX": [-0.8, 0.8], "carFloorSeparation": [0, 5], "colors": { "roadColor": 526344, "islandColor": 657930, "background": 0, "shoulderLines": 1250072, "brokenLines": 1250072, "leftCars": [14177983, 6770850, 12732332], "rightCars": [242627, 941733, 3294549], "sticks": 242627 } }}
                />
            </div>

            <ElectricBorder
                color="#00ffff"
                speed={1}
                chaos={0.12}
                borderRadius={24}
                className="w-full max-w-md relative z-10 transition-all duration-500"
            >
                <div className="p-8 sm:p-12 text-center bg-transparent">
                    <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">H</div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tight text-white mb-2">
                                <RotatingText
                                    texts={['hiresense.ai', 'Authorized', 'Access', 'Intel']}
                                    mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                                    staggerFrom={"last"}
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-120%" }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl">
                            {error.toUpperCase()}
                        </div>
                    )}

                    {!isAdminMode ? (
                        <div className="space-y-6">
                            <button
                                onClick={() => loginWithGoogle()}
                                disabled={loading}
                                className="w-full relative group transition-transform active:scale-95 cursor-target"
                            >
                                <div className="flex items-center justify-center px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors shadow-sm cursor-target">
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
            </ElectricBorder>
        </div>
    );
};

export default Login;
