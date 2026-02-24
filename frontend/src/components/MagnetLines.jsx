// MagnetLines Component
import React, { useState } from 'react';

const MagnetLines = ({ children }) => {
  const [path, setPath] = useState([]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPath(p => [...p.slice(-10), { x, y }]);
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ position: 'relative', cursor: 'none' }}>
      <style>{`
        .magnet-line { position: absolute; width: 2px; height: 20px; background: linear-gradient(180deg, #0ff, transparent); }
      `}</style>
      {path.map((p, i) => (
        <div key={i} className="magnet-line" style={{ left: p.x, top: p.y }} />
      ))}
      {children}
    </div>
  );
};

export default MagnetLines;
