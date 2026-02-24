// GlassIcons Component
import React from 'react';

const GlassIcons = ({ icon = '✦', size = 40 }) => {
  return (
    <div>
      <style>{`
        .glass-icon {
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: ${size * 0.6}px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .glass-icon:hover {
          background: rgba(0, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.5);
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(0, 255, 255, 0.2);
        }
      `}</style>
      <div className="glass-icon">
        {icon}
      </div>
    </div>
  );
};

export default GlassIcons;
