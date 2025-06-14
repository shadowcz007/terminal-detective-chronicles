
import React from 'react';

interface GlitchOverlayProps {
  intensity?: 'low' | 'medium' | 'high';
  active?: boolean;
}

const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ intensity = 'low', active = true }) => {
  if (!active) return null;

  return (
    <div className={`glitch-overlay glitch-${intensity}`}>
      <div className="crack-pattern" />
      <div className="hologram-border" />
      <div className="quantum-interference">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="interference-line" style={{ top: `${20 * i}%` }} />
        ))}
      </div>
    </div>
  );
};

export default GlitchOverlay;
