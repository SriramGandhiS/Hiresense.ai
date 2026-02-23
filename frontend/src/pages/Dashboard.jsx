import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Building2, Video, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const modules = [
        {
            title: "Resume Intelligence",
            description: "AI-powered analysis and optimization for your CV against standard ATS systems.",
            icon: <Brain className="w-8 h-8 text-indigo-600 mb-4" />,
            color: "bg-indigo-50 border-indigo-100",
            link: "/resume"
        },
        {
            title: "Company Assessment",
            description: "Research and analyze target companies to align your profile with their core values.",
            icon: <Building2 className="w-8 h-8 text-emerald-600 mb-4" />,
            color: "bg-emerald-50 border-emerald-100",
            link: "/company"
        },
        {
            title: "Mock Interview",
            description: "Practice your interview skills with our AI proctor in a timed, realistic environment.",
            icon: <Video className="w-8 h-8 text-rose-600 mb-4" />,
            color: "bg-rose-50 border-rose-100",
            link: "/mock-interview/setup"
        },
        {
            title: "Performance History",
            description: "Track your past scores, improvement metrics, and overall candidate rating.",
            icon: <Activity className="w-8 h-8 text-amber-600 mb-4" />,
            color: "bg-amber-50 border-amber-100",
            link: "/performance"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-slate-500 mt-2 text-lg">Select a module below to begin your preparation journey.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {modules.map((mod, index) => (
                    <Link to={mod.link} key={index} className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white ${mod.color.replace('bg-', 'hover:bg-').split(' ')[0]}`}>
                        {mod.icon}
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{mod.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-6">{mod.description}</p>

                        <div className="flex items-center text-sm font-bold text-slate-900 group">
                            Enter Module
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
