
import { Suspect, GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { getInterrogationPrompt } from '../utils/prompts';
import { executeStreamingRequest } from '../utils/streamingUtils';

export const interrogateSuspect = async (
  suspect: Suspect, 
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<string> => {
  // 生成唯一的prompt，包含时间戳和随机元素
  const promptText = getInterrogationPrompt(suspect, gameState, language);
  
  // 在开发模式下输出调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Interrogating suspect: ${suspect.name} (ID: ${suspect.id})`);
    console.log(`📝 Prompt length: ${promptText.length} characters`);
    console.log(`🎯 Prompt preview:`, promptText.substring(0, 200) + '...');
  }
  
  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    return await executeStreamingRequest({
      promptText,
      apiConfig: gameState.apiConfig,
      language,
      startMessage: t('startInterrogation', language, { name: suspect.name }),
      completeMessage: t('interrogationStarted', language, { name: suspect.name }),
      tipMessage: t('interrogationTip', language)
    }, onToken);
  } else {
    // 非流式模式，使用实际的API请求
    const { realLLMRequest } = await import('./llmClient');
    const result = await realLLMRequest(promptText, gameState.apiConfig);
    
    // 调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Interrogation result for ${suspect.name}:`, result.substring(0, 100) + '...');
    }
    
    return result;
  }
};
