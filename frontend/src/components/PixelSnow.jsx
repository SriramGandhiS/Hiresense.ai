// PixelSnow Background Component (Google/Admin Login)
import React, { useState, useEffect } from 'react';

const PixelSnow = ({ children }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowflakes(s => [...s.slice(-50), {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 4
      }]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #001, #033)' }}>
      <style>{`
        @keyframes snow-fall {
          to { transform: translateY(100vh); }
        }
        .snowflake {
          position: fixed;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.7;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
      {snowflakes.map(sf => (
        <div
          key={sf.id}
          className="snowflake"
          style={{
            left: `${sf.left}%`,
            animation: `snow-fall ${sf.duration}s linear`,
            animationDelay: `${sf.delay}s`,
            animationFillMode: 'forwards'
          }}
        />
      ))}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default PixelSnow;
