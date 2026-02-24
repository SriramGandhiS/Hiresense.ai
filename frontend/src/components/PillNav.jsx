// PillNav Component
import React, { useState } from 'react';

const PillNav = ({ items = [] }) => {
  const [active, setActive] = useState(0);

  return (
    <nav>
      <style>{`
        .pill-nav {
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.5);
          padding: 6px;
          border-radius: 50px;
          width: fit-content;
        }
        .pill-item {
          padding: 8px 20px;
          border-radius: 50px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }
        .pill-item.active {
          background: linear-gradient(135deg, #0ff, #00ff88);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        .pill-item:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <div className="pill-nav">
        {items.map((item, i) => (
          <button
            key={i}
            className={`pill-item ${active === i ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default PillNav;
