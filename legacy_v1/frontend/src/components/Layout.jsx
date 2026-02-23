import React, { useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, FileText, Video, LayoutDashboard, Settings, Menu } from 'lucide-react';
import { gsap } from 'gsap';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const linksRef = useRef([]);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'user';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    useEffect(() => {
        gsap.fromTo(
            sidebarRef.current,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
        gsap.fromTo(
            linksRef.current,
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
        );
    }, []);

    const addToRefs = (el) => {
        if (el && !linksRef.current.includes(el)) linksRef.current.push(el);
    };

    return (
        <div className="flex min-h-screen bg-[#fafbfe] text-[#1e293b] font-sans relative selection:bg-[#6366f1] selection:text-white">

            {/* Light Clean Sidebar */}
            <aside ref={sidebarRef} className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#e2e8f0] flex flex-col z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] h-screen">

                <div className="p-6 md:p-8 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#6366f1] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#6366f1]/20">H</div>
                    <span className="text-xl font-bold tracking-tight text-[#0f172a]">HireSense<span className="text-[#6366f1]">.ai</span></span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto w-full">
                    {token && (
                        <>
                            <div className="px-4 pb-3 pt-2 text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Main Menu</div>
                            <Link innerRef={addToRefs} to="/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] ${location.pathname === '/dashboard' ? 'bg-[#eef2ff] text-[#6366f1]' : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f8fafc]'}`}>
                                <LayoutDashboard size={20} strokeWidth={2.5} /> <span>Overview</span>
                            </Link>
                            <Link innerRef={addToRefs} to="/resume-builder" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] mt-1 ${location.pathname === '/resume-builder' ? 'bg-[#eef2ff] text-[#6366f1]' : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f8fafc]'}`}>
                                <FileText size={20} strokeWidth={2.5} /> <span>Resume Builder</span>
                            </Link>
                            <Link innerRef={addToRefs} to="/interview-engine" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] mt-1 ${location.pathname === '/interview-engine' ? 'bg-[#eef2ff] text-[#6366f1]' : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f8fafc]'}`}>
                                <Video size={20} strokeWidth={2.5} /> <span>Interviews</span>
                            </Link>

                            {role === 'admin' && (
                                <>
                                    <div className="px-4 pt-8 pb-3 text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Administration</div>
                                    <Link innerRef={addToRefs} to="/admin" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] ${location.pathname === '/admin' ? 'bg-[#eef2ff] text-[#6366f1]' : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f8fafc]'}`}>
                                        <Settings size={20} strokeWidth={2.5} /> <span>Admin Center</span>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                    {!token && (
                        <Link innerRef={addToRefs} to="/login" className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] text-[#64748b] hover:bg-[#f8fafc]">
                            Sign In
                        </Link>
                    )}
                </nav>

                {token && (
                    <div className="p-4 border-t border-[#f1f5f9] bg-[#fafbfe] w-full" ref={addToRefs}>
                        <div className="mb-4 px-4 py-3 bg-white rounded-xl border border-[#e2e8f0] shadow-sm flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-sm font-bold text-[#6366f1]">
                                {role === 'admin' ? 'AD' : 'US'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#1e293b] capitalize">{role}</span>
                                <span className="text-[11px] font-semibold tracking-wide text-[#cbd5e1] uppercase">Premium Plan</span>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl hover:bg-[#fee2e2] hover:text-[#ef4444] text-[#94a3b8] transition-colors font-semibold text-sm">
                            <LogOut size={16} strokeWidth={2.5} /> <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen relative z-10 bg-[#fafbfe]">
                <div className="p-8 lg:p-12 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
