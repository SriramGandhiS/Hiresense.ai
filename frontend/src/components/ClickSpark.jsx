// ClickSpark Component
import React, { useState } from 'react';

const ClickSpark = ({ children }) => {
  const [sparks, setSparks] = useState([]);

  const handleClick = (e) => {
    const spark = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 5
    };
    setSparks(s => [...s, spark]);
    setTimeout(() => setSparks(s => s.filter(sp => sp.id !== spark.id)), 600);
  };

  return (
    <div onClick={handleClick}>
      <style>{`
        @keyframes spark-fly {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
        .spark { position: fixed; width: 6px; height: 6px; background: #ffff00; border-radius: 50%; pointer-events: none; animation: spark-fly 0.6s ease-out; }
      `}</style>
      {sparks.map(s => (
        <div key={s.id} className="spark" style={{
          left: s.x,
          top: s.y,
          '--tx': `${s.vx * 30}px`,
          '--ty': `${s.vy * 30}px`
        }} />
      ))}
      {children}
    </div>
  );
};

export default ClickSpark;
