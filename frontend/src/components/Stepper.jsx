// Stepper Component (Landing Page)
import React, { useState } from 'react';

const Stepper = ({ steps = [] }) => {
  const [active, setActive] = useState(0);

  return (
    <div style={{ padding: '40px' }}>
      <style>{`
        .stepper-container {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }
        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }
        .stepper-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          z-index: 2;
          transition: all 0.3s ease;
          border: 2px solid rgba(0, 255, 255, 0.3);
          color: white;
        }
        .stepper-circle.active {
          background: linear-gradient(135deg, #0ff, #00ff88);
          border-color: #0ff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        .stepper-circle.completed {
          background: rgba(0, 255, 255, 0.2);
          border-color: #0ff;
        }
        .stepper-line {
          position: absolute;
          top: 25px;
          left: 60px;
          height: 2px;
          flex: 1;
          background: rgba(0, 255, 255, 0.2);
          z-index: 1;
        }
        .stepper-label { margin-top: 10px; color: white; font-size: 14px; }
      `}</style>
      <div className="stepper-container">
        {steps.map((step, i) => (
          <div key={i} className="stepper-step" style={{ flex: 1 }}>
            {i > 0 && <div className="stepper-line" />}
            <div
              className={`stepper-circle ${i === active ? 'active' : i < active ? 'completed' : ''}`}
              onClick={() => setActive(i)}
              style={{ cursor: 'pointer' }}
            >
              {i < active ? '✓' : i + 1}
            </div>
            <div className="stepper-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
