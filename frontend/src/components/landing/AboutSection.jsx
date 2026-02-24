import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <section className="py-32 px-6 bg-bg-light">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Image Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    <img
                        src="/src/assets/hero_cinematic_ai_1771947340341.png" // Placeholder image for now
                        alt="Professional Excellence"
                        className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="space-y-10"
                >
                    <div className="space-y-4">
                        <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[11px]">Precision Mastery</span>
                        <h2 className="text-5xl md:text-6xl font-serif text-text-dark leading-tight italic">
                            Beyond conventional <br />
                            <span className="text-brand-primary not-italic">career guidance.</span>
                        </h2>
                    </div>

                    <div className="space-y-6 text-text-gray font-medium text-lg leading-relaxed">
                        <p>
                            Modern industry demands more than competence. It requires strategy and total readiness.
                        </p>
                        <p>
                            Hiresense.ai acts as your private intelligence protocol, ensuring you are prepared for every high-stakes interaction.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-border-neutral">
                        <div>
                            <span className="block text-3xl font-serif text-text-dark italic">98%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-gray/60">Candidate Confidence</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
