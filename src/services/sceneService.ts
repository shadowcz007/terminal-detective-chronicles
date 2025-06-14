
import { GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { createSingleLineStreamingEffect } from '../utils/gameFragments';
import { streamLLMRequest, realLLMRequest } from './llmClient';
import { getSceneRecreationPrompt } from '../utils/prompts';

export const generateCrimeScene = async (
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<string> => {
  const promptText = getSceneRecreationPrompt(gameState, language);

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示现场重现分析的混淆信息流
    onToken(t('sceneAnalysisStart', language));
    
    let streamingComplete = false;
    
    // 启动混淆的单行流式效果 - 使用停止条件函数
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (!streamingComplete) {
          // 只要API请求未完成，就继续显示混淆效果
          onToken(`\r${text}`);
        }
      }, 
      language,
      () => streamingComplete // 传入停止条件函数
    );
    
    // 启动真实的流式API请求
    const apiPromise = streamLLMRequest(promptText, gameState.apiConfig, (token: string) => {
      // 流式请求过程中不显示真实的token，只积累响应内容
      // 混淆效果会一直持续到streamingResult完成
    });
    
    // 等待API请求完成，然后设置streamingComplete为true
    const streamingResult = await apiPromise;
    streamingComplete = true;
    
    // 停止混淆效果并显示完成信息
    onToken(`\n${t('sceneRecreationStarted', language)}\n`);
    
    // 显示真实的现场重现结果
    onToken(streamingResult);
    
    // 在现场重现结束后添加提示
    const hintMsg = t('sceneAnalysisTip', language);
    onToken(`\n\n${hintMsg}\n`);
    
    return streamingResult;
  } else {
    // 非流式模式，使用实际的API请求
    return await realLLMRequest(promptText, gameState.apiConfig);
  }
};
