import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, Building2, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const ProgressBar = ({ label, score, colorClass }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-end">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-black ${colorClass}`}>{score}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${colorClass.replace('text-', 'bg-')}`}
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const ResumeScoreCard = ({ score, analysis, summary }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setTilt({ x, y });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    useEffect(() => {
        let start = 0;
        const end = score;
        if (start === end) return;

        let totalDuration = 1500;
        let incrementTime = (totalDuration / end);

        let timer = setInterval(() => {
            start += 1;
            setDisplayScore(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [score]);

    if (!analysis) return null;

    const { categories = {}, issueCount = 0, strengths = [], weaknesses = [], checks = [] } = analysis;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 perspective-1000">
            {/* Header / Score Overview */}
            <div
                className="grid md:grid-cols-3 gap-8 items-start transition-transform duration-200 ease-out"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Score Column */}
                <div
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-6 transition-all duration-500 hover:shadow-indigo-100 hover:-translate-y-2 group"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    <div className="relative w-48 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        {/* Circular Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-slate-100 stroke-[8]"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-rose-500 stroke-[8] transition-all duration-1000 ease-out"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * displayScore) / 100}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="relative z-10 space-y-0">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                {analysis.detectedType || (score === 0 ? "Document" : "Score")}
                            </h3>
                            <div className="flex items-end justify-center">
                                <span className={`text-7xl font-black mb-[-8px] drop-shadow-sm ${score === 0 ? 'text-slate-400' : 'text-rose-500'}`}>{displayScore}</span>
                                <span className="text-2xl font-bold text-slate-300">/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-5 pt-6 border-t border-slate-100">
                        <ProgressBar label="Content" score={categories.content || 0} colorClass="text-rose-500" />
                        <ProgressBar label="Sections" score={categories.sections || 0} colorClass="text-emerald-500" />
                        <ProgressBar label="ATS Essentials" score={categories.ats || 0} colorClass="text-amber-500" />
                        <ProgressBar label="Tailoring" score={categories.tailoring || 0} colorClass="text-indigo-500" />
                    </div>
                    {issueCount > 0 && (
                        <div className="px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse">
                            {issueCount} Issues Flagged
                        </div>
                    )}
                </div>

                {/* Main Results Column */}
                <div className="md:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div
                        className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500"
                        style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
                    >
                        <Zap className="absolute -right-4 -top-4 w-32 h-32 text-indigo-500 opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                        <div className="relative z-10 space-y-3" style={{ transform: 'translateZ(20px)' }}>
                            <h2 className="text-2xl font-black">Expert Review Summary</h2>
                            <p className="text-indigo-100 text-lg font-medium leading-relaxed">{summary}</p>
                        </div>
                    </div>

                    {/* Quick Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl hover:shadow-emerald-100 transition-all duration-500 group">
                            <div className="flex items-center space-x-2 mb-4 text-emerald-600 group-hover:scale-110 transition-transform origin-left">
                                <TrendingUp className="w-5 h-5" />
                                <h4 className="font-black uppercase text-xs tracking-widest">Top Strengths</h4>
                            </div>
                            <ul className="space-y-3">
                                {strengths.map((s, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-600 font-medium translate-z-10">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl hover:shadow-rose-100 transition-all duration-500 group">
                            <div className="flex items-center space-x-2 mb-4 text-rose-600 group-hover:scale-110 transition-transform origin-left">
                                <AlertTriangle className="w-5 h-5" />
                                <h4 className="font-black uppercase text-xs tracking-widest">Critical Fixes</h4>
                            </div>
                            <ul className="space-y-3">
                                {weaknesses.map((w, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-600 font-medium translate-z-10">
                                        <XCircle className="w-4 h-4 text-rose-500 mr-2 shrink-0 mt-0.5" />
                                        {w.area}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recruiter Deep-Dive (Enhancv Layout) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-slate-900">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">Recruiter Deep-Dive (16 Checks)</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {checks.map((check, i) => (
                        <div key={i} className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-lg ${check.passed ? 'bg-white border-slate-200' : 'bg-rose-50/50 border-rose-100'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{check.name}</span>
                                {check.passed ? (
                                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black">Passed</div>
                                ) : (
                                    <div className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[9px] font-black">Issue</div>
                                )}
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-3">{check.feedback}</p>
                            <div className="pt-3 border-t border-slate-100/50">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-1">
                                    <Target className="w-3 h-3 mr-1" /> Expectation
                                </div>
                                <p className="text-[11px] text-slate-500 italic leading-tight">{check.companyExpectation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeScoreCard;
