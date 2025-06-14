import { GameState, ApiConfig } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { createSingleLineStreamingEffect } from '../utils/gameFragments';
import { streamLLMRequest, llmRequest } from './llmClient';
import { getCaseGenerationPrompt } from '../utils/prompts';

export const generateCase = async (
  config: ApiConfig, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<Partial<GameState>> => {
  const promptText = getCaseGenerationPrompt(language);

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示案件生成的混淆信息流
    onToken(t('caseAnalysisSystemStart', language));
    
    let streamingComplete = false;
    
    // 同时启动混淆的单行流式效果和真实的流式API请求
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
    
    const apiPromise = streamLLMRequest(promptText, config, (token: string) => {
      // 流式请求过程中不显示真实的token，只积累响应内容
      // 混淆效果会一直持续到streamingResult完成
    });
    
    // 等待API请求完成，然后设置streamingComplete为true
    const streamingResult = await apiPromise;
    streamingComplete = true;
    
    // 停止混淆效果并显示完成信息
    onToken(`\n${t('caseFileGenerationComplete', language)}\n`);
    
    // 解析并返回结果
    const parsedResult = parseCaseResponse(streamingResult, language);
    
    // 将解析后的结果格式化显示给用户
    const resultDisplay = formatCaseResult(parsedResult, language);
    onToken(`\n${resultDisplay}`);
    
    return parsedResult;
  } else {
    // 非流式模式，直接返回结果
    const response = await llmRequest(promptText, config);
    return parseCaseResponse(response, language);
  }
};

const parseCaseResponse = (response: string, language: Language): Partial<GameState> => {
  try {
    // 提取JSON内容，处理可能包含代码块的响应
    let jsonContent = response;
    if (response.includes('```json')) {
      const match = response.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        jsonContent = match[1];
      }
    } else if (response.includes('```')) {
      // 处理没有json标记的代码块
      const match = response.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        jsonContent = match[1];
      }
    }
    
    // 清理可能的多余字符
    jsonContent = jsonContent.trim();
    
    const caseData = JSON.parse(jsonContent);
    
    // 确保数据结构完整性
    return {
      caseId: `MH${new Date().getFullYear().toString().slice(-2)}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      caseDescription: caseData.description || '未知案件',
      victim: caseData.victim || '未知受害者',
      suspects: caseData.suspects || [],
      evidence: caseData.evidence || [],
      solution: caseData.solution || '未知真相'
    };
  } catch (error) {
    console.error('JSON解析错误:', error);
    console.error('原始响应:', response);
    throw new Error(t('caseGenerationFailed', language, { 
      error: error instanceof Error ? error.message : t('unknownError', language)
    }));
  }
};

// 格式化案件结果用于显示
const formatCaseResult = (caseData: Partial<GameState>, language: Language): string => {
  let caseInfo = `
${t('newCaseFile', language)}
${t('caseId', language)}: #${caseData.caseId}
${t('overview', language)}: ${caseData.caseDescription}
${t('victim', language)}: ${caseData.victim}

${t('suspectsOverview', language)}`;
  
  caseData.suspects?.forEach((suspect, index) => {
    caseInfo += `\n[${index + 1}] ${suspect.name} - ${suspect.occupation}`;
    caseInfo += `\n    ${t('relationship', language)}: ${suspect.relationship}`;
  });
  
  caseInfo += `\n\n${t('initialEvidence', language)}`;
  caseData.evidence?.forEach((evidence, index) => {
    caseInfo += `\n[${index + 1}] ${evidence.name}`;
    caseInfo += `\n    ${t('location', language)}: ${evidence.location}`;
  });
  
  return caseInfo;
};
