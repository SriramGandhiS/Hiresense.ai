// FlowingMenu Component
import React, { useState } from 'react';

const FlowingMenu = ({ items = [] }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <nav>
      <style>{`
        .flowing-menu { display: flex; gap: 0; position: relative; }
        .menu-item {
          padding: 15px 20px;
          cursor: pointer;
          position: relative;
          color: white;
          border: none;
          background: transparent;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .menu-item::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #0ff, transparent);
          animation: flow 2s ease-in-out infinite;
        }
        .menu-item:hover::before { animation-delay: 0s; }
        @keyframes flow {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .menu-item.active { color: #0ff; }
      `}</style>
      <div className="flowing-menu">
        {items.map((item, i) => (
          <button
            key={i}
            className={`menu-item ${hoverIndex === i ? 'active' : ''}`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default FlowingMenu;
