import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientText from '../reactbits/GradientText';
import StarBorder from '../reactbits/StarBorder';
import ClickSpark from '../reactbits/ClickSpark';
import Ballpit from '../reactbits/Ballpit';
import ShinyText from '../reactbits/ShinyText';
const companyNames = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Stripe', 'Notion', 'Figma'];

const HeroSection = () => {
    const navigate = useNavigate();
    const [isCinematicActive, setIsCinematicActive] = useState(false);

    return (
        <ClickSpark sparkColor="#7c6fff" sparkSize={12} sparkRadius={20} sparkCount={8} duration={500} easing="ease-out" extraScale={1.2}>
            <section className="relative min-h-screen overflow-hidden bg-black flex flex-col">


                {/* Background Layer: Ballpit */}
                <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
                    <div style={{ position: 'relative', overflow: 'hidden', height: '100%', width: '100%' }}>
                        <Ballpit
                            count={75}
                            gravity={0.01}
                            friction={0.9975}
                            wallBounce={0.95}
                            followCursor={false}
                            ambientColor={0xffffff}
                            ambientIntensity={0.5}
                            lightIntensity={100}
                            minSize={0.3}
                            maxSize={0.8}
                            size0={1.2}
                            colors={[0x7c6fff, 0x5227ff, 0xff9ffc, 0xb19eef, 0xffffff]}
                        />
                    </div>
                </div>

                <style>{`@keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

                {/* ── HERO BODY ── */}
                <div className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-28 gap-0 transition-opacity duration-500 ${isCinematicActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                    {/* BIG: Hiresense with animated gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="mb-4 text-center w-full"
                    >
                        <GradientText
                            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                            animationSpeed={isCinematicActive ? 0 : 6}
                            showBorder={false}
                            yoyo={true}
                            className="text-7xl md:text-8xl font-black tracking-tight leading-none"
                        >
                            Hiresense
                        </GradientText>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-white/40 text-xs font-black uppercase tracking-[0.5em] mb-12 text-center"
                    >
                        career intelligence, redefined.
                    </motion.p>

                    {/* Auth Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1, ease: 'circOut' }}
                        className="w-full max-w-xs"
                    >
                        <StarBorder as="button" onClick={() => navigate('/login')} color="#7c6fff" speed="4s" className="w-full relative overflow-hidden group">
                            <div className="w-full text-[11px] tracking-[0.2em] font-black uppercase relative z-10 transition-transform active:scale-95 flex items-center justify-center">
                                <ShinyText text="Enter Hiresense" disabled={false} speed={3} className="text-white hover:text-[#FF9FFC] transition-colors duration-300" />
                            </div>
                        </StarBorder>
                    </motion.div>
                </div>

                {/* ── FOOTER TICKER — pinned to bottom ── */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.5 }}
                    className={`absolute bottom-0 left-0 right-0 z-10 pb-8 flex flex-col items-center gap-3 transition-opacity duration-700 ${isCinematicActive ? 'opacity-0' : 'opacity-100'}`}
                >
                    <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Trusted by professionals at</p>
                    <div className="relative overflow-hidden w-full max-w-xl" style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}>
                        <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'scroll-left 28s linear infinite', width: 'max-content' }}>
                            {[...companyNames, ...companyNames].map((name, i) => (
                                <span key={i} className="text-white/20 text-[10px] font-black uppercase tracking-[0.25em] flex-shrink-0">{name}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>
        </ClickSpark >
    );
};

export default HeroSection;
