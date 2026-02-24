import { motion } from 'framer-motion';
import { FileSearch, Target, Users, Zap } from 'lucide-react';
import TiltedCard from '../reactbits/TiltedCard';

const services = [
    {
        title: "Resume Intel",
        desc: "High-fidelity optimization for global industry standards.",
        icon: <FileSearch className="w-8 h-8" />,
        color: "bg-indigo-50"
    },
    {
        title: "Job Strategy",
        desc: "Precision research to align your profile with target roles.",
        icon: <Target className="w-8 h-8" />,
        color: "bg-emerald-50"
    },
    {
        title: "Mock Practice",
        desc: "AI-driven simulation to refine your interview performance.",
        icon: <Users className="w-8 h-8" />,
        color: "bg-amber-50"
    },
    {
        title: "Analytics",
        desc: "Track your trajectory with predictive growth metrics.",
        icon: <Zap className="w-8 h-8" />,
        color: "bg-rose-50"
    }
];

const ServicesSection = () => {
    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <div className="max-w-2xl space-y-6">
                        <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[11px]">Protocols</span>
                        <h2 className="text-5xl md:text-7xl font-serif text-text-primary dark:text-text-primary italic leading-[0.9]">
                            Our <br />
                            <span className="text-brand-primary not-italic">Capabilities.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, idx) => (
                        <TiltedCard key={idx} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className="premium-card group p-10 h-full border-border-neutral/50 hover:border-brand-primary/30 transition-all duration-500 cursor-pointer"
                            >
                                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                                    <div className="text-brand-primary">
                                        {service.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-text-dark mb-4 italic group-hover:text-brand-primary transition-colors">{service.title}</h3>
                                <p className="text-text-gray font-medium text-sm leading-relaxed mb-6">
                                    {service.desc}
                                </p>
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-primary hover:gap-3 transition-all">
                                    Initialize <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                                </div>
                            </motion.div>
                        </TiltedCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
