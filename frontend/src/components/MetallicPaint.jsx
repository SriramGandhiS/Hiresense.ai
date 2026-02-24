// MetallicPaint Component
import React from 'react';

const MetallicPaint = ({ children }) => {
  return (
    <div>
      <style>{`
        .metallic {
          background: linear-gradient(105deg, #e0e0e0 0%, #ffffff 40%, #e0e0e0 100%);
          background-size: 200% 100%;
          animation: metallic-shine 3s ease-in-out infinite;
        }
        @keyframes metallic-shine {
          0% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="metallic" style={{ padding: '20px', borderRadius: '8px' }}>
        {children}
      </div>
    </div>
  );
};

export default MetallicPaint;
