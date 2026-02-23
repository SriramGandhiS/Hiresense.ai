import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FileText, Download, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, GraduationCap, Award, Code, UploadCloud } from 'lucide-react';
import api from '../services/api';

// OUTSIDE OF THE COMPONENT to fix the React typing un-focus bug
const InputLabel = ({ children }) => <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase tracking-wide">{children}</label>;
const InputText = (props) => <input className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium text-[15px]" {...props} />;
const InputArea = (props) => <textarea className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium text-[15px] resize-none" {...props} />;

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: 'Jane Doe', email: 'jane@example.com', phone: '+1 234 567 8900', targetRole: 'Software Engineer',
        education: 'B.S. Computer Science\nUniversity of Technology, 2024\nGPA: 3.8',
        skills: 'JavaScript, React, Node.js, Python, SQL, Git, AWS',
        projects: 'E-commerce Platform\n- Built full-stack app with React and Node\n- Integrated Stripe API for payments\n\nTask Manager\n- Developed RESTful API using Express and MongoDB',
        experience: 'Frontend Intern @ Tech Corp\n- Optimized page load times by 20%\n- Collaborated with UX team to redesign dashboard',
        certifications: 'AWS Certified Cloud Practitioner\nMeta Front-End Developer Professional Certificate'
    });
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const resultsRef = useRef(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Soft animated step transitions
    const animateNextStep = (newStep) => {
        gsap.to(formRef.current, {
            x: -20, opacity: 0, duration: 0.2, ease: 'power2.in',
            onComplete: () => {
                setStep(newStep);
                gsap.fromTo(formRef.current,
                    { x: 20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    };

    const animatePrevStep = (newStep) => {
        gsap.to(formRef.current, {
            x: 20, opacity: 0, duration: 0.2, ease: 'power2.in',
            onComplete: () => {
                setStep(newStep);
                gsap.fromTo(formRef.current,
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    };

    const nextStep = () => animateNextStep(step + 1);
    const prevStep = () => animatePrevStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        gsap.to(formRef.current, { opacity: 0.5, pointerEvents: 'none', duration: 0.2 });

        try {
            const res = await api.post('/resumes/analyze', formData);
            setScoreData(res.data);

            setTimeout(() => {
                gsap.fromTo(resultsRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
            }, 100);
        } catch (err) {
            console.error(err);
            alert('Analysis Error. Please check your network connection.');
            gsap.to(formRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.2 });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
    }, []);

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto pb-20">

            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm mb-8 no-print">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#6366f1]/10 rounded-2xl flex items-center justify-center text-[#6366f1]"><FileText size={24} strokeWidth={2} /></div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Resume Builder</h1>
                        <p className="text-[#64748b] font-medium text-sm mt-0.5">Generate and ATS-optimize your career documentation.</p>
                    </div>
                </div>

                <div className="mt-6 md:mt-0 flex flex-col items-end">
                    <span className="text-[#6366f1] font-bold text-xs uppercase tracking-widest mb-2">Step {step} of 4</span>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-2 w-10 rounded-full transition-all duration-300 ${step >= i ? 'bg-[#6366f1]' : 'bg-[#e2e8f0]'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            {!scoreData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div ref={formRef} className="bg-white p-8 md:p-10 rounded-3xl border border-[#e2e8f0] shadow-sm min-h-[600px] flex flex-col justify-between">

                        <div>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-[#0f172a] mb-2">Personal Information</h2>
                                    <p className="text-[#64748b] text-[15px] font-medium mb-8">Basic contact information for the document header.</p>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div><InputLabel>Full Name</InputLabel><InputText name="fullName" value={formData.fullName} onChange={handleChange} placeholder="First Last" /></div>
                                        <div><InputLabel>Target Job Title</InputLabel>
                                            <div className="relative">
                                                <select name="targetRole" value={formData.targetRole} onChange={handleChange} className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all font-medium text-[15px] cursor-pointer appearance-none">
                                                    <option>Software Engineer</option>
                                                    <option>Web Developer</option>
                                                    <option>Data Scientist</option>
                                                    <option>Product Manager</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#64748b]"><ChevronRight size={16} className="rotate-90" /></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><InputLabel>Email Address</InputLabel><InputText name="email" value={formData.email} onChange={handleChange} placeholder="name@domain.com" /></div>
                                            <div><InputLabel>Phone Number</InputLabel><InputText name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" /></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-[#0f172a] mb-2">Work Experience & Projects</h2>
                                    <p className="text-[#64748b] text-[15px] font-medium mb-8">Detail your professional history and notable works.</p>

                                    <div className="space-y-6">
                                        <div><InputLabel>Professional Experience</InputLabel><InputArea name="experience" value={formData.experience} onChange={handleChange} rows="6" placeholder="Company Name | Role | Dates&#10;- Bullet points of achievements..." /></div>
                                        <div><InputLabel>Key Projects</InputLabel><InputArea name="projects" value={formData.projects} onChange={handleChange} rows="5" placeholder="Project Name | Tech Stack&#10;- Description of the project..." /></div>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-[#0f172a] mb-2">Education & Skills</h2>
                                    <p className="text-[#64748b] text-[15px] font-medium mb-8">Academic background and technical proficiencies.</p>

                                    <div className="space-y-6">
                                        <div><InputLabel>Education History</InputLabel><InputArea name="education" value={formData.education} onChange={handleChange} rows="3" placeholder="Degree, University, Graduation Year" /></div>
                                        <div><InputLabel>Technical Skills (Comma separated)</InputLabel><InputArea name="skills" value={formData.skills} onChange={handleChange} rows="3" placeholder="React, Node.js, Python..." /></div>
                                        <div><InputLabel>Certifications (Optional)</InputLabel><InputArea name="certifications" value={formData.certifications} onChange={handleChange} rows="2" placeholder="AWS Certified, etc." /></div>
                                    </div>
                                </div>
                            )}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-[#0f172a] mb-2">Final Review</h2>
                                    <p className="text-[#64748b] text-[15px] font-medium mb-8">Verify the generated document preview before ATS Analysis.</p>

                                    <div className="bg-[#eef2ff] border border-[#c7d2fe] p-6 rounded-2xl flex items-start space-x-4">
                                        <UploadCloud className="text-[#6366f1] shrink-0 mt-1" size={24} />
                                        <div>
                                            <h3 className="font-bold text-[#0f172a] text-lg">Ready for Processing</h3>
                                            <p className="text-[#475569] text-[15px] mt-2 leading-relaxed">The AI Engine will scan this compiled document against standard modern ATS tracking filters specifically for the role of <strong className="text-[#6366f1]">{formData.targetRole}</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#f1f5f9]">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="secondary-button transition-colors flex items-center shadow-sm"><ChevronLeft size={18} strokeWidth={2.5} className="mr-2" />Back</button>
                            ) : <div></div>}

                            {step < 4 ? (
                                <button type="button" onClick={nextStep} className="primary-button flex items-center">Proceed<ChevronRight size={18} strokeWidth={2.5} className="ml-2" /></button>
                            ) : (
                                <button type="button" onClick={handleSubmit} disabled={loading} className="primary-button disabled:opacity-60 transition-colors flex items-center shadow-md">
                                    {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-3"></div> : <CheckCircle2 size={18} strokeWidth={2.5} className="mr-2" />} {loading ? 'Analyzing Profile...' : 'Execute Analysis'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Live Professional Resume Preview Panel */}
                    <div className="hidden lg:block bg-white p-10 rounded-3xl border border-[#e2e8f0] shadow-sm text-[#0f172a] h-[600px] overflow-y-auto print-container">
                        <div className="border-b-2 border-[#1e293b] pb-5 mb-5">
                            <h2 className="text-3xl font-serif font-black text-[#0f172a] uppercase tracking-widest leading-none">{formData.fullName || 'Name Surname'}</h2>
                            <p className="text-[#64748b] font-bold text-sm mt-2 uppercase tracking-widest">{formData.targetRole || 'Target Job Title'}</p>
                            <div className="flex space-x-4 text-xs text-[#64748b] mt-3 font-semibold">
                                <span>{formData.email || 'email@example.com'}</span>
                                <span>•</span>
                                <span>{formData.phone || '+1 (234) 567-890'}</span>
                            </div>
                        </div>

                        <div className="space-y-5 text-[14px] text-[#334155]">
                            {formData.experience && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#0f172a] border-b border-[#e2e8f0] pb-1.5 mb-2.5">Experience</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.experience}</p>
                                </div>
                            )}
                            {formData.projects && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#0f172a] border-b border-[#e2e8f0] pb-1.5 mb-2.5">Projects</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.projects}</p>
                                </div>
                            )}
                            {formData.skills && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#0f172a] border-b border-[#e2e8f0] pb-1.5 mb-2.5">Skills</h3>
                                    <p className="leading-relaxed font-medium">{formData.skills}</p>
                                </div>
                            )}
                            {formData.education && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#0f172a] border-b border-[#e2e8f0] pb-1.5 mb-2.5">Education</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.education}</p>
                                </div>
                            )}
                            {formData.certifications && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#0f172a] border-b border-[#e2e8f0] pb-1.5 mb-2.5">Certifications</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.certifications}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div ref={resultsRef} className="space-y-8 min-h-screen">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                        <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-center text-center items-center">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-[#64748b] mb-4">ATS Evaluation Score</h3>
                            <div className="w-40 h-40 rounded-full border-8 bg-white flex flex-col justify-center items-center shadow-inner relative z-10" style={{ borderColor: scoreData.score > 70 ? '#6366f1' : '#f59e0b' }}>
                                <span className="text-6xl font-black text-[#0f172a] tracking-tighter">{scoreData.score}</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-[#0f172a] mb-5">Keyword Analysis</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {scoreData.missingKeywords?.length > 0 ? (
                                    <>
                                        <p className="text-[15px] font-medium text-[#64748b] w-full mb-3">Add these keywords based on standard industry profiles for <strong className="text-[#0f172a]">{formData.targetRole}</strong>:</p>
                                        {scoreData.missingKeywords.map((kw, i) => (
                                            <span key={i} className="px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] rounded-xl text-sm font-bold capitalize shadow-sm">{kw}</span>
                                        ))}
                                    </>
                                ) : <span className="text-[#10b981] font-bold text-[15px] flex items-center bg-[#ecfdf5] p-4 rounded-xl border border-[#a7f3d0]"><CheckCircle2 className="mr-2" /> Excellent keyword optimization. Target metrics fully saturated.</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center no-print">
                        <button onClick={() => setScoreData(null)} className="secondary-button"><ChevronLeft size={16} className="mr-2" strokeWidth={2.5} /> Edit Document</button>
                        <button onClick={handlePrint} className="primary-button">
                            <Download size={18} strokeWidth={2.5} className="mr-2" /> Download Document as PDF
                        </button>
                    </div>

                    {/* The Full Size Printable Resume Area */}
                    <div className="w-full max-w-4xl mx-auto bg-white text-black p-12 md:p-[1in] shadow-xl border border-[#e2e8f0] rounded-sm print-container print-only-layout min-h-[1056px]">
                        <div className="border-b-2 border-slate-900 pb-6 mb-6">
                            <h1 className="text-4xl font-serif font-black text-slate-900 uppercase tracking-widest">{formData.fullName || 'Name Surname'}</h1>
                            <p className="text-slate-600 font-bold text-lg mt-1.5 uppercase tracking-widest">{formData.targetRole || 'Target Job Title'}</p>
                            <div className="flex space-x-6 text-sm text-slate-500 mt-2 font-semibold">
                                <span>{formData.email || 'email@example.com'}</span>
                                <span>•</span>
                                <span>{formData.phone || '+1 (234) 567-890'}</span>
                            </div>
                        </div>

                        <div className="space-y-6 text-[15px] text-slate-800">
                            {formData.experience && (
                                <div>
                                    <h3 className="text-[15px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center"><Briefcase size={18} className="mr-2.5 text-slate-500" /> Experience</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.experience}</p>
                                </div>
                            )}
                            {formData.projects && (
                                <div>
                                    <h3 className="text-[15px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center"><Code size={18} className="mr-2.5 text-slate-500" /> Projects</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.projects}</p>
                                </div>
                            )}
                            {formData.skills && (
                                <div>
                                    <h3 className="text-[15px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center"><Award size={18} className="mr-2.5 text-slate-500" /> Skills</h3>
                                    <p className="leading-relaxed font-medium">{formData.skills}</p>
                                </div>
                            )}
                            {formData.education && (
                                <div>
                                    <h3 className="text-[15px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center"><GraduationCap size={18} className="mr-2.5 text-slate-500" /> Education</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.education}</p>
                                </div>
                            )}
                            {formData.certifications && (
                                <div>
                                    <h3 className="text-[15px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center"><Award size={18} className="mr-2.5 text-slate-500" /> Certifications</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed">{formData.certifications}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    @page { margin: 0; size: letter; }
                    body { background: white !important; }
                    body * { visibility: hidden; }
                    .print-container, .print-container * { visibility: visible; }
                    .print-container { 
                        position: absolute; left: 0; top: 0; width: 100%; border: none !important; 
                        box-shadow: none !important; border-radius: 0 !important; margin: 0;
                        padding: 1in !important;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default ResumeBuilder;
