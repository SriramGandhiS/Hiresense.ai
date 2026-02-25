import React, { useEffect, Suspense } from 'react';
import HeroSection from '../components/landing/HeroSection';
import { useTheme } from '../context/ThemeContext';
import SplashCursor from '../components/reactbits/SplashCursor';

const Landing = () => {
    const { setTheme } = useTheme();
    const [isCinematicActive, setIsCinematicActive] = React.useState(false);

    // Force Dark Mode for the Premium Cinematic Experience
    useEffect(() => {
        setTheme('dark');
    }, [setTheme]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-primary/20 transition-colors duration-700 relative overflow-hidden">
            {/* Fluid Mouse Interaction Layer - Only show when NOT in cinematic for performance */}
            {!isCinematicActive && <SplashCursor />}

            {/* Main Immersive Hero - Single Section Only */}
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center font-black animate-pulse text-indigo-500 tracking-[1em]">SYSTEM_BOOT...</div>}>
                <HeroSection onCinematicChange={setIsCinematicActive} />
            </Suspense>



            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Landing;
