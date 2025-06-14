
import { useState, useEffect } from 'react';

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

export interface ApiConfig {
  url: string;
  key: string;
  model: string;
}

export interface GameState {
  caseId: string;
  caseDescription: string;
  victim: string;
  suspects: Suspect[];
  evidence: Evidence[];
  solution: string;
  apiConfig: ApiConfig;
  currentInterrogation?: string;
}

const DEFAULT_CONFIG: ApiConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  key: '',
  model: 'gpt-3.5-turbo'
};

// 从本地存储加载配置
const loadApiConfig = (): ApiConfig => {
  try {
    const saved = localStorage.getItem('ai-detective-config');
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
  }
  return DEFAULT_CONFIG;
};

// 保存配置到本地存储
const saveApiConfig = (config: ApiConfig) => {
  try {
    localStorage.setItem('ai-detective-config', JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    caseId: '',
    caseDescription: '',
    victim: '',
    suspects: [],
    evidence: [],
    solution: '',
    apiConfig: loadApiConfig(),
    currentInterrogation: undefined
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      // 如果更新了API配置，保存到本地存储
      if (updates.apiConfig) {
        saveApiConfig(newState.apiConfig);
      }
      return newState;
    });
  };

  const updateApiConfig = (config: Partial<ApiConfig>) => {
    const newConfig = { ...gameState.apiConfig, ...config };
    updateGameState({ apiConfig: newConfig });
    saveApiConfig(newConfig);
  };

  return { gameState, updateGameState, updateApiConfig };
};
