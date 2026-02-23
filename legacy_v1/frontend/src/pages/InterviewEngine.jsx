import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Play, Video, ShieldCheck, MessageSquare, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../services/api';

const InterviewEngine = () => {
    const [mode, setMode] = useState('AUTO');
    const [manualDomain, setManualDomain] = useState('Java');

    const [interviewState, setInterviewState] = useState('IDLE'); // IDLE | RUNNING | COMPLETED
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const [warnings, setWarnings] = useState([]);
    const [malpracticeCount, setMalpracticeCount] = useState(0);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);
    const containerRef = useRef(null);

    // Fade In
    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
    }, [interviewState]);

    useEffect(() => {
        if (interviewState === 'RUNNING') {
            const handleVisibilityChange = () => {
                if (document.hidden) logMalpractice('Tab Switch Detected');
            };
            const handleContextMenu = (e) => {
                e.preventDefault();
                logMalpractice('Right-click restricted');
            };
            const handleCopyPaste = (e) => {
                e.preventDefault();
                logMalpractice('Copy/Paste disabled');
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('copy', handleCopyPaste);
            document.addEventListener('paste', handleCopyPaste);

            startCamera();

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('copy', handleCopyPaste);
                document.removeEventListener('paste', handleCopyPaste);
                stopCamera();
            };
        }
    }, [interviewState]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
                }
                setTranscript(prev => prev + finalTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        }
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            streamRef.current = stream;
        } catch (err) {
            logMalpractice('Camera access denied');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };

    const logMalpractice = (reason) => {
        setWarnings(prev => [...prev, reason].slice(-5));
        setMalpracticeCount(c => c + 1);
        api.post('/admin/log-malpractice', { reason }).catch(() => { });
    };

    const toggleListen = () => {
        if (isListening) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
        setIsListening(!isListening);
    };

    const startInterview = async () => {
        gsap.to(containerRef.current, {
            opacity: 0, duration: 0.3, onComplete: async () => {
                try {
                    const res = await api.post('/interviews/start', { mode, domain: manualDomain });
                    setQuestions(res.data.questions);
                    setInterviewState('RUNNING');
                    setCurrentIdx(0);
                    setMalpracticeCount(0);
                    setWarnings([]);
                } catch (err) {
                    console.error(err);
                    alert('Session connection error.');
                    gsap.to(containerRef.current, { opacity: 1, duration: 0.3 });
                }
            }
        });
    };

    const submitAnswer = async () => {
        if (isListening) toggleListen();

        gsap.to('.question-block', {
            opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: async () => {
                try {
                    const res = await api.post('/interviews/answer', {
                        questionId: questions[currentIdx].id,
                        answerText: transcript,
                        questionText: questions[currentIdx].text
                    });

                    const newQuestions = [...questions];
                    newQuestions[currentIdx].answer = transcript;

                    if (res.data.followUp) newQuestions.splice(currentIdx + 1, 0, res.data.followUp);

                    setQuestions(newQuestions);
                    setTranscript('');

                    if (currentIdx + 1 < newQuestions.length) setCurrentIdx(currentIdx + 1);
                    else endInterview(newQuestions);

                    gsap.fromTo('.question-block', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                } catch (err) { console.error(err); }
            }
        });
    };

    const endInterview = async (finalQuestions) => {
        setInterviewState('COMPLETED');
        stopCamera();
        try {
            await api.post('/interviews/finish', { questions: finalQuestions, malpracticeCount });
        } catch (err) { console.error(err); }
    };

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#6366f1]/10 rounded-2xl flex items-center justify-center text-[#6366f1]"><MessageSquare size={24} strokeWidth={2} /></div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Smart Evaluation</h1>
                        <p className="text-[#64748b] font-medium text-sm mt-0.5">Automated screening and technical assessment portal.</p>
                    </div>
                </div>

                {interviewState === 'IDLE' && (
                    <div className="mt-6 md:mt-0 flex items-center bg-[#f1f5f9] p-1.5 rounded-xl border border-[#e2e8f0]">
                        <button onClick={() => setMode('AUTO')} className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${mode === 'AUTO' ? 'bg-white text-[#6366f1] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'}`}>Auto Build</button>
                        <button onClick={() => setMode('MANUAL')} className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${mode === 'MANUAL' ? 'bg-white text-[#6366f1] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'}`}>Static Role</button>
                    </div>
                )}
            </div>

            {interviewState === 'IDLE' && (
                <div className="bg-white p-10 md:p-14 rounded-3xl text-center max-w-2xl mx-auto border border-[#e2e8f0] shadow-sm">

                    {mode === 'MANUAL' && (
                        <div className="text-left mb-8">
                            <label className="block text-[#0f172a] mb-2 font-bold text-[15px]">Select Evaluation Domain</label>
                            <select value={manualDomain} onChange={(e) => setManualDomain(e.target.value)} className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium text-[15px] cursor-pointer appearance-none">
                                <option>Java</option>
                                <option>Web Development</option>
                                <option>HR Only</option>
                            </select>
                        </div>
                    )}
                    {mode === 'AUTO' && (
                        <div className="mb-8 p-6 bg-[#eef2ff] border border-[#e0e7ff] rounded-2xl text-left">
                            <p className="text-[#4f46e5] text-[15px] font-medium leading-relaxed"><strong className="text-[#4338ca] font-bold">Auto Pipeline Active:</strong> The AI will construct an individualized assessment matrix based directly on your configured Resume Builder profile attributes.</p>
                        </div>
                    )}

                    <div className="border border-[#e2e8f0] bg-[#f8fafc] py-5 px-6 rounded-2xl text-sm flex items-start space-x-4 mb-10 text-left">
                        <ShieldCheck size={24} className="shrink-0 text-[#64748b] mt-0.5" strokeWidth={2} />
                        <div>
                            <h4 className="font-bold text-[#0f172a] mb-1.5 text-[15px]">Proctor Restrictions Active</h4>
                            <p className="leading-relaxed font-medium text-[#64748b]">Visual capture enabled. Tab dislocation, right-click operations, and clipboard interactions are permanently logged on the session tensor for integrity grading.</p>
                        </div>
                    </div>

                    <button onClick={startInterview} className="primary-button w-full sm:w-auto mx-auto py-3.5 px-8 text-[15px]">
                        <Play size={18} fill="currentColor" className="mr-2" /> <span>Launch Session</span>
                    </button>
                </div>
            )}

            {interviewState === 'RUNNING' && questions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6 question-block">
                        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col h-[600px]">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[#64748b] font-bold text-xs uppercase tracking-widest">Question {currentIdx + 1} / {questions.length}</span>
                                <span className="bg-[#f1f5f9] text-[#475569] font-bold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#e2e8f0] flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></div><span>{questions[currentIdx].type}</span>
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-[#0f172a] mb-10 leading-relaxed tracking-tight">
                                {questions[currentIdx].text}
                            </h2>

                            <div className="flex-1 relative mt-auto">
                                <textarea
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    placeholder="Type your response or enable dictation..."
                                    className="w-full h-full min-h-[200px] px-6 py-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all resize-none text-[15px] font-medium leading-relaxed"
                                />
                                <div className="absolute bottom-6 right-6">
                                    <button
                                        onClick={toggleListen}
                                        className={`p-3.5 rounded-xl shadow-sm flex items-center justify-center transition-all border ${isListening ? 'bg-[#ef4444] text-white border-[#ef4444] animate-pulse' : 'bg-white text-[#64748b] border-[#e2e8f0] hover:text-[#4f46e5] hover:border-[#cbd5e1]'}`}
                                    >
                                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end items-center">
                                <button onClick={submitAnswer} disabled={!transcript.trim()} className="primary-button disabled:opacity-50 !py-3 !px-8 text-[15px]">
                                    {currentIdx === questions.length - 1 ? 'Conclude Evaluation' : 'Submit & Continue'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
                            <div className="flex justify-between items-center mb-5 text-[#475569] font-bold text-xs tracking-widest uppercase">
                                <span className="flex items-center space-x-2.5"><Video size={16} className="text-[#64748b]" /> <span>Camera Source</span></span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></div><span className="text-[#ef4444]">REC</span>
                                </div>
                            </div>
                            <div className="relative aspect-video bg-[#0f172a] rounded-2xl overflow-hidden shadow-inner">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
                            <h3 className="text-[#475569] font-bold text-xs tracking-widest uppercase flex items-center space-x-2.5 mb-5">
                                <AlertCircle size={16} className="text-[#64748b]" /> <span>Session Logs ({malpracticeCount})</span>
                            </h3>
                            <ul className="space-y-3">
                                {warnings.map((w, i) => (
                                    <li key={i} className="text-[#ef4444] font-medium text-sm bg-[#fef2f2] px-4 py-3 rounded-xl border border-[#fecaca] flex items-center space-x-3">
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{w}</span>
                                    </li>
                                ))}
                                {warnings.length === 0 && <li className="text-[#10b981] font-semibold text-sm bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3 rounded-xl flex items-center space-x-3"><CheckCircle2 size={16} /><span>Optimal session integrity.</span></li>}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {interviewState === 'COMPLETED' && (
                <div className="bg-white p-16 rounded-3xl text-center space-y-8 max-w-2xl mx-auto border border-[#e2e8f0] shadow-sm">
                    <div className="w-20 h-20 mx-auto bg-[#ecfdf5] rounded-full flex items-center justify-center border-4 border-[#a7f3d0]">
                        <CheckCircle2 size={36} className="text-[#10b981]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Evaluation Complete</h2>
                        <p className="text-[#64748b] font-medium mt-2 text-[15px]">Assessment data successfully analyzed and securely transmitted.</p>
                    </div>
                    <p className="text-[#475569] text-[15px] font-medium leading-relaxed bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">Your neural responses and sub-routine proctor logs have been submitted to the Overview Engine. Return to the workspace dashboard to review your readiness metrics.</p>
                    <div className="pt-4">
                        <button onClick={() => window.location.href = '/dashboard'} className="primary-button mx-auto !py-3.5 !px-8 text-[15px]">
                            Proceed to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewEngine;
