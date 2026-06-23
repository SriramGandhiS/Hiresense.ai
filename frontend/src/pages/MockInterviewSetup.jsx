import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, ChevronDown, Play, Loader2, AlertTriangle, Building2, Briefcase
} from 'lucide-react';
import { getCompanies } from '../services/interviewApi';
import AvatarAmanda from '../components/AvatarAmanda';

/* ─────────────────────────────────────────────
   Fallback company list (used when API is down)
───────────────────────────────────────────── */
const FALLBACK_COMPANIES = [
    {
        id: 'tcs', name: 'TCS', emoji: '🏢', type: 'Service',
        difficulty: 'Fresher', tier: 'Tier 1', rounds: 4,
        roles: ['Software Engineer', 'System Engineer', 'Data Analyst', 'Business Analyst'],
    },
    {
        id: 'infosys', name: 'Infosys', emoji: '🌐', type: 'Service',
        difficulty: 'Fresher', tier: 'Tier 1', rounds: 4,
        roles: ['Systems Engineer', 'Technology Analyst', 'Senior Associate', 'Specialist Programmer'],
    },
    {
        id: 'wipro', name: 'Wipro', emoji: '💼', type: 'Service',
        difficulty: 'Fresher', tier: 'Tier 1', rounds: 3,
        roles: ['Project Engineer', 'Software Engineer', 'Business Analyst', 'Data Engineer'],
    },
    {
        id: 'amazon', name: 'Amazon', emoji: '📦', type: 'Product',
        difficulty: 'Hard', tier: 'FAANG', rounds: 5,
        roles: ['SDE I', 'SDE II', 'Data Scientist', 'Product Manager', 'Solutions Architect'],
    },
    {
        id: 'google', name: 'Google', emoji: '🔍', type: 'Product',
        difficulty: 'Hard', tier: 'FAANG', rounds: 5,
        roles: ['Software Engineer', 'Staff Engineer', 'Data Scientist', 'Product Manager'],
    },
    {
        id: 'microsoft', name: 'Microsoft', emoji: '🪟', type: 'Product',
        difficulty: 'Hard', tier: 'Tier 1', rounds: 4,
        roles: ['Software Engineer', 'Senior SWE', 'Program Manager', 'Data Engineer'],
    },
    {
        id: 'razorpay', name: 'Razorpay', emoji: '💳', type: 'Startup',
        difficulty: 'Mid', tier: 'Unicorn', rounds: 4,
        roles: ['Backend Engineer', 'Frontend Engineer', 'FullStack Engineer', 'Data Analyst'],
    },
    {
        id: 'swiggy', name: 'Swiggy', emoji: '🍕', type: 'Startup',
        difficulty: 'Mid', tier: 'Unicorn', rounds: 4,
        roles: ['Software Engineer', 'Senior SWE', 'Data Scientist', 'Product Manager'],
    },
    {
        id: 'flipkart', name: 'Flipkart', emoji: '🛒', type: 'Product',
        difficulty: 'Hard', tier: 'Tier 1', rounds: 5,
        roles: ['SDE I', 'SDE II', 'Data Analyst', 'Product Manager', 'ML Engineer'],
    },
    {
        id: 'accenture', name: 'Accenture', emoji: '⚡', type: 'Service',
        difficulty: 'Fresher', tier: 'Tier 1', rounds: 3,
        roles: ['Associate Software Engineer', 'Software Engineer', 'Analyst', 'Senior Analyst'],
    },
];

const FILTER_TABS = ['All', 'Service', 'Product', 'Startup'];

const DIFFICULTY_COLORS = {
    Fresher: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Mid:     'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Hard:    'bg-red-500/20 text-red-400 border-red-500/30',
};

