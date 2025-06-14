
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
}

export const executeStreamingRequest = async (
  options: StreamingOptions,
  onToken?: (token: string) => void
): Promise<string> => {
  const { promptText, apiConfig, language, startMessage, completeMessage, tipMessage } = options;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示开始信息
    onToken(startMessage);
    
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
    const apiPromise = streamLLMRequest(promptText, apiConfig, (token: string) => {
      // 流式请求过程中不显示真实的token，只积累响应内容
      // 混淆效果会一直持续到streamingResult完成
    });
    
    // 等待API请求完成，然后设置streamingComplete为true
    const streamingResult = await apiPromise;
    streamingComplete = true;
    
    // 停止混淆效果并显示完成信息
    onToken(`\n${completeMessage}\n`);
    
    // 显示真实的结果
    onToken(streamingResult);
    
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
