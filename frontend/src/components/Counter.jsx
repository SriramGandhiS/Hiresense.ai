// Counter Component (Resume Upload)
import React, { useState, useEffect } from 'react';

const Counter = ({ target = 100, duration = 2000, label = 'Files Uploaded' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 50);
    const interval = setInterval(() => {
      setCount(c => {
        const newCount = c + increment;
        return newCount >= target ? target : newCount;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [target, duration]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <style>{`
        .counter-display {
          font-size: 64px;
          font-weight: bold;
          background: linear-gradient(135deg, #0ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
        }
        .counter-label { font-size: 18px; color: white; }
      `}</style>
      <div className="counter-display">{Math.floor(count)}</div>
      <div className="counter-label">{label}</div>
    </div>
  );
};

export default Counter;
