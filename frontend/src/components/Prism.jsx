// Prism Component
import React from 'react';

const Prism = ({ children }) => {
  return (
    <div>
      <style>{`
        .prism {
          background: linear-gradient(135deg,
            #ff0080 0%,
            #ff8c00 25%,
            #40e0d0 50%,
            #ff0080 75%,
            #ff8c00 100%);
          background-size: 300% 300%;
          animation: prism-shift 8s ease infinite;
          padding: 2px;
          border-radius: 8px;
        }
        .prism-inner {
          background: white;
          padding: 20px;
          border-radius: 6px;
        }
        @keyframes prism-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="prism">
        <div className="prism-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Prism;
