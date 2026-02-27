import React, { useEffect, Suspense, useRef } from 'react';
import HeroSection from '../components/landing/HeroSection';
import { useTheme } from '../context/ThemeContext';
import Login from './Login';
import Ballpit from '../components/reactbits/Ballpit';

const Landing = () => {
    const { setTheme } = useTheme();
    const [isCinematicActive, setIsCinematicActive] = React.useState(false);
    const loginRef = useRef(null);

    const scrollToLogin = () => {
        loginRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Force Dark Mode for the Premium Cinematic Experience
    useEffect(() => {
        setTheme('dark');
    }, [setTheme]);

    return (
        <div className="bg-black text-white selection:bg-brand-primary/20 transition-colors duration-700 relative">
            {/* Background Layer: Ballpit - ABSOLUTE (Spans full 200vh across both pages) */}
            <div className="absolute top-0 left-0 w-full h-[200vh] z-0 opacity-80 pointer-events-auto">
                <div style={{ position: 'relative', overflow: 'hidden', height: '100%', width: '100%' }}>
                    <Ballpit
                        count={100}
                        gravity={0.02}
                        friction={0.9975}
                        wallBounce={0.5}
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

            {/* Main Immersive Hero - Single Section Only */}
            <Suspense fallback={<div className="h-screen bg-black relative z-10 flex items-center justify-center font-black animate-pulse text-indigo-500 tracking-[1em]">SYSTEM_BOOT...</div>}>
                <HeroSection onCinematicChange={setIsCinematicActive} onLoginClick={scrollToLogin} />
            </Suspense>

            {/* Additional Sections - Hidden during cinematic transition */}
            <div ref={loginRef} className={`transition-opacity duration-700 relative z-10 ${isCinematicActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Login />
            </div>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Landing;
