import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Mic, MicOff, ArrowRight, XCircle, Loader2, AlertTriangle,
    Download, RefreshCw, ChevronRight, Star, TrendingUp, AlertCircle,
    CheckCircle2, Clock
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import {
    checkOllamaHealth,
    generateQuestions,
    evaluateAnswer,
    generateFinalReport,
} from '../services/interviewApi';
import AvatarAmanda from '../components/AvatarAmanda';

/* ──────────────────────────────────────────────────────
   Constants
────────────────────────────────────────────────────── */
const ROUND_LABELS = [
    'Introduction',
    'Technical',
    'Behavioral',
    'Problem Solving',
    'HR',
];

const FALLBACK_QUESTIONS = {
    TCS: [
        'Tell me about yourself.',
        'What is Object-Oriented Programming?',
        'Explain the SDLC.',
        'Where do you see yourself in 5 years?',
        'Why TCS?',
    ],
    Amazon: [
        'Tell me about a time you failed.',
        'Design a URL shortener.',
        'What is your leadership style?',
        'Most challenging project?',
        'Why Amazon?',
    ],
    Google: [
        'Tell me about yourself.',
        'Reverse a linked list.',
        'System design: Design YouTube.',
        'Tell me about a time you innovated.',
        'Why Google?',
    ],
    default: [
        'Tell me about yourself.',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'Why this role?',
        'Any questions for us?',
    ],
};

const QUESTION_TIMER_SECS = 120; // 2 minutes

const VERDICT_STYLES = {
    'Strong Hire':  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    'Hire':         { bg: 'bg-blue-500/20',    border: 'border-blue-500/40',    text: 'text-blue-400'    },
    'Borderline':   { bg: 'bg-amber-500/20',   border: 'border-amber-500/40',   text: 'text-amber-400'   },
    'No Hire':      { bg: 'bg-red-500/20',     border: 'border-red-500/40',     text: 'text-red-400'     },
};

/* ──────────────────────────────────────────────────────
   Utility helpers
────────────────────────────────────────────────────── */
const getFallbackQuestions = (company) =>
    FALLBACK_QUESTIONS[company] ?? FALLBACK_QUESTIONS.default;

const fmtTime = (secs) =>
    `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

const glassPanelClass =
    'rounded-2xl border border-white/10 p-5 lg:p-6';

const glassPanelStyle = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
};

/* ──────────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────────── */

/** Speech wave bars shown while user is speaking into mic */
const SpeechWave = () => (
    <div className="flex items-end gap-[3px] h-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
                key={i}
                style={{
                    width: 3,
                    borderRadius: 2,
                    background: '#6366f1',
                    animation: `waveBar 0.6s ease-in-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                    minHeight: 4,
                }}
            />
        ))}
    </div>
);

/** A score ring (decorative) */
const ScoreRing = ({ score, max = 10, size = 80 }) => {
    const pct = (score / max) * 100;
    const r   = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const color = pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct / 100)}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text
                x={size / 2} y={size / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={size * 0.22}
                fontWeight={800}
            >
                {score}
            </text>
        </svg>
    );
};

