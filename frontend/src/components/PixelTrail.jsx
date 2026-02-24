// PixelTrail Component
import React, { useState, useEffect } from 'react';

const PixelTrail = ({ children }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handle = (e) => {
      setTrail(t => [...t.slice(-20), {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      }]);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div>
      <style>{`
        .pixel { position: fixed; width: 4px; height: 4px; background: #ff00ff; z-index: 9998; pointer-events: none; }
      `}</style>
      {trail.map((p, i) => (
        <div key={p.id} className="pixel" style={{
          left: p.x,
          top: p.y,
          opacity: (i + 1) / trail.length,
          transform: `scale(${(i + 1) / trail.length})`
        }} />
      ))}
      {children}
    </div>
  );
};

export default PixelTrail;
