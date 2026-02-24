// DarkVeil Background Component
import React from 'react';

const DarkVeil = ({ children, opacity = 0.7 }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <style>{`
        .dark-veil {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0,0,0,${1 - opacity}), rgba(0,0,0,1));
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
      <div className="dark-veil" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default DarkVeil;
