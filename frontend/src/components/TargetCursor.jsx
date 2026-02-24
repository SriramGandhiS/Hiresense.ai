// TargetCursor Component
import React, { useState, useEffect } from 'react';

const TargetCursor = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div style={{ cursor: 'none' }}>
      <style>{`
        .target-cursor {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid #0ff;
          border-radius: 50%;
          z-index: 9999;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }
        .target-dot { position: absolute; width: 4px; height: 4px; background: #0ff; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
      `}</style>
      <div className="target-cursor" style={{ left: mousePos.x, top: mousePos.y }}>
        <div className="target-dot" />
      </div>
      {children}
    </div>
  );
};

export default TargetCursor;
