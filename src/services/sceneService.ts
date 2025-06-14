
import { GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { getSceneRecreationPrompt } from '../utils/prompts';
import { executeStreamingRequest } from '../utils/streamingUtils';

export const generateCrimeScene = async (
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<string> => {
  const promptText = getSceneRecreationPrompt(gameState, language);

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    return await executeStreamingRequest({
      promptText,
      apiConfig: gameState.apiConfig,
      language,
      startMessage: t('sceneAnalysisStart', language),
      completeMessage: t('sceneRecreationStarted', language),
      tipMessage: t('sceneAnalysisTip', language)
    }, onToken);
  } else {
    // 非流式模式，使用实际的API请求
    const { realLLMRequest } = await import('./llmClient');
    return await realLLMRequest(promptText, gameState.apiConfig);
  }
};
