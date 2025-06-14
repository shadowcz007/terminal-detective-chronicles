
import { useState } from 'react';

export interface Suspect {
  id: string;
  name: string;
  occupation: string;
  relationship: string;
  motive: string;
  alibi: string;
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface GameState {
  caseId: string;
  caseDescription: string;
  victim: string;
  suspects: Suspect[];
  evidence: Evidence[];
  solution: string;
  apiConfig: {
    url: string;
    key: string;
    model: string;
  };
  currentInterrogation?: string;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    caseId: '',
    caseDescription: '',
    victim: '',
    suspects: [],
    evidence: [],
    solution: '',
    apiConfig: {
      url: 'https://api.openai.com/v1/chat/completions',
      key: '',
      model: 'gpt-4'
    },
    currentInterrogation: undefined
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  return { gameState, updateGameState };
};
