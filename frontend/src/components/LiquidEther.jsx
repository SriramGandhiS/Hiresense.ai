// LiquidEther Background Component
import React from 'react';

const LiquidEther = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        .liquid-ether {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg,
            #1a1a2e 0%,
            #0f3460 25%,
            #16213e 50%,
            #0f3460 75%,
            #1a1a2e 100%);
          background-size: 400% 400%;
          animation: liquid-flow 15s ease infinite;
          filter: blur(1px);
        }
        @keyframes liquid-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="liquid-ether" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default LiquidEther;
