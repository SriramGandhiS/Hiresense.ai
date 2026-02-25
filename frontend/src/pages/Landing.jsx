import React, { useEffect, Suspense } from 'react';
import HeroSection from '../components/landing/HeroSection';
import { useTheme } from '../context/ThemeContext';
import AboutSection from '../components/landing/AboutSection';
import ServicesSection from '../components/landing/ServicesSection';
import StorySection from '../components/landing/StorySection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FinalCTA from '../components/landing/FinalCTA';

const Landing = () => {
    const { setTheme } = useTheme();
    const [isCinematicActive, setIsCinematicActive] = React.useState(false);

    // Force Dark Mode for the Premium Cinematic Experience
    useEffect(() => {
        setTheme('dark');
    }, [setTheme]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-primary/20 transition-colors duration-700 relative overflow-x-hidden">
            {/* Main Immersive Hero - Single Section Only */}
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center font-black animate-pulse text-indigo-500 tracking-[1em]">SYSTEM_BOOT...</div>}>
                <HeroSection onCinematicChange={setIsCinematicActive} />
            </Suspense>

            {/* Additional Sections - Hidden during cinematic transition */}
            <div className={`transition-opacity duration-700 ${isCinematicActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <AboutSection />
                <ServicesSection />
                <StorySection />
                <TestimonialsSection />
                <FinalCTA />
            </div>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Landing;
