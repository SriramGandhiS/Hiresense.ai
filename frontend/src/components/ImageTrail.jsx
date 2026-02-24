// ImageTrail Component
import React, { useState, useEffect } from 'react';

const ImageTrail = ({ imageUrl, children }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handle = (e) => {
      setTrail(t => [...t.slice(-15), {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      }]);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div style={{ cursor: 'none' }}>
      {trail.map((p, i) => (
        <img
          key={p.id}
          src={imageUrl}
          style={{
            position: 'fixed',
            left: p.x - 15,
            top: p.y - 15,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            pointer: 'none',
            zIndex: 9998,
            opacity: (i + 1) / trail.length,
            pointerEvents: 'none'
          }}
        />
      ))}
      {children}
    </div>
  );
};

export default ImageTrail;
