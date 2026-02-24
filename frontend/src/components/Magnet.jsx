// Magnet Component
import React, { useState } from 'react';

const Magnet = ({ children, strength = 20 }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOver, setIsOver] = useState(false);

  const handleMouseMove = (e) => {
    if (!isOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    setOffset({
      x: (x / centerX) * strength,
      y: (y / centerY) * strength
    });
  };

  return (
    <div onMouseEnter={() => setIsOver(true)} onMouseLeave={() => { setIsOver(false); setOffset({ x: 0, y: 0 }); }} onMouseMove={handleMouseMove}>
      <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.1s ease-out' }}>
        {children}
      </div>
    </div>
  );
};

export default Magnet;
