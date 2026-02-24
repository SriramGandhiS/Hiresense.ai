// LightPillar Component
import React from 'react';

const LightPillar = ({ children }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .light-pillar {
          position: absolute;
          top: 0;
          left: 50%;
          width: 200px;
          height: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.8), transparent);
          transform: translateX(-50%);
          filter: blur(40px);
          animation: pillar-glow 4s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes pillar-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="light-pillar" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default LightPillar;
