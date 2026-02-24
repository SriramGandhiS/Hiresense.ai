import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Timer, MessageSquare, ArrowRight, XCircle, ShieldCheck } from 'lucide-react';

const MockInterviewSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { company, role, type } = location.state || { company: 'General', role: 'Software Engineer', type: 'Mixed' };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header info */}
            <header className="flex flex-col sm:flex-row items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">
                        {company.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{company} Interview</h2>
                            <ShieldCheck className="w-4 h-4 text-teal-600" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{role} • {type} Protocol</p>
                    </div>
                </div>

                <div className="flex items-center space-x-8 mt-6 sm:mt-0">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Elapsed</span>
                        <div className="flex items-center text-gray-900 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 shadow-inner">
                            <Timer className="w-4 h-4 mr-3 text-indigo-600" />
                            <span className="font-mono font-bold text-lg">25:00</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-3 text-gray-300 hover:text-rose-500 transition-all active:scale-90"
                        title="Quit Protocol"
                    >
                        <XCircle className="w-8 h-8" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Question Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card overflow-hidden flex flex-col min-h-[550px]">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Input Phase</span>
                                <span className="text-sm font-bold text-gray-900">Question 1 of 5</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <div key={n} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${n === 1 ? 'bg-indigo-600 scale-x-110' : 'bg-gray-100'}`}></div>
                                ))}
                            </div>
                        </div>

                        <div className="p-12 flex-grow">
                            <h3 className="text-3xl font-extrabold text-gray-900 leading-tight mb-10 tracking-tight">
                                Can you elaborate on a challenging technical project you've orchestrated, highlighting your specific contributions to the outcome?
                            </h3>

                            <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex items-start space-x-6">
                                <div className="text-2xl animate-bounce">💡</div>
                                <div className="text-sm text-indigo-900 leading-relaxed font-medium">
                                    <p className="font-black text-[10px] uppercase tracking-widest mb-2 opacity-60">Synthesis Recommendation</p>
                                    Apply the <span className="text-indigo-600 font-bold">STAR Method</span> (Situation, Task, Action, Result) to maximize cognitive clarity and professional impact in your response.
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-50 bg-gray-50/20">
                            <button className="flex items-center text-gray-400 font-bold text-xs uppercase tracking-[0.2em] cursor-not-allowed opacity-60">
                                <MessageSquare className="w-4 h-4 mr-3" />
                                Voice Feed Acquisition Disabled
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Answer Input */}
                <div className="space-y-8">
                    <div className="premium-card p-8 flex flex-col h-full bg-white">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Neural Response Input</label>
                        <textarea
                            className="flex-grow w-full p-6 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 min-h-[350px] resize-none transition-all shadow-inner text-base leading-relaxed"
                            placeholder="Type your strategic response here..."
                        ></textarea>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Character Count</span>
                                <span className="text-xs font-bold text-gray-900">0 / 500 Threshold</span>
                            </div>
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold font-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center">
                                Submit Answer
                                <ArrowRight className="w-4 h-4 ml-3" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-3xl p-8 text-white overflow-hidden relative group shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <h4 className="font-black text-xs uppercase tracking-widest">Stable Core 1.0</h4>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Video and biometric acquisition are currently suspended to maintain data integrity. Please prioritize text-based structured synthesis.
                            </p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gray-800 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-1000"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSession;
