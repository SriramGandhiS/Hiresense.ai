import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';
import ResumeScoreCard from '../components/ResumeScoreCard';

const ResumeIntelligence = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const inputRef = useRef(null);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;
        setMousePos({ x, y });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (selectedFile) => {
        setError('');
        setResult(null);

        if (!selectedFile) return false;

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setError('Invalid format. Please upload a PDF or DOCX file.');
            return false;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File too large. Maximum size is 5MB.');
            return false;
        }

        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const removeFile = () => {
        setFile(null);
        setError('');
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(response.data.data);
            setFile(null);
            if (inputRef.current) inputRef.current.value = '';
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Analysis failed: ${err.response.data.message}`);
            } else {
                setError('A server error occurred during analysis. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen max-w-7xl mx-auto px-4 py-10 space-y-10 overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Parallax Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 mesh-bg">
                {/* Large Background Blobs */}
                <div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-blob"
                    style={{ transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)` }}
                />
                <div
                    className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-rose-500/10 rounded-full blur-[100px] animate-blob"
                    style={{ transform: `translate(${mousePos.x * 0.9}px, ${mousePos.y * 0.9}px)`, animationDelay: '-2s' }}
                />
                <div
                    className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[80px] animate-blob"
                    style={{ transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)`, animationDelay: '-5s' }}
                />

                {/* Interactive Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`
                    }}
                />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-500/20 rounded-full animate-float blur-[1px]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `translate(${mousePos.x * (0.2 + i * 0.2)}px, ${mousePos.y * (0.2 + i * 0.2)}px)`,
                            animationDelay: `${i * -1.5}s`
                        }}
                    />
                ))}

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <header
                className="text-center space-y-4 relative z-10"
                style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
            >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-indigo-100 text-indigo-600 text-sm font-black tracking-wide uppercase shadow-sm">
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    AI-Powered Analysis
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                    Is your resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">good enough?</span>
                </h1>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
                    A free and fast AI resume checker doing 16 crucial checks to ensure your resume is ready to perform and get you interview callbacks.
                </p>
            </header>

            {!result ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600/10">
                        {loading && <div className="h-full bg-indigo-600 animate-progress origin-left"></div>}
                    </div>

                    {error && (
                        <div className="mb-8 p-4 flex items-start bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                            <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-sm">Upload Rejected</h3>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <div
                        className={`relative w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-inner'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleChange}
                        />

                        {!file ? (
                            <>
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300">
                                    <UploadCloud className="w-10 h-10 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 text-center">Drop your resume here</h3>
                                <p className="text-slate-500 mt-2 text-center font-medium">PDF & DOCX only. Max 5MB file size.</p>
                                <button
                                    onClick={onButtonClick}
                                    className="mt-10 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
                                >
                                    Browse Your Files
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center w-full px-8 animate-in zoom-in-95 duration-300">
                                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 relative group">
                                    <FileText className="w-12 h-12 text-indigo-500" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                        className="absolute -top-3 -right-3 bg-white text-slate-400 border border-slate-200 rounded-full p-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-md active:scale-90"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 text-center truncate max-w-sm">{file.name}</h3>
                                <div className="inline-flex items-center px-4 py-1.5 mt-4 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-black text-indigo-600">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center text-slate-400 text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                            Privacy guaranteed & GDPR compliant
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                                    AI is checking...
                                </>
                            ) : (
                                <>
                                    Check My Resume
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <ResumeScoreCard
                    score={result.score}
                    analysis={result.analysis}
                    summary={result.summary}
                />
            )}

            <footer className="pt-10 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-sm font-medium">
                    Inspired by professional tools like FlowCV and Enhancv
                </p>
            </footer>
        </div>
    );
};

export default ResumeIntelligence;
