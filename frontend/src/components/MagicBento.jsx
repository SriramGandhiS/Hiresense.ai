// MagicBento Component
import React from 'react';

const MagicBento = ({ items = [] }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '20px'
    }}>
      <style>{`
        .bento-item {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(100, 200, 255, 0.1));
          border: 1px solid rgba(0, 255, 255, 0.2);
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .bento-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.5);
        }
      `}</style>
      {items.map((item, i) => (
        <div key={i} className="bento-item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default MagicBento;
