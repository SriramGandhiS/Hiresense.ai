import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Brain, Building2, Video, Activity } from 'lucide-react';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Layout />;
};

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-20">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">H</div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">HireSense</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <div className="px-4 pb-2 pt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</div>
                    <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm bg-indigo-50 text-indigo-600">
                        <LayoutDashboard size={18} strokeWidth={2.5} /> <span>Dashboard</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50 w-full">
                    <div className="mb-4 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                        {user?.picture ? (
                            <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-200">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="flex flex-col truncate pr-2">
                            <span className="text-sm font-bold text-slate-900 truncate">{user?.name}</span>
                        </div>
                    </div>

                    <button onClick={logout} className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors font-semibold text-sm">
                        <LogOut size={16} strokeWidth={2.5} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen relative z-10 p-8 lg:p-12">
                <Outlet />
            </main>
        </div>
    );
};
