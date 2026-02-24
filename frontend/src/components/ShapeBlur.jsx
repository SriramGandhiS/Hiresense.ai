// ShapeBlur Component
import React, { useState } from 'react';

const ShapeBlur = ({ children, shape = 'circle' }) => {
  const [blur, setBlur] = useState(5);

  return (
    <div>
      <style>{`
        .shape-blur {
          backdrop-filter: blur(${blur}px);
          border-radius: ${shape === 'circle' ? '50%' : '8px'};
          padding: 20px;
        }
      `}</style>
      <div className="shape-blur" onMouseEnter={() => setBlur(15)} onMouseLeave={() => setBlur(5)}>
        {children}
      </div>
    </div>
  );
};

export default ShapeBlur;
