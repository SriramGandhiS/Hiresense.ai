// GhostCursor Component
import React, { useState, useEffect } from 'react';

const GhostCursor = ({ children, trailLength = 10 }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handle = (e) => {
      setTrail(t => [...t.slice(-trailLength + 1), { x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [trailLength]);

  return (
    <div style={{ cursor: 'none' }}>
      <style>{`
        .ghost-dot { position: fixed; width: 8px; height: 8px; border-radius: 50%; background: rgba(0, 255, 255, 0.5); z-index: 9999; pointer-events: none; }
      `}</style>
      {trail.map((p, i) => (
        <div
          key={i}
          className="ghost-dot"
          style={{
            left: p.x - 4,
            top: p.y - 4,
            opacity: (i + 1) / trail.length
          }}
        />
      ))}
      {children}
    </div>
  );
};

export default GhostCursor;
