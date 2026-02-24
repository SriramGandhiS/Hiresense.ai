import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UserCircle, Briefcase, Play, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const MockInterviewSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('Software Engineer');
    const [type, setType] = useState('Mixed');

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const accessRes = await api.get('/mock-interview/verify-access');

                if (!accessRes.data.allowed) {
                    setError(accessRes.data.message || 'Complete assessment with score ≥ 7 to unlock interview.');
                    setLoading(false);
                    return;
                }

                try {
                    const latestRes = await api.get('/mock-interview/latest-passed');
                    setCompany(latestRes.data.companyName);
                } catch (err) {
                    setCompany('General Core');
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to verify access permissions. Please try again.');
                setLoading(false);
            }
        };

        checkAccess();
    }, []);

    const handleStart = () => {
        setVerifying(true);
        setTimeout(() => {
            navigate('/mock-interview/session', {
                state: { company, role, type }
            });
        }, 800);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-6" />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Verifying Authorization...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12 premium-card p-10 text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Access Locked</h2>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                    Return to Mission Control
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <header className="flex flex-col">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Module Configuration</span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Proctor Setup</h1>
                <p className="text-gray-500 mt-2 text-base font-medium">Configure your session parameters for the high-pressure protocol.</p>
            </header>

            <div className="premium-card overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Company Field (Auto-filled) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                            <Building2 className="w-4 h-4 mr-2" /> Target Environment
                        </label>
                        <input
                            type="text"
                            value={company}
                            disabled
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-bold cursor-not-allowed opacity-80"
                        />
                        <p className="text-[10px] text-gray-400 font-medium">Auto-derived from latest successful assessment.</p>
                    </div>

                    {/* Role Dropdown */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                            <UserCircle className="w-4 h-4 mr-2" /> Persona Alignment
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all shadow-sm"
                        >
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                        </select>
                    </div>

                    {/* Interview Type */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['General Technical', 'Behavioral', 'Mixed'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-3 rounded-xl border text-xs font-black transition-all uppercase tracking-widest ${type === t
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Intensity Matrix</span>
                        <span className="text-xs font-bold text-gray-900">5 Questions • 15 Mins</span>
                    </div>
                    <button
                        onClick={handleStart}
                        disabled={verifying}
                        className="bg-indigo-600 text-white flex items-center px-10 py-4 rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {verifying ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            <>
                                Begin Session
                                <Play className="w-4 h-4 ml-3 fill-current" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSetup;
