import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cardRef = useRef(null);
    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    // Soft Bounce Entrance
    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }
        );

        gsap.fromTo(elementsRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
        );
    }, []);

    const addToRefs = (el) => {
        if (el && !elementsRef.current.includes(el)) elementsRef.current.push(el);
    };

    const handleLogin = async (e, demoMode = false) => {
        if (e) e.preventDefault();

        const loginEmail = demoMode ? 'admin@hiresense.ai' : email;
        const loginPassword = demoMode ? 'adminpassword123' : password;

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role || 'user');

            // Soft slide up exit
            gsap.to(cardRef.current, {
                y: -30, opacity: 0, scale: 0.98, duration: 0.5, ease: 'power2.inOut',
                onComplete: () => navigate('/dashboard')
            });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Authentication failed.');
            gsap.fromTo(cardRef.current, { x: -5 }, { x: 5, yoyo: true, repeat: 3, duration: 0.08, ease: 'linear', clearProps: 'x' });
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfe] relative overflow-hidden selection:bg-[#6366f1] selection:text-white">

            {/* Soft modern glowing orb background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366f1] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#818cf8] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="mb-10 z-10 text-center" ref={addToRefs}>
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6366f1]/30">H</div>
                    <span className="text-2xl font-bold tracking-tight text-[#1e293b]">HireSense<span className="text-[#6366f1]">.ai</span></span>
                </div>
                <p className="text-[#64748b] font-medium mt-2">Log in to enter your workspace</p>
            </div>

            <div ref={cardRef} className="bg-white p-10 sm:p-12 rounded-3xl w-full max-w-lg z-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#f1f5f9] relative">

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center font-medium shadow-sm"><span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span> {error}</div>}

                <form onSubmit={(e) => handleLogin(e, false)} className="space-y-6">
                    <div ref={addToRefs}>
                        <label className="block text-sm font-semibold text-[#475569] mb-2">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium" placeholder="name@company.com" required />
                    </div>
                    <div ref={addToRefs}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-[#475569]">Password</label>
                            <a href="#" className="text-xs font-semibold text-[#6366f1] hover:text-[#4f46e5] transition-colors">Forgot password?</a>
                        </div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium" placeholder="••••••••" required />
                    </div>
                    <div ref={addToRefs} className="pt-4">
                        <button type="submit" disabled={loading} className="w-full py-4 primary-button text-[15px]">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sign In to Workspace'}
                        </button>
                    </div>
                </form>

                <div ref={addToRefs} className="mt-8 pt-6 border-t border-[#f1f5f9]">
                    <button onClick={() => handleLogin(null, true)} disabled={loading} className="w-full py-3.5 secondary-button text-sm group hover:border-[#cbd5e1]">
                        <span className="text-[#64748b] group-hover:text-[#475569] font-semibold transition-colors">Instant Admin Demo Login</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 text-[#94a3b8] group-hover:text-[#64748b] group-hover:translate-x-1 transition-all"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>

            <p ref={addToRefs} className="mt-8 text-center text-[#64748b] font-medium z-10">
                Don't have an account? <Link to="/register" className="text-[#6366f1] font-semibold hover:text-[#4f46e5]">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
