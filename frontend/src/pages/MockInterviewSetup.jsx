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
                // First verify if user has access (score >= 7)
                const accessRes = await api.get('/mock-interview/verify-access');

                if (!accessRes.data.allowed) {
                    setError(accessRes.data.message || 'Complete assessment with score ≥ 7 to unlock interview.');
                    setLoading(false);
                    return;
                }

                // If allowed, fetch latest passed quiz company
                try {
                    const latestRes = await api.get('/mock-interview/latest-passed');
                    setCompany(latestRes.data.companyName);
                } catch (err) {
                    // It's okay if we don't find a company, though verify-access says they passed
                    setCompany('General');
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
        // Simulate a small delay for "Professional" feel
        setTimeout(() => {
            navigate('/mock-interview/session', {
                state: { company, role, type }
            });
        }, 800);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Verifying your assessment status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Locked</h2>
                <p className="text-slate-500 mb-8">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mock Interview Setup</h1>
                </div>
                <p className="text-slate-500 mt-2 text-lg">Configure your session parameters before we begin.</p>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-6">
                    {/* Company Field (Auto-filled) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                            <Building2 className="w-4 h-4 mr-2" /> Target Company
                        </label>
                        <input
                            type="text"
                            value={company}
                            disabled
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-2">Auto-filled from your latest successful assessment.</p>
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                            <UserCircle className="w-4 h-4 mr-2" /> Select Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        >
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                        </select>
                    </div>

                    {/* Interview Type */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Interview Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['General Technical', 'Behavioral', 'Mixed'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${type === t
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        <span className="font-bold text-slate-900">5 Questions</span> • ~15 Minutes
                    </div>
                    <button
                        onClick={handleStart}
                        disabled={verifying}
                        className="btn-primary flex items-center px-8 py-3 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-95 transform transition-all"
                    >
                        {verifying ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            <>
                                Start Interview
                                <Play className="w-4 h-4 ml-2 fill-current" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSetup;
