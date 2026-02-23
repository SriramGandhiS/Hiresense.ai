import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Timer, MessageSquare, ArrowRight, XCircle } from 'lucide-react';

const MockInterviewSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { company, role, type } = location.state || { company: 'General', role: 'Software Engineer', type: 'Mixed' };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-700">
            {/* Header info */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                        <span className="text-xl font-bold text-indigo-600">{company.charAt(0)}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{company} Interview</h2>
                        <p className="text-sm text-slate-500 font-medium">{role} • {type}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Timer className="w-4 h-4 mr-2" />
                        <span className="font-mono font-bold">25:00</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Quit Interview"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Question Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question 1 of 5</span>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <div key={n} className={`w-8 h-1.5 rounded-full ${n === 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 flex-grow">
                            <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8">
                                Can you tell us about a challenging technical project you've worked on recently and your specific role in its success?
                            </h3>

                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start">
                                <div className="mt-1 mr-4">💡</div>
                                <div className="text-sm text-amber-800 leading-relaxed">
                                    <p className="font-bold mb-1">AI Prompt Tip:</p>
                                    Use the STAR method (Situation, Task, Action, Result) to structure your response for maximum clarity and impact.
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                            <button className="flex items-center text-slate-400 font-bold text-sm cursor-not-allowed">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Voice Note (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Answer Input */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Your Response</label>
                        <textarea
                            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[300px] resize-none transition-all"
                            placeholder="Type your answer here..."
                        ></textarea>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">0 / 500 words</span>
                            <button className="btn-primary px-6 py-2.5 flex items-center">
                                Submit Answer
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Stable Build 1.0</h4>
                            <p className="text-indigo-200 text-sm leading-relaxed">
                                Real-time video and audio processing are currently disabled for stability. Focus on text-based structured responses.
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-800 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSession;
