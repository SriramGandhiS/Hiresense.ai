// LetterGlitch Admin Login Component
import React, { useState, useEffect } from 'react';

const LetterGlitch = ({ text = 'ADMIN' }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setGlitch(true), 3000);
    setTimeout(() => setGlitch(false), 200);
    return () => clearInterval(interval);
  }, [glitch]);

  const chars = text.split('');

  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`
        @keyframes glitch-x {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        .glitch-letter {
          display: inline-block;
          font-size: 48px;
          font-weight: bold;
          color: #0ff;
          text-shadow: -2px 0 #ff006e, 2px 0 #00d4ff;
          animation: ${glitch ? 'glitch-x 0.2s' : 'none'};
        }
      `}</style>
      {chars.map((char, i) => (
        <span key={i} className="glitch-letter" style={{ animationDelay: `${i * 0.05}s` }}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default LetterGlitch;
