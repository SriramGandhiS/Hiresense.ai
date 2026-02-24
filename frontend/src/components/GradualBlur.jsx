// GradualBlur Component
import React, { useState } from 'react';

const GradualBlur = ({ children, maxBlur = 10, duration = 1000 }) => {
  const [blur, setBlur] = useState(0);

  const handleHover = (isHover) => {
    const step = maxBlur / 20;
    let current = blur;
    const interval = setInterval(() => {
      current += isHover ? -step : step;
      if ((isHover && current <= 0) || (!isHover && current >= maxBlur)) {
        current = isHover ? 0 : maxBlur;
        clearInterval(interval);
      }
      setBlur(current);
    }, duration / 20);
  };

  return (
    <div onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
      <div style={{ filter: `blur(${blur}px)`, transition: 'filter 50ms ease' }}>
        {children}
      </div>
    </div>
  );
};

export default GradualBlur;
