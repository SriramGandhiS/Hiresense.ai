import React, { useState, useEffect } from 'react';
import { Users, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../services/api';

const Admin = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalInterviews: 0, averageScore: 0 });
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerRef = React.useRef(null);
    const elementsRef = React.useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes, logsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users'),
                    api.get('/admin/logs')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setLogs(logsRes.data);
            } catch (err) {
                console.error("Admin data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(containerRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );

            gsap.fromTo(elementsRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }, [loading]);

    const addToRefs = (el) => {
        if (el && !elementsRef.current.includes(el)) elementsRef.current.push(el);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#64748b] font-medium text-sm">Gathering administrative parameters...</div>;

    return (
        <div ref={containerRef} className="space-y-8 pb-20 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#6366f1]/10 rounded-2xl flex items-center justify-center text-[#6366f1]"><ShieldAlert size={24} strokeWidth={2} /></div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Admin Center</h1>
                        <p className="text-[#64748b] font-medium text-sm mt-0.5">High-level system oversight and user management.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Total Entities", icon: <Users size={22} className="text-[#6366f1]" />, value: stats.totalUsers },
                    { title: "Active Sessions", icon: <Activity size={22} className="text-[#6366f1]" />, value: stats.totalInterviews },
                    { title: "Global Readiness Average", icon: <ShieldAlert size={22} className="text-[#6366f1]" />, value: `${Math.round(stats.averageScore)}%` }
                ].map((stat, i) => (
                    <div key={i} ref={addToRefs} className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-[#eef2ff]">{stat.icon}</div>
                            <h3 className="text-[#64748b] text-[13px] font-bold uppercase tracking-wider">{stat.title}</h3>
                        </div>
                        <p className="text-4xl font-black text-[#0f172a]">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div ref={addToRefs} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="px-8 py-6 border-b border-[#f1f5f9] bg-white">
                        <h2 className="text-lg font-bold text-[#0f172a]">Registered Entity Roster</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {users.length === 0 ? (
                            <div className="p-10 text-center text-[#64748b] font-medium text-[15px]">No registered entities found.</div>
                        ) : (
                            <table className="w-full text-left font-medium text-[14px] text-[#334155]">
                                <thead className="text-[11px] text-[#94a3b8] uppercase font-bold tracking-widest bg-[#f8fafc] border-b border-[#f1f5f9] sticky top-0">
                                    <tr>
                                        <th className="px-8 py-4">Participant Identifier</th>
                                        <th className="px-8 py-4">Role Access</th>
                                        <th className="px-8 py-4 text-right">Join Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {users.map((user, i) => (
                                        <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-[#0f172a] text-[15px]">{user.name}</div>
                                                <div className="text-[#64748b] text-[13px] mt-1">{user.email}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black border ${user.role === 'admin' ? 'bg-[#eef2ff] text-[#6366f1] border-[#c7d2fe]' : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right text-[#64748b]">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div ref={addToRefs} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="px-8 py-6 border-b border-[#f1f5f9] bg-white flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#0f172a]">Integrity Violation Logs</h2>
                        <span className="bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] px-3 py-1 rounded-lg text-xs font-bold">{logs.length} Events Logged</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#f8fafc]">
                        {logs.length === 0 ? (
                            <div className="text-center mt-20 flex flex-col items-center">
                                <CheckCircle2 size={40} className="text-[#10b981] mb-4" />
                                <div className="text-[#0f172a] font-bold text-lg mb-1">System Secure</div>
                                <p className="text-[#64748b] font-medium text-[15px]">Zero proctoring warnings detected.</p>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="p-5 bg-white border border-[#e2e8f0] shadow-sm rounded-2xl flex justify-between items-center group hover:border-[#cbd5e1] hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fecaca] shrink-0">
                                            <AlertCircle size={18} className="text-[#ef4444]" />
                                        </div>
                                        <div>
                                            <p className="text-[#0f172a] font-bold text-[15px]">{log.reason}</p>
                                            <p className="text-[#94a3b8] font-semibold text-[11px] uppercase tracking-widest mt-1.5">Sess ID: {log.interviewId}</p>
                                        </div>
                                    </div>
                                    <div className="text-[#64748b] bg-[#f1f5f9] px-3 py-1.5 rounded-lg text-xs font-bold ml-4 shrink-0 transition-opacity border border-[#e2e8f0]">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;
