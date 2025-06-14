
import { GameState, CaseRecord, Achievement, GameStats } from '../../types/gameTypes';
import { Language, t } from '../../utils/i18n';

export class ProgressManager {
  private static achievements: Achievement[] = [
    {
      id: 'first_case',
      name: 'First Case Solved',
      description: 'Solve your first case',
      isUnlocked: false
    },
    {
      id: 'perfect_case',
      name: 'Perfect Detective',
      description: 'Solve a case with 3 stars',
      isUnlocked: false
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon', 
      description: 'Solve a case in under 5 minutes',
      isUnlocked: false
    },
    {
      id: 'hard_mode',
      name: 'Hard Mode Master',
      description: 'Solve a hard difficulty case',
      isUnlocked: false
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Solve 5 cases in a row correctly',
      isUnlocked: false
    }
  ];

  static calculateStars(completionTime: number, interrogationCount: number, wrongGuesses: number, difficulty: string): number {
    let stars = 3;
    
    // 根据难度调整时间标准
    const timeThresholds = {
      easy: { good: 300, fair: 600 }, // 5分钟, 10分钟
      normal: { good: 480, fair: 900 }, // 8分钟, 15分钟
      hard: { good: 600, fair: 1200 } // 10分钟, 20分钟
    };
    
    const threshold = timeThresholds[difficulty as keyof typeof timeThresholds] || timeThresholds.normal;
    
    // 时间扣分
    if (completionTime > threshold.fair) stars--;
    else if (completionTime > threshold.good) stars = Math.max(stars - 0.5, 1);
    
    // 审问次数扣分（过多审问）
    if (interrogationCount > 6) stars--;
    else if (interrogationCount > 4) stars = Math.max(stars - 0.5, 1);
    
    // 错误推理扣分
    stars -= wrongGuesses * 0.5;
    
    return Math.max(Math.round(stars), 1);
  }

  static recordCaseCompletion(
    gameState: GameState,
    completionTime: number,
    interrogationCount: number,
    wrongGuesses: number,
    isCorrect: boolean
  ): { record: CaseRecord; newAchievements: Achievement[] } {
    const stars = isCorrect ? this.calculateStars(completionTime, interrogationCount, wrongGuesses, gameState.difficulty.level) : 0;
    
    const record: CaseRecord = {
      caseId: gameState.caseId,
      difficulty: gameState.difficulty.level,
      completedAt: new Date().toISOString(),
      completionTime,
      interrogationCount,
      wrongGuesses,
      stars,
      isCorrect
    };

    // 检查并解锁成就
    const newAchievements = this.checkAchievements(gameState, record);
    
    return { record, newAchievements };
  }

  private static checkAchievements(gameState: GameState, newRecord: CaseRecord): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    const currentAchievements = gameState.gameProgress.achievements;
    
    // 首次破案
    if (newRecord.isCorrect && !currentAchievements.find(a => a.id === 'first_case')?.isUnlocked) {
      const achievement = this.achievements.find(a => a.id === 'first_case')!;
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlockedAchievements.push(achievement);
    }
    
    // 完美破案（3星）
    if (newRecord.stars === 3 && !currentAchievements.find(a => a.id === 'perfect_case')?.isUnlocked) {
      const achievement = this.achievements.find(a => a.id === 'perfect_case')!;
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlockedAchievements.push(achievement);
    }
    
    // 速度破案（5分钟内）
    if (newRecord.completionTime < 300 && newRecord.isCorrect && !currentAchievements.find(a => a.id === 'speed_demon')?.isUnlocked) {
      const achievement = this.achievements.find(a => a.id === 'speed_demon')!;
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlockedAchievements.push(achievement);
    }
    
    // 困难模式破案
    if (newRecord.difficulty === 'hard' && newRecord.isCorrect && !currentAchievements.find(a => a.id === 'hard_mode')?.isUnlocked) {
      const achievement = this.achievements.find(a => a.id === 'hard_mode')!;
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlockedAchievements.push(achievement);
    }
    
