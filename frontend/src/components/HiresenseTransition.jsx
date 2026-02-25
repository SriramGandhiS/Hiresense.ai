import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const HiresenseTransition = ({ onComplete }) => {
    const [phase, setPhase] = useState('init'); // init, scanning, analyzing, reveal
    const [logs, setLogs] = useState([]);
    const canvasRef = useRef(null);

    const logMessages = [
        "AUTH_TOKEN_SUCCESSFUL",
        "CONNECTING_TO_HIRESENSE_CORES...",
        "FETCHING_CAREER_DNA_PATTERNS...",
        "ANALYZING_CANDIDATE_VECTORS...",
        "NEURAL_MATCHING_ENGINE_ACTIVE",
        "SYSTEM_SYNC_COMPLETE"
    ];

    useEffect(() => {
        setPhase('scanning');
        let i = 0;
        const interval = setInterval(() => {
            if (i < logMessages.length) {
                setLogs(prev => [...prev.slice(-3), logMessages[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => setPhase('reveal'), 1000);
            }
        }, 600);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (phase === 'reveal') {
            const tl = gsap.timeline();
            tl.to(".node-net", { opacity: 0, scale: 2, duration: 1.5, ease: "slow(0.7, 0.7, false)" });
            tl.to(".logo-reveal", { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }, 0.5);
            tl.to(".blackout", { opacity: 1, duration: 1, delay: 1, onComplete });
        }
    }, [phase, onComplete]);

    // Canvas Neural Net (High Performance)
    useEffect(() => {
        if (phase === 'init') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        }));

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(124, 111, 255, 0.15)';
            ctx.fillStyle = 'rgba(124, 111, 255, 0.4)';

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.lineWidth = 1 - dist / 150;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            raf = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(raf);
    }, [phase]);

    return (
        <div className="fixed inset-0 z-[99999] bg-black text-white font-mono select-none overflow-hidden">

            {/* BACKGROUND NEURAL NET */}
            <canvas ref={canvasRef} className="node-net absolute inset-0 transition-all duration-1000" />

            {/* SCANNING OVERLAY */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/50 shadow-[0_0_20px_#7c6fff] opacity-20"
                    style={{ animation: 'scanner 4s infinite linear' }} />
            </div>

            {/* INTERFACE LOGS */}
            <div className="absolute bottom-12 left-12 z-20 space-y-2">
                <AnimatePresence>
                    {logs.map((msg, idx) => (
                        <motion.p
                            key={msg + idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] font-black tracking-[0.4em] text-indigo-400 uppercase"
                        >
                            {`> ${msg}`}
                        </motion.p>
                    ))}
                </AnimatePresence>
            </div>

            {/* CENTER REVEAL */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    className="logo-reveal opacity-0 scale-75 text-center"
                >
                    <div className="w-24 h-24 mb-6 mx-auto relative">
                        {/* Hiresense "H" Symbolic Construct */}
                        <div className="absolute inset-0 border-r-2 border-l-2 border-white/80" />
                        <div className="absolute inset-[40%_0] border-t-2 border-white/80" />
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-[-20px] bg-indigo-500/10 blur-xl rounded-full"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-[0.6em] uppercase text-white">
                        HIRESENSE
                    </h1>
                    <p className="mt-4 text-[10px] tracking-[1em] font-black uppercase text-indigo-400/60">
                        INTELLIGENCE_DEPLOYED
                    </p>
                </motion.div>
            </div>

            {/* FINAL BLACKOUT */}
            <div className="blackout fixed inset-0 bg-black opacity-0 z-[100000] pointer-events-none" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanner {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
            `}} />
        </div>
    );
};

export default HiresenseTransition;
