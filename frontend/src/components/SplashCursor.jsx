// SplashCursor Component
import React, { useState } from 'react';

const SplashCursor = ({ children }) => {
  const [splashes, setSplashes] = useState([]);

  const handleMouseMove = (e) => {
    if (Math.random() > 0.7) {
      const splash = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setSplashes(s => [...s, splash]);
      setTimeout(() => setSplashes(s => s.filter(sp => sp.id !== splash.id)), 600);
    }
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      <style>{`
        @keyframes splash {
          0% { filter: drop-shadow(0 0 0 rgba(100, 200, 255, 0.8)); transform: scale(0); }
          100% { filter: drop-shadow(0 0 8px rgba(100, 200, 255, 0)); transform: scale(1); }
        }
        .splash { position: fixed; width: 20px; height: 20px; border: 2px solid rgba(100, 200, 255, 0.8); border-radius: 50%; pointer-events: none; z-index: 9998; animation: splash 0.6s ease-out; }
      `}</style>
      {splashes.map(s => (
        <div key={s.id} className="splash" style={{ left: s.x - 10, top: s.y - 10 }} />
      ))}
      {children}
    </div>
  );
};

export default SplashCursor;
