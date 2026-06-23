import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';
import ResumeScoreCard from '../components/ResumeScoreCard';

const ResumeIntelligence = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

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

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
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

    const [loadingStep, setLoadingStep] = useState(0);
    const analysisSteps = ["Scanning Document...", "Vectorizing Context...", "Running AI Audit...", "Finalizing Score..."];

    useEffect(() => {
        let interval;
        if (loading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % analysisSteps.length);
            }, 2000);
        } else {
            setLoadingStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

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
        <div className="p-10 lg:p-14 max-w-5xl mx-auto space-y-12 pb-12">
            <header className="text-center space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Neural CV Synthesis
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Is your resume <span className="text-indigo-400">Placement Ready?</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                    Our AI scans 16 critical compliance vectors to ensure you bypass ATS filters and land interview callbacks.
                </p>
            </header>

            {!result ? (
                <div className="space-y-12">
                    {error && (
                        <div className="p-6 flex items-center space-x-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl backdrop-blur-md animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    <div
                        className={`relative w-full h-96 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${dragActive ? 'border-white bg-white/10 scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20'
                            } backdrop-blur-xl group cursor-pointer shadow-2xl`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={onButtonClick}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                        />

                        {!file ? (
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                                    <UploadCloud className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white">Drop Identity Document</h3>
                                <p className="text-gray-400 text-lg font-medium opacity-60">PDF or DOCX (Max 5MB)</p>
                                <div className="px-8 py-3 bg-white text-black rounded-full text-sm font-black uppercase tracking-widest shadow-xl group-hover:bg-gray-200 transition-colors inline-block">
                                    Browse Directory
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full px-8 text-center space-y-6">
                                <div className="w-28 h-28 bg-white/10 rounded-[2.5rem] flex items-center justify-center relative group/file">
                                    <FileText className="w-14 h-14 text-white" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                        className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2.5 hover:bg-rose-500 hover:text-white shadow-2xl transition-all active:scale-90"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-black text-white truncate max-w-sm">{file.name}</h3>
                                <div className="px-6 py-2 rounded-full bg-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] backdrop-blur-md">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB Ready
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="px-16 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 disabled:opacity-50 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center group relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-3">
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                    <span className="animate-pulse">{analysisSteps[loadingStep]}</span>
                                </div>
                            ) : (
                                <>
                                    Initiate Scan
                                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                        {!loading && file && (
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                                Secure Protocol Active
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {result.isResume === false ? (
                        <div className="space-y-10 text-center py-24 relative z-10">
                            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-10 backdrop-blur-md">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-6xl font-black text-white tracking-tighter">Signal Divergence.</h2>
                                <p className="text-white/40 text-2xl font-medium max-w-2xl mx-auto leading-tight">{result.summary}</p>
                            </div>
                            <button 
                                onClick={removeFile}
                                className="mt-8 px-16 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-2xl"
                            >
                                Try Another File
                            </button>
                        </div>
                    ) : (
                        <ResumeScoreCard
                            score={result.score}
                            analysis={result.analysis}
                            summary={result.summary}
                        />
                    )}
                </div>
            )}

            <footer className="text-center pt-8">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                    Hiresense.ai Core Intelligence Layer
                </p>
            </footer>
        </div>
    );
};

export default ResumeIntelligence;
