
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
  // 新增的难度和进度相关字段
  difficulty: DifficultyLevel;
  gameProgress: GameProgress;
}

export interface DifficultyLevel {
  level: 'easy' | 'normal' | 'hard';
  name: string;
  description: string;
}

export interface GameProgress {
  completedCases: CaseRecord[];
  achievements: Achievement[];
  stats: GameStats;
}

export interface CaseRecord {
  caseId: string;
  difficulty: string;
  completedAt: string;
  completionTime: number; // 完成时间（秒）
  interrogationCount: number; // 审问次数
  wrongGuesses: number; // 错误推理次数
  stars: number; // 星级评价 1-3
  isCorrect: boolean; // 是否正确破案
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface GameStats {
  totalCasesPlayed: number;
  totalCasesSolved: number;
  averageCompletionTime: number;
  bestCompletionTime: number;
  totalStars: number;
  achievementsUnlocked: number;
  difficultyStats: {
    easy: { played: number; solved: number; bestTime: number };
    normal: { played: number; solved: number; bestTime: number };
    hard: { played: number; solved: number; bestTime: number };
  };
}
