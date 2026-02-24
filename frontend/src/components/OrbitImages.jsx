// OrbitImages Component
import React, { useState, useEffect } from 'react';

const OrbitImages = ({ images = [], radius = 150, speed = 20 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotation(r => (r + 360 / (speed * 100)) % 360), 50);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2, margin: '50px auto' }}>
      <style>{`
        .orbit-container { perspective: 1000px; }
        ​.orbit-image { position: absolute; width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
      `}</style>
      <div className="orbit-container" style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        transformStyle: 'preserve-3d'
      }}>
        {images.map((img, i) => {
          const angle = (360 / images.length) * i + rotation;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          return (
            <img
              key={i}
              src={img}
              className="orbit-image"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrbitImages;
