// LogoLoop Component
import React from 'react';

const LogoLoop = ({ logos = [], speed = 20 }) => {
  return (
    <div style={{ overflow: 'hidden', backgroundColor: '#f0f0f0', padding: '20px 0' }}>
      <style>{`
        @keyframes scroll-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .logo-loop-container {
          display: flex;
          animation: scroll-loop ${speed}s linear infinite;
          gap: 40px;
          width: fit-content;
        }
      `}</style>
      <div className="logo-loop-container">
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} style={{ minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logo} alt="logo" style={{ maxHeight: '60px', maxWidth: '150px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
