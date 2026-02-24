// Threads Landing Page Background
import React from 'react';

const Threads = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', background: '#0a0e27' }}>
      <style>{`
        .thread {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.3), transparent);
          z-index: 0;
        }
        .thread-h {
          width: 100%;
          height: 1px;
          animation: thread-shimmer 4s ease-in-out infinite;
        }
        .thread-v {
          width: 1px;
          height: 100%;
          animation: thread-shimmer 4s ease-in-out infinite;
        }
        @keyframes thread-shimmer {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`h${i}`} className="thread thread-h" style={{ top: `${(i + 1) * 20}%`, animationDelay: `${i * 0.5}s` }} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`v${i}`} className="thread thread-v" style={{ left: `${(i + 1) * 12}%`, animationDelay: `${i * 0.3}s` }} />
      ))}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Threads;
