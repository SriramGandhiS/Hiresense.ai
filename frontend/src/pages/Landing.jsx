import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineWaves from '../components/reactbits/LineWaves';

const Landing = () => {
  useEffect(() => {
    // Force clean dark background on body
    document.body.style.background = '#060606';
    document.body.style.color = '#fff';
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060606] text-white select-none font-sans">
      
      {/* Background LineWaves Component - z-index -10 to ensure it is always behind text */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <LineWaves
          speed={0.25}
          innerLineCount={38}
          outerLineCount={42}
          warpIntensity={1.0}
          rotation={-35}
          edgeFadeWidth={0.0}
          colorCycleSpeed={0.5}
          brightness={0.3}
          color1="#ffffff"
          color2="#a3a3a3"
          color3="#d4d4d4"
          enableMouseInteraction={true}
          mouseInfluence={1.8}
        />
      </div>

      {/* Elegant Header Logo */}
      <header className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-white/90">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
          hiresense<span className="text-neutral-400">.ai</span>
        </div>
      </header>

      {/* Main Center Hero Box - pointer-events-none on wrapper so mouse moves hit the canvas */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-6 pointer-events-none">
        <div className="max-w-4xl flex flex-col items-center space-y-8 pointer-events-auto">
          
          {/* Top Pill Badge matching "NEW Just shipped v2.0" styling */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-black px-2.5 py-0.5 rounded-full">
              NEW
            </span>
            <span className="text-[11px] font-medium text-neutral-400 tracking-wide pr-1">
              Introducing HireSense 2.0
            </span>
          </div>

          {/* Heading matching the bold sans-serif design exactly */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-3xl">
            Ace your next tech interview.
          </h1>

          {/* Side-by-Side Actions */}
          <div className="flex flex-row items-center gap-4 pt-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 active:scale-95 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
            >
              Get started
            </Link>
            
            <Link 
              to="/resume" 
              className="px-6 py-3.5 bg-neutral-800/80 border border-neutral-700/60 text-white font-semibold text-sm rounded-xl hover:bg-neutral-700 hover:border-neutral-600 active:scale-95 transition-all duration-200 backdrop-blur-md"
            >
              Resume Analysis
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Footer Telemetry */}
      <footer className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-center text-[10px] text-neutral-500 font-medium uppercase tracking-widest pointer-events-none">
        <span>© 2026 Hiresense AI</span>
        <span>Secure Sandboxed Environment</span>
      </footer>

    </div>
  );
};

export default Landing;
