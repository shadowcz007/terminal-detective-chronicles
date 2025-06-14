
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

// 从本地存储加载完整游戏状态
const loadGameState = (): GameState => {
  try {
    const savedState = localStorage.getItem('ai-detective-game-state');
    const savedConfig = localStorage.getItem('ai-detective-config');
    
    if (savedState) {
      const gameState = JSON.parse(savedState);
      // 如果有单独保存的配置，优先使用
      if (savedConfig) {
        gameState.apiConfig = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      }
      return gameState;
    }
    
    // 如果没有完整状态，但有配置，则创建新状态但保留配置
    const apiConfig = savedConfig ? { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) } : DEFAULT_CONFIG;
    
    return {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig,
      currentInterrogation: undefined
    };
  } catch (error) {
    console.error('Failed to load game state from localStorage:', error);
    return {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig: DEFAULT_CONFIG,
      currentInterrogation: undefined
    };
  }
};

// 保存完整游戏状态到本地存储
const saveGameState = (gameState: GameState) => {
  try {
    // 保存完整游戏状态
    localStorage.setItem('ai-detective-game-state', JSON.stringify(gameState));
    // 同时单独保存API配置，保持兼容性
    localStorage.setItem('ai-detective-config', JSON.stringify(gameState.apiConfig));
  } catch (error) {
    console.error('Failed to save game state to localStorage:', error);
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      // 保存到本地存储
      saveGameState(newState);
      return newState;
    });
  };

  const updateApiConfig = (config: Partial<ApiConfig>) => {
    const newConfig = { ...gameState.apiConfig, ...config };
    updateGameState({ apiConfig: newConfig });
  };

  // 清除游戏数据（保留API配置）
  const clearGameData = () => {
    const clearedState = {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig: gameState.apiConfig, // 保留API配置
      currentInterrogation: undefined
    };
    updateGameState(clearedState);
  };

  return { gameState, updateGameState, updateApiConfig, clearGameData };
};