const ALL_ROLES = [
    'Software Engineer', 'SDE I', 'SDE II', 'Senior Software Engineer',
    'Frontend Developer', 'Backend Developer', 'FullStack Engineer',
    'Data Scientist', 'Data Analyst', 'ML Engineer',
    'Product Manager', 'Business Analyst', 'Solutions Architect',
    'DevOps Engineer', 'QA Engineer', 'Systems Engineer',
];

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const MockInterviewSetup = () => {
    const navigate = useNavigate();

    const [companies, setCompanies]         = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [apiError, setApiError]           = useState(false);

    const [filter, setFilter]               = useState('All');
    const [search, setSearch]               = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [role, setRole]                   = useState('Software Engineer');
    const [interviewType, setInterviewType] = useState('Mixed');
    const [starting, setStarting]           = useState(false);

    /* Fetch companies */
    useEffect(() => {
        (async () => {
            try {
                const data = await getCompanies();
                const list = Array.isArray(data) ? data : data?.companies ?? data?.data ?? [];
                if (list.length > 0) {
                    setCompanies(list);
                } else {
                    setCompanies(FALLBACK_COMPANIES);
                    setApiError(true);
                }
            } catch {
                setCompanies(FALLBACK_COMPANIES);
                setApiError(true);
            } finally {
                setLoadingCompanies(false);
            }
        })();
    }, []);

    /* Filtered list */
    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            const matchType   = filter === 'All' || c.type === filter;
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
            return matchType && matchSearch;
        });
    }, [companies, filter, search]);

    /* Available roles for selected company */
    const availableRoles = useMemo(() => {
        return selectedCompany?.roles ?? ALL_ROLES;
    }, [selectedCompany]);

    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
        // Set default role for this company
        if (company.roles && company.roles.length > 0) {
            setRole(company.roles[0]);
        }
    };

    const handleStart = () => {
        if (!selectedCompany || !role) return;
        setStarting(true);
        setTimeout(() => {
            navigate('/mock-interview/session', {
                state: {
                    company: selectedCompany.name,
                    role,
                    interviewType,
                    companyData: selectedCompany,
                },
            });
        }, 700);
    };

    return (
        <div className="min-h-screen pb-32 relative z-10 overflow-x-hidden">
            {/* ── Header ── */}
            <div className="px-6 pt-10 pb-8 lg:px-12 lg:pt-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                        <AvatarAmanda size="sm" isSpeaking={false} isThinking={false} />
                        <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                                AI Mock Interview
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-2">
                                Choose Your Interviewer
                            </h1>
                            <p className="text-white/50 text-base lg:text-lg font-medium">
                                I'm <span className="text-white font-bold">Amanda</span>. Let's prepare you for your dream company.
                            </p>
                        </div>
                    </div>

                    {/* Offline banner */}
                    {apiError && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                            <AlertTriangle size={16} className="shrink-0" />
                            <span className="font-medium">API unavailable — showing default company list.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 lg:px-12 max-w-5xl mx-auto space-y-10">
                {/* ── Filter + Search ── */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                                    filter === tab
                                        ? 'bg-white text-black border-white shadow-lg'
                                        : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white/80'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 min-w-0 sm:max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search companies..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                        />
                    </div>
                </div>

                {/* ── Company Grid ── */}
                {loadingCompanies ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCompanies.map(company => {
                            const isSelected = selectedCompany?.id === company.id || selectedCompany?.name === company.name;
                            return (
                                <button
                                    key={company.id ?? company.name}
                                    onClick={() => handleSelectCompany(company)}
                                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 group ${
                                        isSelected
                                            ? 'bg-indigo-500/15 border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-[1.03]'
                                            : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/6 hover:scale-[1.02]'
                                    }`}
                                    style={{
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    {/* Selected indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                                    )}

                                    {/* Emoji logo */}
                                    <div className="text-4xl mb-3 transition-transform group-hover:scale-110 duration-200">
                                        {company.emoji ?? '🏢'}
                                    </div>

                                    {/* Name */}
                                    <div className="text-white font-bold text-sm mb-2 leading-tight">
                                        {company.name}
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-col gap-1.5 items-center w-full">
                                        {company.difficulty && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${DIFFICULTY_COLORS[company.difficulty] ?? 'bg-white/10 text-white/50 border-white/10'}`}>
                                                {company.difficulty}
                                            </span>
                                        )}
                                        {company.tier && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/8 text-white/50 border border-white/10">
                                                {company.tier}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rounds */}
                                    {company.rounds && (
                                        <div className="mt-2 text-[10px] text-white/30 font-medium">
                                            {company.rounds} Rounds
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {filteredCompanies.length === 0 && (
                            <div className="col-span-full text-center py-16 text-white/30 text-sm">
                                No companies found for "{search}" in "{filter}"
                            </div>
                        )}
                    </div>
                )}

                {/* ── Configuration panel (shown after company selected) ── */}
                <div
                    className="rounded-2xl border border-white/10 overflow-hidden transition-all duration-500"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        opacity: selectedCompany ? 1 : 0.4,
                        pointerEvents: selectedCompany ? 'auto' : 'none',
                    }}
                >
                    <div className="px-6 py-5 border-b border-white/8">
                        <h2 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                            <Briefcase size={14} className="text-indigo-400" />
                            Configure Interview
                            {selectedCompany && (
                                <span className="text-indigo-400 normal-case font-normal tracking-normal">
                                    — {selectedCompany.name}
                                </span>
                            )}
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Role selection */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={12} />
                                Target Role
                            </label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full appearance-none px-5 py-4 bg-white/8 border border-white/15 rounded-xl text-white font-semibold text-sm outline-none focus:border-indigo-400/50 focus:bg-white/12 transition-all"
                                    style={{ backdropFilter: 'blur(8px)' }}
                                >
                                    {availableRoles.map(r => (
                                        <option key={r} value={r} className="bg-[#0d0d1a] text-white">
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                            </div>
                        </div>

                        {/* Interview type */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                Interview Type
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Technical', 'Behavioral', 'Mixed'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setInterviewType(t)}
                                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                                            interviewType === t
                                                ? 'bg-white text-black border-white shadow-lg'
                                                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/25 hover:text-white/80'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amanda's intro message */}
                        {selectedCompany && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
                                <div className="text-2xl shrink-0">✨</div>
                                <p className="text-indigo-300/80 text-sm font-medium leading-relaxed">
                                    Ready to interview you for{' '}
                                    <span className="text-white font-bold">{role}</span>{' '}
                                    at{' '}
                                    <span className="text-white font-bold">{selectedCompany.name}</span>!
                                    {selectedCompany.rounds && (
                                        <> We'll have {selectedCompany.rounds} rounds covering {interviewType.toLowerCase()} questions.</>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Start button */}
                        <div className="pt-2">
                            <button
                                onClick={handleStart}
                                disabled={!selectedCompany || !role || starting}
                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                                    selectedCompany && role && !starting
                                        ? 'bg-white text-black hover:bg-gray-100 shadow-2xl hover:scale-[1.02] active:scale-95'
                                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                            >
                                {starting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Initializing Session...
                                    </>
                                ) : (
                                    <>
                                        <Play size={16} className="fill-current" />
                                        {selectedCompany ? `Start ${selectedCompany.name} Interview` : 'Select a Company First'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSetup;
