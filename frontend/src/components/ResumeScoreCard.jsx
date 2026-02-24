import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, Building2, Target, Zap } from 'lucide-react';

const ProgressBar = ({ label, score, colorClass }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-bold ${colorClass}`}>{score}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${colorClass.replace('text-', 'bg-')}`}
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const ResumeScoreCard = ({ score, analysis, summary }) => {
    const [displayScore, setDisplayScore] = useState(0);

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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header / Score Overview */}
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
                {/* Score Column */}
                <div className="premium-card p-10 flex flex-col items-center text-center space-y-8">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-gray-100 stroke-[10]"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-indigo-600 stroke-[10] transition-all duration-1000 ease-out"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * displayScore) / 100}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Impact Score</span>
                            <div className="flex items-end justify-center">
                                <span className="text-7xl font-extrabold text-gray-900 tracking-tighter">{displayScore}</span>
                                <span className="text-xl font-bold text-gray-300 mb-2 ml-1">/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-6 pt-6 border-t border-gray-50">
                        <ProgressBar label="Content Quality" score={categories.content || 0} colorClass="text-indigo-600" />
                        <ProgressBar label="ATS Essentials" score={categories.ats || 0} colorClass="text-teal-600" />
                        <ProgressBar label="Profile Tailoring" score={categories.tailoring || 0} colorClass="text-slate-600" />
                    </div>
                </div>

                {/* Summary Column */}
                <div className="md:col-span-2 space-y-8 flex flex-col">
                    <div className="flex-1 bg-indigo-600 p-10 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <Zap className="absolute -right-6 -top-6 w-40 h-40 text-white opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-2xl font-black tracking-tight uppercase">Executive Summary</h2>
                            <p className="text-indigo-50 text-xl font-medium leading-relaxed opacity-90">{summary}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="premium-card p-8 group">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-teal-50 rounded-lg"><TrendingUp className="w-5 h-5 text-teal-600" /></div>
                                <h4 className="font-black uppercase text-xs tracking-widest text-gray-900">Core Strengths</h4>
                            </div>
                            <ul className="space-y-4">
                                {strengths.slice(0, 3).map((s, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 font-medium leading-snug">
                                        <CheckCircle2 className="w-4 h-4 text-teal-500 mr-3 shrink-0 mt-0.5" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="premium-card p-8 group">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-rose-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-600" /></div>
                                <h4 className="font-black uppercase text-xs tracking-widest text-gray-900">Action Items</h4>
                            </div>
                            <ul className="space-y-4">
                                {weaknesses.slice(0, 3).map((w, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-600 font-medium leading-snug">
                                        <XCircle className="w-4 h-4 text-rose-500 mr-3 shrink-0 mt-0.5" />
                                        {w.area}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Checks Grid */}
            <div className="space-y-8">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-2xl">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Technical Compliance Audit</h3>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">16 Vector Intelligence Analysis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {checks.map((check, i) => (
                        <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 ${check.passed ? 'bg-white border-gray-100 shadow-sm' : 'bg-rose-50/30 border-rose-100 shadow-sm shadow-rose-50'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{check.name}</span>
                                {check.passed ? (
                                    <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Verified</div>
                                ) : (
                                    <div className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Signal Failure</div>
                                )}
                            </div>
                            <p className="text-sm font-bold text-gray-800 leading-snug mb-4">{check.feedback}</p>
                            <div className="pt-4 border-t border-gray-50">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                    <Target className="w-3 h-3 mr-1.5" /> Benchmarked Expectation
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">{check.companyExpectation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeScoreCard;
