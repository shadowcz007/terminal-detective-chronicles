
import { ApiConfig } from '../hooks/useGameState';
import { Language, t } from './i18n';
import { createSingleLineStreamingEffect } from './gameFragments';
import { streamLLMRequest, realLLMRequest } from '../services/llmClient';

interface StreamingOptions {
  promptText: string;
  apiConfig: ApiConfig;
  language: Language;
  startMessage: string;
  completeMessage: string;
  tipMessage?: string;
  displayRealResult?: boolean; // 新增参数，默认为 false
}

export const executeStreamingRequest = async (
  options: StreamingOptions,
  onToken?: (token: string) => void
): Promise<string> => {
  const { 
    promptText, 
    apiConfig, 
    language, 
    startMessage, 
    completeMessage, 
    tipMessage,
    displayRealResult = false // 默认为 false
  } = options;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示开始信息
    onToken(startMessage);
    
    let streamingComplete = false;
    let accumulatedContent = '';
    
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
    const apiPromise = streamLLMRequest(promptText, apiConfig, (token: string) => {
      // 积累真实的响应内容，但不显示
      accumulatedContent += token;
    });
    
    // 等待API请求完成
    const streamingResult = await apiPromise;
    streamingComplete = true;
    
    // 停止混淆效果并显示完成信息
    onToken(`\n${completeMessage}\n`);
    
    // 根据 displayRealResult 参数决定是否显示真实结果
    if (displayRealResult) {
      // 显示真实的API结果
      onToken(streamingResult);
    }
    
    // 如果有提示信息，显示提示
    if (tipMessage) {
      onToken(`\n\n${tipMessage}\n`);
    }
    
    return streamingResult;
  } else {
    // 非流式模式，使用实际的API请求
    return await realLLMRequest(promptText, apiConfig);
  }
};