    return unlockedAchievements;
  }

  static calculateStats(records: CaseRecord[]): GameStats {
    const solved = records.filter(r => r.isCorrect);
    const totalTime = solved.reduce((sum, r) => sum + r.completionTime, 0);
    
    const difficultyStats = {
      easy: { played: 0, solved: 0, bestTime: Infinity },
      normal: { played: 0, solved: 0, bestTime: Infinity },
      hard: { played: 0, solved: 0, bestTime: Infinity }
    };
    
    records.forEach(record => {
      const diff = record.difficulty as keyof typeof difficultyStats;
      if (difficultyStats[diff]) {
        difficultyStats[diff].played++;
        if (record.isCorrect) {
          difficultyStats[diff].solved++;
          difficultyStats[diff].bestTime = Math.min(difficultyStats[diff].bestTime, record.completionTime);
        }
      }
    });
    
    // 处理无限值
    Object.keys(difficultyStats).forEach(key => {
      const diff = difficultyStats[key as keyof typeof difficultyStats];
      if (diff.bestTime === Infinity) diff.bestTime = 0;
    });

    return {
      totalCasesPlayed: records.length,
      totalCasesSolved: solved.length,
      averageCompletionTime: solved.length > 0 ? Math.round(totalTime / solved.length) : 0,
      bestCompletionTime: solved.length > 0 ? Math.min(...solved.map(r => r.completionTime)) : 0,
      totalStars: records.reduce((sum, r) => sum + r.stars, 0),
      achievementsUnlocked: 0, // 这个会在外部更新
      difficultyStats
    };
  }

  static formatStats(stats: GameStats, language: Language): string {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (language === 'zh') {
      return `
=== 游戏统计 ===
总游戏局数: ${stats.totalCasesPlayed}
成功破案数: ${stats.totalCasesSolved}
成功率: ${stats.totalCasesPlayed > 0 ? Math.round((stats.totalCasesSolved / stats.totalCasesPlayed) * 100) : 0}%
平均完成时间: ${formatTime(stats.averageCompletionTime)}
最佳完成时间: ${formatTime(stats.bestCompletionTime)}
总获得星数: ${stats.totalStars}
解锁成就数: ${stats.achievementsUnlocked}

=== 各难度统计 ===
简单: ${stats.difficultyStats.easy.solved}/${stats.difficultyStats.easy.played} (最佳: ${formatTime(stats.difficultyStats.easy.bestTime)})
普通: ${stats.difficultyStats.normal.solved}/${stats.difficultyStats.normal.played} (最佳: ${formatTime(stats.difficultyStats.normal.bestTime)})
困难: ${stats.difficultyStats.hard.solved}/${stats.difficultyStats.hard.played} (最佳: ${formatTime(stats.difficultyStats.hard.bestTime)})
`;
    } else {
      return `
=== Game Statistics ===
Total Games Played: ${stats.totalCasesPlayed}
Cases Solved: ${stats.totalCasesSolved}
Success Rate: ${stats.totalCasesPlayed > 0 ? Math.round((stats.totalCasesSolved / stats.totalCasesPlayed) * 100) : 0}%
Average Completion Time: ${formatTime(stats.averageCompletionTime)}
Best Completion Time: ${formatTime(stats.bestCompletionTime)}
Total Stars Earned: ${stats.totalStars}
Achievements Unlocked: ${stats.achievementsUnlocked}

=== Difficulty Statistics ===
Easy: ${stats.difficultyStats.easy.solved}/${stats.difficultyStats.easy.played} (Best: ${formatTime(stats.difficultyStats.easy.bestTime)})
Normal: ${stats.difficultyStats.normal.solved}/${stats.difficultyStats.normal.played} (Best: ${formatTime(stats.difficultyStats.normal.bestTime)})
Hard: ${stats.difficultyStats.hard.solved}/${stats.difficultyStats.hard.played} (Best: ${formatTime(stats.difficultyStats.hard.bestTime)})
`;
    }
  }
}
