import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Brain, Video, Activity, FileText } from 'lucide-react';
import Grainient from './reactbits/Grainient';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    return <Layout />;
};

export const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navLinks = [
        { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard'    },
        { to: '/resume',             icon: Brain,           label: 'Resume Intel' },
        { to: '/resume-builder',     icon: FileText,        label: 'Builder'      },
        { to: '/mock-interview/setup', icon: Video,         label: 'AI Proctor'   },
    ];

    const isActive = (to) =>
        to === '/mock-interview/setup'
            ? location.pathname.startsWith('/mock-interview')
            : location.pathname === to;

    return (
        <div className="flex min-h-screen bg-[#030303] font-sans text-gray-100 antialiased overflow-x-hidden relative">
            {/* Immersive Dashboard Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <Grainient
                    color1="#FF9FFC"
                    color2="#5227FF"
                    color3="#B497CF"
                    timeSpeed={0.25}
                    colorBalance={0}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={2}
                    warpAmplitude={50}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.1}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={1}
                    saturation={1}
                    centerX={0}
                    centerY={0}
                    zoom={0.9}
                />
            </div>

            {/* ── Desktop Sidebar (hidden on mobile) ── */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-transparent flex-col z-20">
                <div className="p-6 flex items-center space-x-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">H</div>
                    <span className="text-lg font-bold tracking-tight text-white">
                        hiresense<span className="text-indigo-600">.ai</span>
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <div className="px-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Platform</div>
                    <Link
                        to="/dashboard"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                            isActive('/dashboard')
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <LayoutDashboard size={18} /> <span>Dashboard</span>
                    </Link>

                    <div className="px-4 pt-6 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Preparation</div>
                    <Link
                        to="/resume"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                            isActive('/resume')
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Brain size={18} /> <span>Resume Intel</span>
                    </Link>
                    <Link
                        to="/resume-builder"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                            isActive('/resume-builder')
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <FileText size={18} /> <span>Resume Builder</span>
                    </Link>
                    <Link
                        to="/mock-interview/setup"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                            isActive('/mock-interview/setup')
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Video size={18} /> <span>AI Proctor</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="mb-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-3 shadow-inner">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-white truncate">{user?.name || 'Authorized User'}</span>
                            <span className="text-[9px] text-gray-500 font-medium uppercase tracking-tighter italic text-indigo-400/80">Professional Tier</span>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <LogOut size={16} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            {/* ml-0 on mobile, ml-64 on desktop; pb-24 on mobile for bottom nav clearance */}
            <main className="flex-1 ml-0 lg:ml-64 min-h-screen relative z-10 overflow-y-auto pb-24 lg:pb-0">
                <Outlet />
            </main>

            {/* ── Mobile Bottom Navigation (hidden on desktop) ── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 py-2 safe-bottom">
                {navLinks.map(({ to, icon: Icon, label }) => {
                    const active = isActive(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                                active
                                    ? 'text-indigo-400 bg-indigo-500/10'
                                    : 'text-white/30 hover:text-white/60'
                            }`}
                        >
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'text-indigo-400' : 'text-white/25'}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
