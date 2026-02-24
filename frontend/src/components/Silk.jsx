// Silk Background Component
import React from 'react';

const Silk = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <style>{`
        .silk-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg,
            #e0c3fc 0%,
            #8ec5fc 50%,
            #e0c3fc 100%);
          background-size: 300% 300%;
          animation: silk-wave 10s ease infinite;
          z-index: -1;
        }
        @keyframes silk-wave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="silk-bg" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Silk;
