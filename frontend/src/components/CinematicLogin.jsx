import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Silk from './reactbits/Silk';

const CinematicLogin = ({ onAnimationComplete, isTriggered, authReady }) => {
    const canvasRef = useRef(null);
    const [phase, setPhase] = useState(0); // 0: Idle, 1: Active, 2: Display, 3: Transition
    const [storyText, setStoryText] = useState("");
    const timelineRef = useRef(null);

    const stories = [
        "Identifying candidate fingerprint...",
        "Validating credentials...",
        "Authorized. Welcome back."
    ];

    useEffect(() => {
        if (!isTriggered) return;

        setPhase(1);
        const tl = gsap.timeline();
        timelineRef.current = tl;

        // Phase 1: Subtle zoom
        tl.to(".login-shell", { scale: 1.02, duration: 1, ease: "power2.inOut" });
        tl.call(() => setPhase(2), null, 0.5);

        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < stories.length) {
                setStoryText(stories[textIndex]);
                textIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 1200);

        return () => clearInterval(textInterval);
    }, [isTriggered]);

    // Transition only when story text reaches end AND auth is ready
    useEffect(() => {
        if (phase === 2 && authReady && storyText === stories[stories.length - 1]) {
            setPhase(3);
            setTimeout(() => {
                onAnimationComplete?.();
            }, 800);
        }
    }, [phase, authReady, storyText, onAnimationComplete]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const particleCount = 60;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 1;
                this.speedY = (Math.random() - 0.5) * 1;
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.fillStyle = `rgba(79, 70, 229, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, [phase]);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

            <AnimatePresence>
                {phase === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black pointer-events-auto"
                    >
                        {/* Silk animated background */}
                        <div className="absolute inset-0 opacity-60">
                            <Silk speed={4} scale={1} color="#1a0a3d" noiseIntensity={1.2} rotation={0} />
                        </div>

                        {/* Content over silk */}
                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-black text-white tracking-tight mb-8"
                            >
                                hiresense<span className="text-indigo-400">.ai</span>
                            </motion.div>

                            <div className="h-10">
                                <motion.p
                                    key={storyText}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="text-sm font-bold text-indigo-300 uppercase tracking-[0.3em]"
                                >
                                    {storyText}
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {phase === 3 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black z-[60]"
                />
            )}
        </div>
    );
};

export default CinematicLogin;
