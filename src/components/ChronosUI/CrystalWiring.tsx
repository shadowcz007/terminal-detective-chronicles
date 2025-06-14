
import React from 'react';

const CrystalWiring: React.FC = () => {
  return (
    <div className="crystal-wiring">
      <div className="wiring-layer">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`crystal-wire wire-${i + 1}`}>
            <div className="energy-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          </div>
        ))}
      </div>
      <div className="dyson-battery">
        <div className="battery-core">
          <div className="energy-rings">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalWiring;
