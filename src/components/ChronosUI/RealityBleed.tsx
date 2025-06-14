
import React, { useEffect, useState } from 'react';

const RealityBleed: React.FC = () => {
  const [weatherEffect, setWeatherEffect] = useState<'rain' | 'clear' | 'storm' | 'night'>('clear');

  useEffect(() => {
    // Simulate weather detection based on time
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      setWeatherEffect('night');
    } else if (Math.random() > 0.7) {
      setWeatherEffect('rain');
    } else if (Math.random() > 0.8) {
      setWeatherEffect('storm');
    } else {
      setWeatherEffect('clear');
    }
  }, []);

  return (
    <div className={`reality-bleed ${weatherEffect}`}>
      {weatherEffect === 'rain' && (
        <div className="liquid-letters">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }} />
          ))}
        </div>
      )}
      {weatherEffect === 'storm' && (
        <div className="code-storm">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="lightning-code" style={{ left: `${Math.random() * 100}%` }}>
              {Math.random().toString(36).substring(7)}
            </div>
          ))}
        </div>
      )}
      {weatherEffect === 'clear' && (
        <div className="light-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
          ))}
        </div>
      )}
      {weatherEffect === 'night' && (
        <div className="dark-energy">
          <div className="energy-pulse" />
        </div>
      )}
    </div>
  );
};

export default RealityBleed;
