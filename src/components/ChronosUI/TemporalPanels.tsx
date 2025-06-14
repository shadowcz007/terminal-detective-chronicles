
import React from 'react';

interface TemporalPanelsProps {
  children: React.ReactNode;
  timeSpeed?: 'past' | 'present' | 'future';
}

const TemporalPanels: React.FC<TemporalPanelsProps> = ({ children, timeSpeed = 'present' }) => {
  const getTimeSpeedClass = () => {
    switch (timeSpeed) {
      case 'past':
        return 'temporal-past pixel-flicker';
      case 'future':
        return 'temporal-future pre-render';
      default:
        return 'temporal-present';
    }
  };

  return (
    <div className={`temporal-panel ${getTimeSpeedClass()}`}>
      {children}
    </div>
  );
};

export default TemporalPanels;