/** Feedback card shown after each answer evaluation */
const EvaluationCard = ({ evaluation, onNext, isLast }) => {
    if (!evaluation) return null;

    const score   = evaluation.score ?? evaluation.rating ?? 0;
    const verdict = evaluation.verdict ?? (score >= 8 ? 'Strong Hire' : score >= 6 ? 'Hire' : score >= 4 ? 'Borderline' : 'No Hire');
    const vstyle  = VERDICT_STYLES[verdict] ?? VERDICT_STYLES['Borderline'];
    const strengths    = evaluation.strengths    ?? evaluation.positives ?? [];
    const improvements = evaluation.improvements ?? evaluation.negatives ?? [];
    const sampleAnswer = evaluation.sampleAnswer ?? evaluation.sample_answer ?? '';

    return (
        <div className={`${glassPanelClass} space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500`} style={glassPanelStyle}>
            {/* Score + verdict */}
            <div className="flex items-center gap-5">
                <ScoreRing score={score} />
                <div>
                    <div className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">Score</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${vstyle.bg} ${vstyle.border} ${vstyle.text}`}>
                        {verdict}
                    </div>
                    <div className="text-white/40 text-xs mt-1">{score}/10</div>
                </div>
            </div>

            {/* Feedback text */}
            {evaluation.feedback && (
                <p className="text-white/70 text-sm leading-relaxed">{evaluation.feedback}</p>
            )}

            {/* Strengths */}
            {strengths.length > 0 && (
                <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">✅ Strengths</div>
                    <ul className="space-y-1">
                        {strengths.map((s, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">•</span>{s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
                <div>
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">⚠ Improvements</div>
                    <ul className="space-y-1">
                        {improvements.map((s, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>{s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sample answer */}
            {sampleAnswer && (
                <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">💡 Sample Answer</div>
                    <p className="text-white/60 text-sm leading-relaxed">{sampleAnswer}</p>
                </div>
            )}

            <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
            >
                {isLast ? 'View Final Report' : 'Next Question'}
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

/** Final comprehensive report */
const FinalReport = ({ report, company, role, answers, evaluations, onRestart }) => {
    const navigate = useNavigate();

    const overallScore = report?.overallScore
        ?? report?.overall_score
        ?? (evaluations.length > 0
            ? Math.round(evaluations.reduce((s, e) => s + (e?.score ?? e?.rating ?? 0), 0) / evaluations.length)
            : 0);

    const verdict = report?.verdict ?? report?.hiringVerdict ?? report?.hiring_verdict
        ?? (overallScore >= 8 ? 'Strong Hire' : overallScore >= 6 ? 'Hire' : overallScore >= 4 ? 'Borderline' : 'No Hire');

    const vstyle   = VERDICT_STYLES[verdict] ?? VERDICT_STYLES['Borderline'];
    const strengths   = report?.strengths ?? report?.topStrengths ?? [];
    const gaps        = report?.gaps ?? report?.criticalGaps ?? report?.critical_gaps ?? [];
    const actionPlan  = report?.actionPlan ?? report?.action_plan ?? [];
    const cultureFit  = report?.cultureFit ?? report?.culture_fit ?? null;

    const roundScores = evaluations.map((e, i) => ({
        label: ROUND_LABELS[i] ?? `Round ${i + 1}`,
        score: e?.score ?? e?.rating ?? 0,
    }));

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
            {/* Hero score */}
            <div className="text-center space-y-4">
                <div className="text-white/40 text-xs uppercase tracking-widest font-bold">Final Score</div>
                <div className="flex justify-center">
                    <ScoreRing score={overallScore} size={120} />
                </div>
                <div className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-black border ${vstyle.bg} ${vstyle.border} ${vstyle.text}`}>
                    {verdict}
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter">
                    {company} Interview Complete
                </h2>
                <p className="text-white/50 text-base">
                    Role: <span className="text-white font-bold">{role}</span>
                </p>
            </div>

            {/* Round-by-round scores */}
            {roundScores.length > 0 && (
                <div className={glassPanelClass} style={glassPanelStyle}>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Round Scores</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {roundScores.map((r, i) => {
                            const clr = r.score >= 7 ? 'text-emerald-400' : r.score >= 5 ? 'text-amber-400' : 'text-red-400';
                            return (
                                <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-white/4 border border-white/8 gap-1">
                                    <div className="text-white/40 text-[10px] uppercase tracking-wider font-bold">{r.label}</div>
                                    <div className={`text-2xl font-black ${clr}`}>{r.score}</div>
                                    <div className="text-white/30 text-[10px]">/10</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Strengths */}
            {strengths.length > 0 && (
                <div className={glassPanelClass} style={glassPanelStyle}>
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Star size={12} /> Top Strengths
                    </h3>
                    <ul className="space-y-2">
                        {strengths.slice(0, 3).map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Critical gaps */}
            {gaps.length > 0 && (
                <div className={glassPanelClass} style={glassPanelStyle}>
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertCircle size={12} /> Critical Gaps
                    </h3>
                    <ul className="space-y-2">
                        {gaps.map((g, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                                {g}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action plan */}
            {actionPlan.length > 0 && (
                <div className={glassPanelClass} style={glassPanelStyle}>
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp size={12} /> 5-Step Action Plan
                    </h3>
                    <ol className="space-y-3">
                        {actionPlan.slice(0, 5).map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black flex items-center justify-center">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Culture fit */}
            {cultureFit !== null && (
                <div className={glassPanelClass} style={glassPanelStyle}>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Company Culture Fit</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                                style={{ width: `${cultureFit * 10}%` }}
                            />
                        </div>
                        <span className="text-white font-bold text-sm">{cultureFit}/10</span>
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/8 border border-white/15 text-white font-bold text-sm hover:bg-white/12 transition-all"
                >
                    <Download size={16} /> Download Report
                </button>
                <button
                    onClick={onRestart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                >
                    <RefreshCw size={16} /> Try Another Company
                </button>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────────────
   Main MockInterviewSession
────────────────────────────────────────────────────── */
const MockInterviewSession = () => {
    const location = useLocation();
    const navigate  = useNavigate();

    const {
        company = 'General',
        role    = 'Software Engineer',
        interviewType = 'Mixed',
        companyData   = null,
    } = location.state || {};

    const totalRounds = companyData?.rounds ?? 5;

    /* Speech hook */
    const {
        isListening,
        transcript,
        setTranscript,
        startListening,
        stopListening,
        speak,
        error: speechError,
    } = useSpeech();

    /* Session state */
    const [ollamaOnline,    setOllamaOnline]    = useState(null);    // null=checking
    const [phase,           setPhase]           = useState('intro'); // intro|question|evaluating|evaluation|final|report
    const [currentRound,    setCurrentRound]    = useState(0);       // 0-based
    const [allQuestions,    setAllQuestions]    = useState([]);       // for this round
    const [qIdx,            setQIdx]            = useState(0);       // question index within round
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [answer,          setAnswer]          = useState('');
    const [answers,         setAnswers]         = useState([]);      // all submitted answers
    const [evaluations,     setEvaluations]     = useState([]);      // per question
    const [finalReport,     setFinalReport]     = useState(null);
    const [isLoading,       setIsLoading]       = useState(false);
    const [isSpeaking,      setIsSpeaking]      = useState(false);
    const [offlineBanner,   setOfflineBanner]   = useState(false);
    const [timer,           setTimer]           = useState(QUESTION_TIMER_SECS);
    const [timerRunning,    setTimerRunning]    = useState(false);

    const timerRef = useRef(null);

    /* ── Check Ollama health on mount ── */
    useEffect(() => {
        (async () => {
            try {
                await checkOllamaHealth();
                setOllamaOnline(true);
            } catch {
                setOllamaOnline(false);
                setOfflineBanner(true);
            }
        })();
    }, []);

    /* ── Sync transcript → answer field ── */
    useEffect(() => {
        if (transcript) {
            setAnswer(prev => (prev ? prev + ' ' + transcript : transcript));
            setTranscript('');
        }
    }, [transcript, setTranscript]);

    /* ── Timer countdown ── */
    useEffect(() => {
        if (timerRunning && timer > 0) {
            timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && timerRunning) {
            handleSubmitAnswer();
        }
        return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer, timerRunning]);

    /* ── Speak helper with isSpeaking flag ── */
    const speakText = useCallback((text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(true);
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate  = 0.95;
        utt.pitch = 1.05;
        utt.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
            v.name.includes('Google UK English Female') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.name.toLowerCase().includes('female')
        );
        if (preferred) utt.voice = preferred;
        utt.onend = () => setIsSpeaking(false);
        utt.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
    }, []);

    /* ── Load questions for a round ── */
    const loadQuestionsForRound = useCallback(async (roundIndex) => {
        setIsLoading(true);
        const roundLabel = ROUND_LABELS[roundIndex] ?? `Round ${roundIndex + 1}`;
        try {
            if (ollamaOnline === false) throw new Error('offline');
            const data = await generateQuestions({
                company,
                role,
                interviewType,
                round: roundLabel,
            });
            const questions = Array.isArray(data)
                ? data
                : data?.questions ?? data?.data ?? getFallbackQuestions(company);
            setAllQuestions(questions);
            setIsLoading(false);
            return questions;
        } catch {
            const fallback = getFallbackQuestions(company);
            setAllQuestions(fallback);
            setIsLoading(false);
            return fallback;
        }
    }, [ollamaOnline, company, role, interviewType]);

    /* ── Intro phase: speak welcome + set first question ── */
    useEffect(() => {
        if (phase !== 'intro') return;
        const introText = `Hi! I'm Amanda from HireSense. Welcome to your ${company} interview for the ${role} position. We'll have ${totalRounds} rounds today. Let's begin with introductions. Please tell me about yourself.`;

        // Load intro round questions in background
        (async () => {
            const qs = await loadQuestionsForRound(0);
            setCurrentQuestion(qs[0] ?? 'Tell me about yourself and what excites you about this role?');
            setQIdx(0);
            setTimer(QUESTION_TIMER_SECS);
        })();

        // Slight delay before speaking (give voices time to load)
        const t = setTimeout(() => speakText(introText), 800);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    /* ── Start question phase ── */
    const beginQuestion = useCallback((question) => {
        setPhase('question');
        setAnswer('');
        setCurrentQuestion(question);
        setTimer(QUESTION_TIMER_SECS);
        setTimerRunning(true);
        setTimeout(() => speakText(question), 300);
    }, [speakText]);

    const handleStartInterview = () => {
        setTimerRunning(false);
        beginQuestion(allQuestions[0] ?? currentQuestion);
    };

    /* ── Submit answer ── */
    const handleSubmitAnswer = useCallback(async () => {
        if (isListening) stopListening();
        setTimerRunning(false);
        setPhase('evaluating');
        setIsLoading(true);

        const submittedAnswer = answer.trim() || '(No answer provided)';
        const roundLabel = ROUND_LABELS[currentRound] ?? `Round ${currentRound + 1}`;

        let evaluation = null;
        try {
            if (ollamaOnline === false) throw new Error('offline');
            const data = await evaluateAnswer({
                question: currentQuestion,
                answer: submittedAnswer,
                company,
                role,
                round: roundLabel,
            });
            evaluation = data?.evaluation ?? data?.result ?? data ?? {};
        } catch {
            // Fallback evaluation
            const words = submittedAnswer.split(/\s+/).filter(Boolean).length;
            const score = Math.min(10, Math.max(1, Math.round(words / 10)));
            evaluation = {
                score,
                verdict: score >= 7 ? 'Hire' : score >= 5 ? 'Borderline' : 'No Hire',
                feedback: 'Great effort! Keep practicing to improve your responses.',
                strengths: ['Attempted the question', 'Showed willingness'],
                improvements: ['Add more structure', 'Include examples using STAR method'],
                sampleAnswer: 'A strong answer would use the STAR method: Situation, Task, Action, Result.',
            };
        }

        const newAnswers     = [...answers,     { question: currentQuestion, answer: submittedAnswer }];
        const newEvaluations = [...evaluations, evaluation];
        setAnswers(newAnswers);
        setEvaluations(newEvaluations);
        setIsLoading(false);
        setPhase('evaluation');
    }, [
        answer, currentQuestion, currentRound, company, role,
        ollamaOnline, isListening, stopListening, answers, evaluations,
    ]);

    /* ── Move to next question or round ── */
    const handleNextQuestion = useCallback(async () => {
        const nextQIdx = qIdx + 1;

        if (nextQIdx < allQuestions.length) {
            // More questions in this round
            setQIdx(nextQIdx);
            beginQuestion(allQuestions[nextQIdx]);
        } else {
            // End of round
            const nextRound = currentRound + 1;
            if (nextRound >= totalRounds) {
                // All rounds done → generate final report
                setPhase('final');
                setIsLoading(true);
                try {
                    const sessionData = { rounds: answers.map((a, i) => ({ ...a, evaluation: evaluations[i] })) };
                    const report = await generateFinalReport({ sessionData, company, role });
                    setFinalReport(report?.report ?? report?.result ?? report ?? {});
                } catch {
                    // Build minimal report from evaluations
                    setFinalReport(null);
                }
                setIsLoading(false);
                setPhase('report');
            } else {
                // Next round
                setCurrentRound(nextRound);
                setQIdx(0);
                const qs = await loadQuestionsForRound(nextRound);
                beginQuestion(qs[0] ?? 'Tell me about yourself.');
            }
        }
    }, [qIdx, allQuestions, currentRound, totalRounds, answers, evaluations, company, role, beginQuestion, loadQuestionsForRound]);

    /* ── Progress bar ── */
    const progressPct = ((currentRound * 5 + qIdx + 1) / (totalRounds * 5)) * 100;

    /* ── Render guard ── */
    if (phase === 'report') {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <AvatarAmanda size="md" isThinking={true} />
                    <p className="text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">
                        Amanda is preparing your final report...
                    </p>
                </div>
            );
        }
        return (
            <FinalReport
                report={finalReport ?? {}}
                company={company}
                role={role}
                answers={answers}
                evaluations={evaluations}
                onRestart={() => navigate('/mock-interview/setup')}
            />
        );
    }

    /* ─────────────────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen pb-28 relative z-10 overflow-x-hidden">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/8 z-30">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            {/* Offline banner */}
            {offlineBanner && (
                <div className="fixed top-0.5 left-0 right-0 z-20 flex justify-center">
                    <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-xl backdrop-blur-xl">
                        <AlertTriangle size={12} />
                        AI Engine Offline — Using preset questions
                    </div>
                </div>
            )}

            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-4 lg:px-8 border-b border-white/8 mt-0.5">
                {/* Left: company info */}
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{companyData?.emoji ?? '🏢'}</div>
                    <div>
                        <div className="text-white font-bold text-sm">{company}</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
                            {role} · {interviewType}
                        </div>
                    </div>
                </div>

                {/* Center: round label */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        {ROUND_LABELS[currentRound] ?? `Round ${currentRound + 1}`}
                    </span>
                    <span className="text-white/30 text-[10px]">
                        {currentRound + 1}/{totalRounds}
                    </span>
                </div>

                {/* Right: timer + quit */}
                <div className="flex items-center gap-3">
                    {timerRunning && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                            timer < 30 ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-white/60'
                        }`}>
                            <Clock size={12} />
                            {fmtTime(timer)}
                        </div>
                    )}
                    <button
                        onClick={() => { window.speechSynthesis?.cancel(); navigate('/mock-interview/setup'); }}
                        className="p-2 text-white/20 hover:text-white/60 transition-all"
                        title="Exit interview"
                    >
                        <XCircle size={22} />
                    </button>
                </div>
            </div>

            {/* Main interview layout */}
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 lg:px-6 lg:pt-6 min-h-0 max-w-7xl mx-auto">

                {/* ── Left / Top: Amanda panel ── */}
                <div
                    className={`flex flex-col items-center justify-center gap-4 p-6 lg:p-8
                        lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-6rem)] self-start
                        ${phase === 'intro' ? 'min-h-[40vh]' : ''}`}
                >
                    <AvatarAmanda
                        size={phase === 'intro' ? 'lg' : 'md'}
                        isSpeaking={isSpeaking}
                        isThinking={isLoading && phase === 'evaluating'}
                    />

                    {/* Round indicator dots */}
                    <div className="flex gap-2 mt-2">
                        {Array.from({ length: totalRounds }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    i < currentRound
                                        ? 'w-4 bg-indigo-400'
                                        : i === currentRound
                                        ? 'w-6 bg-white'
                                        : 'w-3 bg-white/15'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Round label mobile */}
                    <div className="sm:hidden text-white/40 text-[10px] uppercase tracking-widest font-bold">
                        {ROUND_LABELS[currentRound] ?? `Round ${currentRound + 1}`} · {currentRound + 1}/{totalRounds}
                    </div>
                </div>

                {/* ── Right: Content panel ── */}
                <div className="flex-1 px-5 pb-10 lg:px-0 min-w-0">

                    {/* ─── INTRO PHASE ─── */}
                    {phase === 'intro' && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 text-center animate-in fade-in duration-700">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-3">
                                    Welcome to Your {company} Interview
                                </h2>
                                <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
                                    {isSpeaking
                                        ? "Amanda is speaking..."
                                        : `Hi! I'm Amanda. We'll go through ${totalRounds} rounds today. When you're ready, click below to begin.`
                                    }
                                </p>
                            </div>

                            {/* Intro question preview */}
                            <div
                                className={`${glassPanelClass} text-left max-w-lg w-full`}
                                style={glassPanelStyle}
                            >
                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">First Question</div>
                                <p className="text-white font-semibold text-base leading-relaxed">
                                    {currentQuestion || 'Loading...'}
                                </p>
                            </div>

                            <button
                                onClick={handleStartInterview}
                                disabled={isLoading || isSpeaking}
                                className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-100 disabled:opacity-50 transition-all active:scale-95 shadow-2xl"
                            >
                                {isLoading
                                    ? <><Loader2 size={18} className="animate-spin" /> Loading...</>
                                    : <><ChevronRight size={18} /> Begin Interview</>
                                }
                            </button>
                        </div>
                    )}

                    {/* ─── QUESTION PHASE ─── */}
                    {phase === 'question' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Question card */}
                            <div className={glassPanelClass} style={glassPanelStyle}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                        Q{qIdx + 1} of {allQuestions.length || '?'}
                                        {' · '}
                                        {ROUND_LABELS[currentRound]}
                                    </div>
                                    {/* Progress dots */}
                                    <div className="flex gap-1.5">
                                        {allQuestions.map((_, n) => (
                                            <div
                                                key={n}
                                                className={`h-1 rounded-full transition-all ${
                                                    n === qIdx ? 'w-4 bg-white' : n < qIdx ? 'w-3 bg-white/40' : 'w-3 bg-white/10'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-white text-lg lg:text-xl font-semibold leading-relaxed">
                                    {currentQuestion}
                                </p>
                                <button
                                    onClick={() => speakText(currentQuestion)}
                                    className="mt-3 text-white/30 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5"
                                >
                                    🔊 Read aloud
                                </button>
                            </div>

                            {/* Answer input (Speech-Only & Neat, with clean manual toggle) */}
                            <div className="flex flex-col items-center justify-center py-8 gap-6">
                                {/* Large Pulsing Circular Mic Button */}
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (isListening) {
                                                stopListening();
                                            } else {
                                                startListening();
                                            }
                                        }}
                                        className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-2 transition-all border ${
                                            isListening
                                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse scale-105 shadow-[0_0_35px_rgba(239,68,68,0.25)]'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                                    </button>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                        {isListening ? 'Tap to Stop' : 'Tap to Speak'}
                                    </span>
                                </div>

                                {/* Dynamic Speech Diagnostics Error Message */}
                                {speechError && (
                                    <div className="flex flex-col items-center gap-2 max-w-md text-center">
                                        <div className="text-red-400 text-xs font-semibold animate-pulse bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-full leading-normal">
                                            {speechError === 'network' 
                                                ? 'Speech Service Connection Error: The browser failed to connect to Google\'s transcription servers. Please verify your internet connection.' 
                                                : `Mic Connection Error: ${speechError}`
                                            }
                                        </div>
                                    </div>
                                )}

                                {isListening && (
                                    <div className="flex justify-center py-2 animate-in fade-in duration-300">
                                        <SpeechWave />
                                    </div>
                                )}

                                {/* Neat transcription preview */}
                                {answer.trim() && (
                                    <div 
                                        className="w-full max-w-xl p-5 rounded-2xl border border-white/5 text-white/70 text-sm leading-relaxed italic text-center animate-in fade-in duration-500"
                                        style={{ background: 'rgba(255,255,255,0.01)' }}
                                    >
                                        "{answer}"
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={!answer.trim() || isListening}
                                    className={`w-full max-w-xs flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        answer.trim() && !isListening
                                            ? 'bg-white text-black hover:bg-gray-100 shadow-lg active:scale-95'
                                            : 'bg-white/8 text-white/25 cursor-not-allowed'
                                    }`}
                                >
                                    Submit Answer <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ─── EVALUATING PHASE ─── */}
                    {phase === 'evaluating' && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-in fade-in duration-500">
                            <AvatarAmanda size="sm" isThinking={true} />
                            <p className="text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">
                                Amanda is evaluating your answer...
                            </p>
                        </div>
                    )}

                    {/* ─── EVALUATION RESULT ─── */}
                    {phase === 'evaluation' && (
                        <EvaluationCard
                            evaluation={evaluations[evaluations.length - 1]}
                            onNext={handleNextQuestion}
                            isLast={currentRound >= totalRounds - 1 && qIdx >= allQuestions.length - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSession;
