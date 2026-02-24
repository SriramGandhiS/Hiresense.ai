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
        <div className="max-w-5xl mx-auto space-y-12 pb-12">
            <header className="text-center space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Neural CV Synthesis
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Is your resume <span className="text-indigo-600">Placement Ready?</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                    Our AI scans 16 critical compliance vectors to ensure you bypass ATS filters and land interview callbacks.
                </p>
            </header>

            {!result ? (
                <div className="premium-card p-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
                        {loading && <div className="h-full bg-indigo-600 animate-pulse w-full"></div>}
                    </div>

                    <div className="p-10 space-y-8">
                        {error && (
                            <div className="p-4 flex items-start bg-red-50 border border-red-100 text-red-600 rounded-2xl">
                                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-wide">Signal Rejected</h3>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <div
                            className={`relative w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-50/30 scale-[1.01]' : 'border-gray-200 bg-gray-50/30 hover:bg-white hover:border-indigo-300'
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
                                accept=".pdf,.doc,.docx"
                                onChange={handleChange}
                            />

                            {!file ? (
                                <>
                                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                        <UploadCloud className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Drop Identity Document</h3>
                                    <p className="text-gray-400 mt-2 text-sm font-medium">PDF or DOCX (Max 5MB)</p>
                                    <button
                                        onClick={onButtonClick}
                                        className="mt-8 px-8 py-3 bg-white border border-gray-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        Browse Directory
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center w-full px-8">
                                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 relative">
                                        <FileText className="w-12 h-12 text-indigo-500" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                            className="absolute -top-3 -right-3 bg-white text-gray-400 border border-gray-200 rounded-full p-2 hover:text-red-500 shadow-md transition-all active:scale-90"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 truncate max-w-sm">{file.name}</h3>
                                    <div className="mt-4 px-4 py-1 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB Ready
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center text-gray-400 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500" />
                                Industrial-grade Encryption Enabled
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                                        Analyzing CV Architecture...
                                    </>
                                ) : (
                                    <>
                                        Initiate Scan
                                        <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ResumeScoreCard
                        score={result.score}
                        analysis={result.analysis}
                        summary={result.summary}
                    />
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
