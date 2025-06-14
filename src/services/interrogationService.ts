
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
  const promptText = getInterrogationPrompt(suspect, gameState, language);
  
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
    return await realLLMRequest(promptText, gameState.apiConfig);
  }
};
