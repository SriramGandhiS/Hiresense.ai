import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Building2, Video, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const modules = [
        {
            title: "Resume Intelligence",
            description: "AI-powered analysis of your CV architecture for ATS compliance.",
            icon: <Brain className="w-10 h-10 text-indigo-600 mb-6" />,
            link: "/resume"
        },
        {
            title: "Company Research",
            description: "Deep-dive into corporate DNA and core values alignment.",
            icon: <Building2 className="w-10 h-10 text-teal-600 mb-6" />,
            link: "/company"
        },
        {
            title: "Mock Interview",
            description: "Simulated high-pressure protocols with AI-driven proctoring.",
            icon: <Video className="w-10 h-10 text-indigo-500 mb-6" />,
            link: "/mock-interview/setup"
        },
        {
            title: "Performance Metrics",
            description: "Track your trajectory with real-time telemetry and history.",
            icon: <Activity className="w-10 h-10 text-slate-600 mb-6" />,
            link: "/performance"
        }
    ];

    return (
        <div className="space-y-10 pb-12">
            <header className="relative">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back, <span className="text-indigo-600 font-black">{user?.name?.split(' ')[0] || 'Member'}</span>!
                </h1>
                <p className="text-gray-500 mt-1 text-base">Select a module below to advance your preparation journey.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {modules.map((mod, index) => (
                    <Link to={mod.link} key={index} className="premium-card p-10 group relative flex flex-col justify-between hover:bg-white active:scale-[0.98]">
                        <div>
                            {mod.icon}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{mod.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">{mod.description}</p>
                        </div>

                        <div className="flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                            Initialize Protocol
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-x-1 duration-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
