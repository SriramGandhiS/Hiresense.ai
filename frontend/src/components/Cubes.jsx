// Cubes Component
import React from 'react';

const Cubes = ({ count = 12, size = 80 }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '40px' }}>
      <style>{`
        @keyframes cube-rotate {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        .cube { width: ${size}px; height: ${size}px; perspective: 1000px; }
        .cube-inner { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: cube-rotate 20s infinite linear; }
        .cube-face { position: absolute; width: 100%; height: 100%; background: rgba(0, 255, 255, 0.3); border: 1px solid #0ff; display: flex; align-items: center; justify-content: center; }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cube">
          <div className="cube-inner">
            <div className="cube-face" style={{ transform: 'translateZ(40px)' }}>F</div>
            <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>B</div>
            <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(40px)' }}>R</div>
            <div className="cube-face" style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}>L</div>
            <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(40px)' }}>T</div>
            <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}>Bo</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cubes;
