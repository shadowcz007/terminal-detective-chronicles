
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/i18n';

const AnimatedTerminal = () => {
  const { language } = useLanguage();
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    '> new_case',
    '🔍 Generating new case...',
    '📋 Case: The Vanishing Scientist',
    '> interrogate suspect_1',
    '💬 Dr. Chen: "I was in the lab all night..."',
    '> analyze evidence',
    '🧪 DNA traces found on the door handle',
    '> submit suspect_1',
    '🎯 Case solved! The truth revealed.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < terminalLines.length) {
        if (currentChar < terminalLines[currentLine].length) {
          setCurrentChar(prev => prev + 1);
        } else {
          setTimeout(() => {
            setCurrentLine(prev => prev + 1);
            setCurrentChar(0);
          }, 1000);
        }
      } else {
        // Reset animation
        setTimeout(() => {
          setCurrentLine(0);
          setCurrentChar(0);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [currentLine, currentChar, terminalLines.length]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 font-mono text-sm">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="ml-4 text-cyan-400">CHRONOS Terminal</span>
      </div>
      
      <div className="space-y-2 min-h-[200px]">
        {terminalLines.slice(0, currentLine + 1).map((line, index) => (
          <div key={index} className="text-green-400">
            {index === currentLine 
              ? line.slice(0, currentChar) + (showCursor ? '█' : '')
              : line
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedTerminal;
