
import { Language } from '../i18n';
import { GameState } from '../../hooks/useGameState';

export const getSceneRecreationPrompt = (gameState: GameState, language: Language): string => {
  return language === 'zh' ?
    `基于以下案件信息，详细描述犯罪现场的重现：

案件：${gameState.caseDescription}
受害者：${gameState.victim}

嫌疑人：
${gameState.suspects.map(s => `- ${s.name}: ${s.relationship}`).join('\n')}

证据：
${gameState.evidence.map(e => `- ${e.name} (${e.location}): ${e.description}`).join('\n')}

请生成一个详细的犯罪现场重现，包括：
1. 现场环境描述
2. 事件发生过程推测
3. 关键细节分析
4. 可疑之处指出` :
    `Based on the following case information, provide a detailed description of the crime scene recreation:

Case: ${gameState.caseDescription}
Victim: ${gameState.victim}

Suspects:
${gameState.suspects.map(s => `- ${s.name}: ${s.relationship}`).join('\n')}

Evidence:
${gameState.evidence.map(e => `- ${e.name} (${e.location}): ${e.description}`).join('\n')}

Please generate a detailed crime scene recreation including:
1. Scene environment description
2. Speculation on how events unfolded
3. Key detail analysis
4. Identification of suspicious elements`;
};
