// CircularGallery Component
import React, { useState } from 'react';

const CircularGallery = ({ images = [], radius = 200 }) => {
  const [rotation, setRotation] = useState(0);

  const rotate = (direction) => {
    setRotation(r => r + (direction === 'next' ? 360 / images.length : -360 / images.length));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      <style>{`
        .circular-gallery { position: relative; width: 400px; height: 400px; perspective: 1000px; }
        .gallery-container { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; }
        .gallery-item { position: absolute; width: 100px; height: 100px; border-radius: 50%; overflow: hidden; }
      `}</style>
      <div className="circular-gallery">
        <div className="gallery-container" style={{ transform: `rotateZ(${rotation}deg)`, transition: 'transform 0.6s ease' }}>
          {images.map((img, i) => {
            const angle = (360 / images.length) * i;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <img
                key={i}
                src={img}
                className="gallery-item"
                style={{
                  left: `calc(50% + ${x}px - 50px)`,
                  top: `calc(50% + ${y}px - 50px)`,
                  transform: `rotateZ(${-rotation}deg)`
                }}
              />
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => rotate('prev')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Prev</button>
        <button onClick={() => rotate('next')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Next</button>
      </div>
    </div>
  );
};

export default CircularGallery;
