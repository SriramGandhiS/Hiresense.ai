// TiltedCard Component
import React, { useState } from 'react';

const TiltedCard = ({ children }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(100,200,255,0.1))',
        borderRadius: '12px',
        border: '1px solid rgba(0,255,255,0.2)'
      }}
    >
      {children}
    </div>
  );
};

export default TiltedCard;
