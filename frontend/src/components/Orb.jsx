// Orb Mock Test Background
import React from 'react';

const Orb = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0f0f1e', overflow: 'hidden' }}>
      <style>{`
        .orb-container { position: fixed; width: 100%; height: 100%; z-index: 0; }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: orb-float 12s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -50px) scale(1.2); }
        }
      `}</style>
      <div className="orb-container">
        <div
          className="floating-orb"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #ff006e, transparent)',
            top: '10%',
            left: '10%',
            animationDelay: '0s'
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, #00d4ff, transparent)',
            top: '40%',
            right: '5%',
            animationDelay: '2s'
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, #7c3aed, transparent)',
            bottom: '10%',
            left: '30%',
            animationDelay: '4s'
          }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Orb;
