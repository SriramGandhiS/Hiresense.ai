// LaserFlow Component
import React from 'react';

const LaserFlow = ({ children, direction = 'ltr' }) => {
  return (
    <div >
      <style>{`
        @keyframes laser-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .laser-flow {
          background: linear-gradient(90deg, transparent, #00ff00, transparent);
          background-size: 200% 100%;
          animation: laser-flow 3s ease-in-out infinite;
          position: relative;
        }
      `}</style>
      <div className="laser-flow">
        {children}
      </div>
    </div>
  );
};

export default LaserFlow;
