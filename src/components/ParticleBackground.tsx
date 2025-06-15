
import React from 'react';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Time rifts */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-cyan-500/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      
      {/* Data streams */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent animate-pulse" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default ParticleBackground;
