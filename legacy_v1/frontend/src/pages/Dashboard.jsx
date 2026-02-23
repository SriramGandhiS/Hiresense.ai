import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import { FileSearch, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
    const [data, setData] = useState({
        resumeScore: 85, technicalScore: 78, communicationScore: 82, integrityScore: 100,
        overallReadiness: 83, weakAreas: ['System Design', 'Speech Clarity'],
        roadmap: [
            'Review basic System Design principles and architecture documentation.',
            'Practice mock interviews focusing on speech pace and clarity.',
            'Advance into specific backend patterns.',
            'Complete 3 comprehensive mock evaluation stages.'
        ]
    });
    const [loading, setLoading] = useState(true);

    const headerRef = useRef(null);
    const scoreCardsRef = useRef([]);
    const chartsRef = useRef([]);

    useEffect(() => {
        api.get('/interviews/my-scores')
            .then(res => { if (res.data && Object.keys(res.data).length > 0) setData(res.data); })
            .catch(() => console.log("Using mock data"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading) return;

        gsap.fromTo(headerRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );

        scoreCardsRef.current.forEach((card, index) => {
            gsap.fromTo(card,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none reverse' }, delay: index * 0.1 }
            );
        });

        chartsRef.current.forEach((section, index) => {
            gsap.fromTo(section,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 90%' } }
            );
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, [loading]);

    const addToScoreCards = (el) => { if (el && !scoreCardsRef.current.includes(el)) scoreCardsRef.current.push(el); };
    const addToCharts = (el) => { if (el && !chartsRef.current.includes(el)) chartsRef.current.push(el); };

    const radarData = {
        labels: ['Resume', 'Technical', 'Communcation', 'Integrity'],
        datasets: [{
            label: 'Evaluation Metrics',
            data: [data.resumeScore, data.technicalScore, data.communicationScore, data.integrityScore],
            backgroundColor: 'rgba(99, 102, 241, 0.15)', /* Purple Tint */
            borderColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                pointLabels: { color: '#64748b', font: { size: 12, family: 'Inter', weight: 600 } },
                ticks: { display: false, max: 100, min: 0 }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#fff', titleColor: '#1e293b', bodyColor: '#64748b', borderColor: '#e2e8f0', borderWidth: 1, padding: 12, boxPadding: 6 }
        },
        maintainAspectRatio: false
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#64748b] font-medium text-sm">Synchronizing workspace...</div>;

    const icons = [<FileSearch className="text-[#6366f1]" size={24} />, <Activity className="text-[#6366f1]" size={24} />, <Activity className="text-[#6366f1]" size={24} />, <ShieldCheck className="text-[#6366f1]" size={24} />];

    return (
        <div className="space-y-8 pb-20">
            <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Overview Dashboard</h1>
                    <p className="text-[#64748b] mt-2 font-medium">Your universal career readiness metrics and insights.</p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center space-x-5">
                    <div className="text-right">
                        <p className="text-[11px] text-[#94a3b8] uppercase tracking-widest font-bold">Overall Index</p>
                        <p className="text-4xl font-black text-[#6366f1] leading-none mt-1">{data.overallReadiness}<span className="text-xl text-[#94a3b8] font-bold">%</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Resume ATS', score: data.resumeScore },
                    { label: 'Technical Score', score: data.technicalScore },
                    { label: 'Communication', score: data.communicationScore },
                    { label: 'Integrity Rating', score: data.integrityScore },
                ].map((item, i) => (
                    <div key={i} ref={addToScoreCards} className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center">{icons[i]}</div>
                            <p className="text-3xl font-bold text-[#1e293b]">{item.score}</p>
                        </div>
                        <h3 className="text-[#64748b] text-sm font-bold uppercase tracking-wide">{item.label}</h3>

                        <div className="mt-5 h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#818cf8] to-[#6366f1] rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div ref={addToCharts} className="lg:col-span-1 bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm min-h-[400px] flex flex-col relative">
                    <h2 className="text-lg font-bold text-[#0f172a] mb-8">Performance Radar</h2>
                    <div className="flex-1 w-full"><Radar data={radarData} options={radarOptions} /></div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div ref={addToCharts} className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-5">Areas for Improvement</h2>
                        <div className="flex flex-wrap gap-2.5">
                            {data.weakAreas.map((area, i) => (
                                <span key={i} className="px-4 py-2 bg-[#fff1f2] text-[#e11d48] border border-[#ffe4e6] rounded-xl text-sm font-bold">
                                    {area}
                                </span>
                            ))}
                            {data.weakAreas.length === 0 && <span className="text-[#64748b] font-medium text-sm">Metrics are optimal. No weak areas detected.</span>}
                        </div>
                    </div>

                    <div ref={addToCharts} className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-8">Personalized Action Plan</h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[2px] before:bg-[#f1f5f9]">
                            {data.roadmap.map((step, i) => (
                                <div key={i} className="relative flex items-start gap-5">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-[#6366f1] text-[#6366f1] shrink-0 relative z-10 shadow-[0_0_0_4px_white]">
                                        <CheckCircle2 size={14} strokeWidth={3} className="text-[#6366f1]" />
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="text-[#475569] font-medium text-sm leading-relaxed">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
