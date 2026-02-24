// PixelTransition Component
import React, { useState } from 'react';

const PixelTransition = ({ children, duration = 500 }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), duration);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', position: 'relative' }}>
      <style>{`
        @keyframes pixelate {
          0% { filter: blur(0px); }
          50% { filter: blur(8px) pixelate(8px); }
          100% { filter: blur(0px); }
        }
        .pixel-transition { animation: pixelate ${duration}ms ease-in-out; }
      `}</style>
      <div className={isTransitioning ? 'pixel-transition' : ''}>
        {children}
      </div>
    </div>
  );
};

export default PixelTransition;
