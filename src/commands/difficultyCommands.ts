
import { GameState } from '../types/gameTypes';
import { DIFFICULTY_LEVELS } from '../features/difficulty/difficultyConfig';
import { Language, t } from '../utils/i18n';

export const handleDifficultyCommands = (
  command: string,
  args: string[],
  gameState: GameState,
  updateGameState: (updates: Partial<GameState>) => void,
  language: Language
): string => {
  const cmd = command.toLowerCase();
  
  if (cmd === 'difficulty') {
    if (args.length === 0) {
      // 显示当前难度
      const current = gameState.difficulty;
      const difficultyText = language === 'zh' ? 
        `当前难度: ${current.level.toUpperCase()} - ${current.name}\n${current.description}\n\n可用难度级别:\n` :
        `Current Difficulty: ${current.level.toUpperCase()} - ${current.name}\n${current.description}\n\nAvailable Difficulty Levels:\n`;
      
      let availableDifficulties = '';
      Object.entries(DIFFICULTY_LEVELS).forEach(([key, diff]) => {
        const prefix = gameState.difficulty.level === key ? '> ' : '  ';
        availableDifficulties += `${prefix}${key} - ${diff.name}: ${diff.description}\n`;
      });
      
      const usage = language === 'zh' ? 
        '\n使用方法: difficulty [easy|normal|hard]' :
        '\nUsage: difficulty [easy|normal|hard]';
      
      return difficultyText + availableDifficulties + usage;
    } else {
      // 设置难度
      const newLevel = args[0].toLowerCase();
      if (!DIFFICULTY_LEVELS[newLevel]) {
        return language === 'zh' ? 
          '无效的难度等级！请使用: easy, normal, hard' :
          'Invalid difficulty level! Use: easy, normal, hard';
      }
      
      const difficulty = DIFFICULTY_LEVELS[newLevel];
      updateGameState({ difficulty });
      
      return language === 'zh' ? 
        `难度已设置为: ${difficulty.level.toUpperCase()} - ${difficulty.name}\n${difficulty.description}` :
        `Difficulty set to: ${difficulty.level.toUpperCase()} - ${difficulty.name}\n${difficulty.description}`;
    }
  }
  
  return '';
};
