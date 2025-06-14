
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/i18n';

interface ParadoxMinigameProps {
  onResolve: (success: boolean) => void;
  onClose: () => void;
}

const ParadoxMinigame: React.FC<ParadoxMinigameProps> = ({ onResolve, onClose }) => {
  const [puzzle, setPuzzle] = useState<{ question: string; options: string[]; correct: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const { language } = useLanguage();

  const puzzles = [
    {
      question: language === 'zh' ? "如果你阻止了过去的自己犯错，那么你就不会有阻止的动机。这个悖论如何解决？" : "If you prevent your past self from making a mistake, you wouldn't have the motivation to prevent it. How to resolve this paradox?",
      options: language === 'zh' ? ["创建平行时间线", "接受矛盾", "时间循环"] : ["Create parallel timeline", "Accept contradiction", "Time loop"],
      correct: 0
    },
    {
      question: language === 'zh' ? "信息从未来传回过去，但这信息的来源是什么？" : "Information travels from future to past, but what is the source of this information?",
      options: language === 'zh' ? ["因果循环", "量子纠缠", "时空折叠"] : ["Causal loop", "Quantum entanglement", "Spacetime folding"],
      correct: 0
    }
  ];

  useEffect(() => {
    setPuzzle(puzzles[Math.floor(Math.random() * puzzles.length)]);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onResolve(false);
      onClose();
    }
  }, [timeLeft, onResolve, onClose]);

  const handleAnswer = (index: number) => {
    const success = index === puzzle?.correct;
    onResolve(success);
    onClose();
  };

  if (!puzzle) return null;

  return (
    <div className="paradox-minigame">
      <div className="paradox-container">
        <div className="paradox-header">
          <h3>{t('paradoxWarning', language)}</h3>
          <div className="time-remaining">
            {t('timeRemaining', language)}: {timeLeft}s
          </div>
        </div>
        <div className="paradox-question">
          {puzzle.question}
        </div>
        <div className="paradox-options">
          {puzzle.options.map((option, index) => (
            <button
              key={index}
              className="paradox-option"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParadoxMinigame;
