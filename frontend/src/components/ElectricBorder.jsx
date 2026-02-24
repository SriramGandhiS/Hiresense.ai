// ElectricBorder Component
import React from 'react';

const ElectricBorder = ({ children, intensity = 1 }) => {
  return (
    <div className="electric-border" style={{
      border: '2px solid #0ff',
      boxShadow: `0 0 ${10 * intensity}px #0ff, inset 0 0 ${10 * intensity}px rgba(0,255,255,0.3)`,
      animation: 'electric-pulse 2s infinite',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes electric-pulse {
          0%, 100% { box-shadow: 0 0 10px #0ff, inset 0 0 10px rgba(0,255,255,0.3); }
          50% { box-shadow: 0 0 20px #0ff, inset 0 0 20px rgba(0,255,255,0.5); }
        }
      `}</style>
      {children}
    </div>
  );
};

export default ElectricBorder;
