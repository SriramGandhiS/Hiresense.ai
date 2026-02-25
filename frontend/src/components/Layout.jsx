import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Brain, Building2, Video, Activity } from 'lucide-react';
import LightPillar from './LightPillar';
import './LightPillar.css';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    return <Layout />;
};

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#030303] font-sans text-gray-100 antialiased overflow-hidden relative">
            {/* Immersive Dashboard Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <LightPillar
                    topColor="#5227FF"
                    bottomColor="#FF9FFC"
                    intensity={1}
                    rotationSpeed={0.3}
                    glowAmount={0.002}
                    pillarWidth={3}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="high"
                />
            </div>
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
                <div className="p-6 flex items-center space-x-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">H</div>
                    <span className="text-lg font-bold tracking-tight text-white">hiresense<span className="text-indigo-600">.ai</span></span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <div className="px-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Platform</div>
                    <Link to="/dashboard" className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${location.pathname === '/dashboard' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard size={18} /> <span>Dashboard</span>
                    </Link>

                    <div className="px-4 pt-6 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Preparation</div>
                    <Link to="/resume" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5">
                        <Brain size={18} /> <span>Resume Intel</span>
                    </Link>
                    <Link to="/company" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5">
                        <Building2 size={18} /> <span>Company Scan</span>
                    </Link>
                    <Link to="/mock-interview/setup" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5">
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

                    <button onClick={logout} className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all font-bold text-xs uppercase tracking-widest">
                        <LogOut size={16} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen relative z-10 p-10 lg:p-14 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
