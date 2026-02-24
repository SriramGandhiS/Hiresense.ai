// ScrollStack Component
import React, { useState, useEffect } from 'react';

const ScrollStack = ({ items = [] }) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const handle = () => {
      setScrollIndex(idx => (idx + 1) % items.length);
    };
    window.addEventListener('wheel', handle);
    return () => window.removeEventListener('wheel', handle);
  }, [items.length]);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes stack-scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .scroll-item { height: 100vh; display: flex; align-items: center; justify-content: center; }
      `}</style>
      {items.map((item, i) => (
        <div
          key={i}
          className="scroll-item"
          style={{
            transform: `translateY(${(i - scrollIndex) * 100}%)`,
            transition: 'transform 0.6s ease-out'
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default ScrollStack;
