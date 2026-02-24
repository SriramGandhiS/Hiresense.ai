import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ElectricButton from '../reactbits/ElectricButton';

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-48 px-6 bg-white overflow-hidden relative">
            {/* Background Decorative Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-brand-primary/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-brand-primary/10 rounded-full pointer-events-none animate-pulse"></div>

            <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <span className="text-brand-primary font-black uppercase tracking-[0.5em] text-[12px] mb-8 block">Total Deployment Available</span>
                    <h2 className="text-5xl md:text-8xl font-serif text-text-dark italic leading-[0.9] mb-12">
                        Synthesize your <br />
                        <span className="text-brand-primary not-italic font-normal underline decoration-brand-primary/20 underline-offset-[12px]">Legacy today.</span>
                    </h2>
                    <p className="text-xl text-text-gray/80 font-serif italic max-w-xl mx-auto leading-relaxed mb-16">
                        The impact on your professional trajectory is permanent. Initialize your protocol in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                        <ElectricButton
                            onClick={() => navigate('/login')}
                        >
                            Open Access Portal
                        </ElectricButton>
                        <button className="w-full sm:w-auto px-12 py-6 border-b-2 border-text-dark/10 text-text-dark font-black text-[10px] uppercase tracking-[0.4em] hover:border-brand-primary transition-all duration-700">
                            Request Private Demo
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
