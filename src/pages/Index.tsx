
import React from 'react';
import Terminal from '../components/Terminal';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="crt-effect min-h-screen">
        <Terminal />
      </div>
    </div>
  );
};

export default Index;
