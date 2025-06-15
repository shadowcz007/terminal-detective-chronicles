
import { useState, useEffect } from 'react';
import { GameState, ApiConfig, GameProgress, DifficultyLevel, CurrentCaseStats } from '../types/gameTypes';
import { DIFFICULTY_LEVELS } from '../features/difficulty/difficultyConfig';

const DEFAULT_CONFIG: ApiConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  key: '',
  model: 'gpt-3.5-turbo'
};

const DEFAULT_PROGRESS: GameProgress = {
  completedCases: [],
  achievements: [],
  stats: {
    totalCasesPlayed: 0,
    totalCasesSolved: 0,
    averageCompletionTime: 0,
    bestCompletionTime: 0,
    totalStars: 0,
    achievementsUnlocked: 0,
    difficultyStats: {
      easy: { played: 0, solved: 0, bestTime: 0 },
      normal: { played: 0, solved: 0, bestTime: 0 },
      hard: { played: 0, solved: 0, bestTime: 0 }
    }
  }
};

const DEFAULT_CASE_STATS: CurrentCaseStats = {
  startTime: null,
  interrogationCount: 0,
  wrongGuessCount: 0,
  isActive: false
};

// 从本地存储加载完整游戏状态
const loadGameState = (): GameState => {
  try {
    const savedState = localStorage.getItem('ai-detective-game-state');
    const savedConfig = localStorage.getItem('ai-detective-config');
    
    if (savedState) {
      const gameState = JSON.parse(savedState);
      
      // 确保新字段存在
      if (!gameState.difficulty) {
        gameState.difficulty = DIFFICULTY_LEVELS.normal;
      }
      if (!gameState.gameProgress) {
        gameState.gameProgress = DEFAULT_PROGRESS;
      }
      if (!gameState.currentCaseStats) {
        gameState.currentCaseStats = DEFAULT_CASE_STATS;
      }
      
      // 如果有单独保存的配置，优先使用
      if (savedConfig) {
        gameState.apiConfig = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      }
      
      console.log('💾 [useGameState] Loaded game state from localStorage:', {
        startTime: gameState.currentCaseStats.startTime,
        interrogationCount: gameState.currentCaseStats.interrogationCount,
        wrongGuessCount: gameState.currentCaseStats.wrongGuessCount,
        isActive: gameState.currentCaseStats.isActive
      });
      return gameState;
    }
    
    // 如果没有完整状态，但有配置，则创建新状态但保留配置
    const apiConfig = savedConfig ? { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) } : DEFAULT_CONFIG;
    
    console.log('🆕 [useGameState] Creating new game state');
    return {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig,
      currentInterrogation: undefined,
      difficulty: DIFFICULTY_LEVELS.normal,
      gameProgress: DEFAULT_PROGRESS,
      currentCaseStats: DEFAULT_CASE_STATS
    };
  } catch (error) {
    console.error('❌ [useGameState] Failed to load game state from localStorage:', error);
    return {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig: DEFAULT_CONFIG,
      currentInterrogation: undefined,
      difficulty: DIFFICULTY_LEVELS.normal,
      gameProgress: DEFAULT_PROGRESS,
      currentCaseStats: DEFAULT_CASE_STATS
    };
  }
};

// **关键修复：同步保存完整游戏状态到本地存储**
const saveGameState = (gameState: GameState) => {
  try {
    console.log('💾 [useGameState] Saving game state to localStorage:', {
      startTime: gameState.currentCaseStats.startTime,
      interrogationCount: gameState.currentCaseStats.interrogationCount,
      wrongGuessCount: gameState.currentCaseStats.wrongGuessCount,
      isActive: gameState.currentCaseStats.isActive
    });
    
    // 保存完整游戏状态
    localStorage.setItem('ai-detective-game-state', JSON.stringify(gameState));
    // 同时单独保存API配置，保持兼容性
    localStorage.setItem('ai-detective-config', JSON.stringify(gameState.apiConfig));
    
    // **验证保存结果**
    const verification = localStorage.getItem('ai-detective-game-state');
    const parsed = verification ? JSON.parse(verification) : null;
    console.log('✅ [useGameState] Save verification - startTime:', parsed?.currentCaseStats?.startTime);
    
    return true;
  } catch (error) {
    console.error('❌ [useGameState] Failed to save game state to localStorage:', error);
    return false;
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    console.log('🔄 [useGameState] Updating game state with:', {
      hasStartTime: updates.currentCaseStats?.startTime ? 'YES' : 'NO',
      startTime: updates.currentCaseStats?.startTime,
      updates: Object.keys(updates)
    });
    
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      console.log('📊 [useGameState] New state currentCaseStats:', {
        startTime: newState.currentCaseStats.startTime,
        interrogationCount: newState.currentCaseStats.interrogationCount,
        wrongGuessCount: newState.currentCaseStats.wrongGuessCount,
        isActive: newState.currentCaseStats.isActive
      });
      
      // **关键修复：立即同步保存状态，不使用 setTimeout**
      const saveSuccess = saveGameState(newState);
      console.log('💾 [useGameState] Immediate save result:', saveSuccess);
      
      return newState;
    });
  };

  const updateApiConfig = (config: Partial<ApiConfig>) => {
    const newConfig = { ...gameState.apiConfig, ...config };
    updateGameState({ apiConfig: newConfig });
  };

  // 清除游戏数据（保留API配置和进度）
  const clearGameData = () => {
    const clearedState = {
      caseId: '',
      caseDescription: '',
      victim: '',
      suspects: [],
      evidence: [],
      solution: '',
      apiConfig: gameState.apiConfig, // 保留API配置
      currentInterrogation: undefined,
      difficulty: gameState.difficulty, // 保留难度设置
      gameProgress: gameState.gameProgress, // 保留游戏进度
      currentCaseStats: DEFAULT_CASE_STATS // 重置统计数据
    };
    updateGameState(clearedState);
  };

  return { gameState, updateGameState, updateApiConfig, clearGameData };
};

// 重新导出类型，保持向后兼容
export type { GameState, Suspect, Evidence, ApiConfig } from '../types/gameTypes';
