
import { GameState, ApiConfig } from '../types/gameTypes';
import { Language, t } from '../utils/i18n';
import { llmRequest } from './llmClient';
import { getCaseGenerationPrompt } from '../utils/prompts';
import { executeStreamingRequest } from '../utils/streamingUtils';
import { getDifficultyPromptAddition } from '../features/difficulty/difficultyConfig';
import { generateTimestamps } from '../utils/timestampUtils';

export const generateCase = async (
  config: ApiConfig, 
  onToken?: (token: string) => void,
  language: Language = 'zh',
  difficulty: string = 'normal'
): Promise<Partial<GameState>> => {
  // Generate timestamp information for historical context
  const timestampInfo = generateTimestamps();
  
  const basePrompt = getCaseGenerationPrompt(language, timestampInfo);
  const difficultyAddition = getDifficultyPromptAddition(difficulty, language);
  const promptText = basePrompt + difficultyAddition;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // Display timestamp information to user
    const timestampDisplay = language === 'zh' ? 
      `\n⏰ 时间背景分析中...\n当前时间: ${timestampInfo.currentFormatted}\n历史关键节点: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference}年前)\n历史时期: ${timestampInfo.historicalPeriod}\n` :
      `\n⏰ Analyzing time background...\nCurrent time: ${timestampInfo.currentFormatted}\nHistorical key point: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference} years ago)\nHistorical period: ${timestampInfo.historicalPeriod}\n`;
    
    onToken(timestampDisplay);
    
    const streamingResult = await executeStreamingRequest({
      promptText,
      apiConfig: config,
      language,
      startMessage: t('caseAnalysisSystemStart', language),
      completeMessage: t('caseFileGenerationComplete', language)
    }, onToken);
    
    // 解析并返回结果
    const parsedResult = parseCaseResponse(streamingResult, language);
    
    // 将解析后的结果格式化显示给用户
    const resultDisplay = formatCaseResult(parsedResult, language, timestampInfo);
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
const formatCaseResult = (caseData: Partial<GameState>, language: Language, timestampInfo?: any): string => {
  let caseInfo = `\n${t('newCaseFile', language)}\n${t('caseId', language)}: #${caseData.caseId}\n`;
  
  // Add timestamp context if available
  if (timestampInfo) {
    caseInfo += language === 'zh' ? 
      `📅 历史背景: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference}年前)\n🔍 时代特征: ${timestampInfo.historicalPeriod}\n\n` :
      `📅 Historical Background: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference} years ago)\n🔍 Era Characteristics: ${timestampInfo.historicalPeriod}\n\n`;
  }
  
  caseInfo += `${t('overview', language)}: ${caseData.caseDescription}\n${t('victim', language)}: ${caseData.victim}\n\n${t('suspectsOverview', language)}`;
  
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
