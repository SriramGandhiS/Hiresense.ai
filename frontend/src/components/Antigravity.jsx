// Antigravity Component
import React, { useEffect, useState } from 'react';

const Antigravity = ({ children, speed = 3 }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setOffset(o => (o + 2) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) rotateZ(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotateZ(360deg); opacity: 0; }
        }
        .antigravity-item { animation: float-up linear infinite; position: absolute; }
      `}</style>
      <div className="antigravity-item" style={{
        animation: `float-up ${speed}s linear infinite`,
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        {children}
      </div>
    </div>
  );
};

export default Antigravity;
