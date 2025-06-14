
import { GameState } from '../types/gameTypes';
import { ProgressManager } from '../features/progress/progressManager';
import { Language, t } from '../utils/i18n';

export const handleProgressCommands = (
  command: string,
  args: string[],
  gameState: GameState,
  updateGameState: (updates: Partial<GameState>) => void,
  language: Language
): string => {
  const cmd = command.toLowerCase();
  
  switch (cmd) {
    case 'records':
      const records = gameState.gameProgress.completedCases;
      if (records.length === 0) {
        return language === 'zh' ? '暂无通关记录' : 'No completion records found';
      }
      
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
      const formatStars = (stars: number) => '★'.repeat(stars) + '☆'.repeat(3 - stars);
      
      let recordsList = language === 'zh' ? '\n=== 通关记录 ===\n' : '\n=== Completion Records ===\n';
      
      records.slice(-10).reverse().forEach((record, index) => {
        const date = new Date(record.completedAt).toLocaleDateString();
        const result = record.isCorrect ? 
          (language === 'zh' ? '成功' : 'Success') : 
          (language === 'zh' ? '失败' : 'Failed');
        
        recordsList += `[${index + 1}] ${record.caseId} (${record.difficulty.toUpperCase()})\n`;
        recordsList += `    ${language === 'zh' ? '结果' : 'Result'}: ${result} ${formatStars(record.stars)}\n`;
        recordsList += `    ${language === 'zh' ? '时间' : 'Time'}: ${formatTime(record.completionTime)} | ${language === 'zh' ? '审问' : 'Interrogations'}: ${record.interrogationCount} | ${language === 'zh' ? '错误' : 'Errors'}: ${record.wrongGuesses}\n`;
        recordsList += `    ${language === 'zh' ? '日期' : 'Date'}: ${date}\n\n`;
      });
      
      return recordsList;
      
    case 'achievements':
      const achievements = gameState.gameProgress.achievements;
      const unlocked = achievements.filter(a => a.isUnlocked);
      const locked = achievements.filter(a => !a.isUnlocked);
      
      let achievementsList = language === 'zh' ? '\n=== 成就系统 ===\n' : '\n=== Achievement System ===\n';
      achievementsList += language === 'zh' ? 
        `已解锁: ${unlocked.length}/${achievements.length}\n\n` :
        `Unlocked: ${unlocked.length}/${achievements.length}\n\n`;
      
      if (unlocked.length > 0) {
        achievementsList += language === 'zh' ? '🏆 已解锁成就:\n' : '🏆 Unlocked Achievements:\n';
        unlocked.forEach(achievement => {
          const date = achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : '';
          achievementsList += `  ✅ ${achievement.name}\n     ${achievement.description}\n     ${date}\n\n`;
        });
      }
      
      if (locked.length > 0) {
        achievementsList += language === 'zh' ? '🔒 未解锁成就:\n' : '🔒 Locked Achievements:\n';
        locked.forEach(achievement => {
          achievementsList += `  ❌ ${achievement.name}\n     ${achievement.description}\n\n`;
        });
      }
      
      return achievementsList;
      
    case 'stats':
      const stats = ProgressManager.calculateStats(gameState.gameProgress.completedCases);
      stats.achievementsUnlocked = gameState.gameProgress.achievements.filter(a => a.isUnlocked).length;
      return ProgressManager.formatStats(stats, language);
      
    case 'reset_progress':
      if (args[0] === 'confirm') {
        const resetProgress = {
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
        
        updateGameState({ gameProgress: resetProgress });
        
        return language === 'zh' ? 
          '✅ 游戏进度已重置！所有记录和成就已清除。' :
          '✅ Game progress reset! All records and achievements cleared.';
      } else {
        return language === 'zh' ? 
          '⚠️ 此操作将清除所有游戏记录和成就，请输入 "reset_progress confirm" 确认重置' :
          '⚠️ This will clear all game records and achievements. Type "reset_progress confirm" to confirm reset';
      }
      
    default:
      return '';
  }
};
