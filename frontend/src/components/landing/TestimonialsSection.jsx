import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Marcus Thorne",
        role: "Principal Architect, Neural Systems",
        text: "The synthesis protocol provided by Hiresense.ai is unparalleled. It didn't just find me a role; it unlocked a new stratum of career intelligence.",
        avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    {
        name: "Elena Vance",
        role: "SVP Talent Strategy",
        text: "We've seen candidates prepared via Hiresense show a 40% higher narrative alignment during the final partner reviews. It's a game changer.",
        avatar: "https://i.pravatar.cc/150?u=elena"
    },
    {
        name: "Julian Kross",
        role: "Senior Lead, Stealth Startup",
        text: "The mock interview simulation felt more rigorous than the actual session at Google. Total readiness is the only way to describe it.",
        avatar: "https://i.pravatar.cc/150?u=julian"
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-32 px-6 bg-bg-light relative overflow-hidden">
            {/* Subtle Background Decorative Text */}
            <div className="absolute top-20 left-0 w-full text-[20vw] font-serif text-text-dark/5 italic whitespace-nowrap pointer-events-none -translate-x-1/4 select-none">
                Elite Intelligence
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center space-y-6 mb-24">
                    <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[11px]">User Telemetry</span>
                    <h2 className="text-5xl md:text-7xl font-serif text-text-dark italic">
                        The <span className="text-brand-primary not-italic">Elite Consensus.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            whileHover={{ rotateY: 5, rotateX: 5, z: 50 }}
                            className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-soft relative transition-all duration-500 hover:shadow-2xl"
                            style={{ perspective: "1000px" }}
                        >
                            <p className="text-text-dark/70 font-medium text-lg leading-relaxed mb-10 italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-brand-primary/20" />
                                <div>
                                    <h4 className="text-text-dark font-serif italic text-lg">{t.name}</h4>
                                    <p className="text-text-gray text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
