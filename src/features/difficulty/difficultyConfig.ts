
import { DifficultyLevel } from '../../types/gameTypes';
import { Language, t } from '../../utils/i18n';

export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  easy: {
    level: 'easy',
    name: 'Easy',
    description: 'Simple cases with clear clues'
  },
  normal: {
    level: 'normal', 
    name: 'Normal',
    description: 'Balanced cases with moderate complexity'
  },
  hard: {
    level: 'hard',
    name: 'Hard',
    description: 'Complex cases with misleading clues'
  }
};

export const getDifficultyConfig = (level: string) => {
  switch (level) {
    case 'easy':
      return {
        suspectCount: 3,
        evidenceCount: 3,
        complexity: 'low',
        forbiddenElements: ['multiple motives', 'red herrings', 'complex relationships']
      };
    case 'normal':
      return {
        suspectCount: 4,
        evidenceCount: 4,
        complexity: 'medium',
        forbiddenElements: ['excessive red herrings']
      };
    case 'hard':
      return {
        suspectCount: 5,
        evidenceCount: 5,
        complexity: 'high',
        forbiddenElements: []
      };
    default:
      return getDifficultyConfig('normal');
  }
};

export const getDifficultyPromptAddition = (level: string, language: Language): string => {
  const config = getDifficultyConfig(level);
  
  const difficultyText = language === 'zh' ? 
    `\n\n【难度要求】：
- 嫌疑人数量：${config.suspectCount}个
- 证据数量：${config.evidenceCount}个
- 复杂程度：${config.complexity === 'low' ? '简单' : config.complexity === 'medium' ? '中等' : '困难'}
${config.forbiddenElements.length > 0 ? `- 避免使用：${config.forbiddenElements.join('、')}` : ''}` :
    `\n\n【DIFFICULTY REQUIREMENTS】:
- Number of suspects: ${config.suspectCount}
- Number of evidence: ${config.evidenceCount}  
- Complexity level: ${config.complexity}
${config.forbiddenElements.length > 0 ? `- Avoid using: ${config.forbiddenElements.join(', ')}` : ''}`;

  return difficultyText;
};
