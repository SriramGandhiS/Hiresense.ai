import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StorySection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, 0.4, 0.4, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    return (
        <section ref={containerRef} className="relative h-[150vh] bg-text-dark overflow-hidden flex items-center justify-center">
            {/* Background Narrative Layer */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ scale }}
            >
                <img
                    src="/src/assets/hero_cinematic_ai_1771947340341.png" // Using the city background for story
                    alt="City Grid"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-text-dark via-transparent to-text-dark"></div>
            </motion.div>

            {/* Sticky Content Layer */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none">
                <motion.div
                    style={{ opacity, y: textY }}
                    className="max-w-4xl text-center px-6"
                >
                    <span className="text-brand-primary font-black uppercase tracking-[0.5em] text-[12px] mb-10 block">System Narrative</span>
                    <h2 className="text-4xl md:text-7xl font-serif text-bg-light leading-tight italic tracking-tighter">
                        In a world of noise, <br />
                        <span className="opacity-50">data is the only truth.</span> <br />
                        <span className="text-brand-primary not-italic">Find yours.</span>
                    </h2>
                </motion.div>
            </div>
        </section>
    );
};

export default StorySection;
