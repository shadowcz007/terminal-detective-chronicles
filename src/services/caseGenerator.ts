
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
  // **生成高随机性的时间戳信息**
  const timestampInfo = generateTimestamps();
  
  console.log('🎲 [caseGenerator] Enhanced timestamp randomization:', {
    randomSeed: timestampInfo.randomSeed,
    yearsDifference: timestampInfo.yearsDifference,
    timeVariant: timestampInfo.timeVariant,
    historicalPeriod: timestampInfo.historicalPeriod,
    contextCount: timestampInfo.historicalContext.length
  });
  
  const basePrompt = getCaseGenerationPrompt(language, timestampInfo);
  const difficultyAddition = getDifficultyPromptAddition(difficulty, language);
  
  // **基于时间戳增加提示词随机性**
  const randomizationSuffix = language === 'zh' ? 
    `\n\n【随机性增强指令】：
基于时间种子 ${timestampInfo.randomSeed.toFixed(6)}，请确保：
1. 案件背景具有独特的${timestampInfo.timeVariant}特征
2. 人物设定要体现${timestampInfo.historicalPeriod}的时代烙印  
3. 证据设计要融入${timestampInfo.seasonalContext}的环境特色
4. 情节发展要反映历史事件的深层次影响
5. 真相揭示要有意料之外但情理之中的转折

【创意方向】：结合${timestampInfo.yearsDifference}年的时间跨度，创造一个前所未有的推理故事。
避免常见套路，追求故事的原创性和震撼性。` :
    `\n\n【RANDOMIZATION ENHANCEMENT】：
Based on time seed ${timestampInfo.randomSeed.toFixed(6)}, please ensure:
1. Case background has unique ${timestampInfo.timeVariant} characteristics
2. Character design reflects the era imprint of ${timestampInfo.historicalPeriod}
3. Evidence design incorporates environmental features of ${timestampInfo.seasonalContext}
4. Plot development reflects deep impact of historical events
5. Truth revelation has unexpected but reasonable twists

【CREATIVE DIRECTION】: Combining the ${timestampInfo.yearsDifference}-year time span, create an unprecedented mystery story.
Avoid common tropes, pursue originality and impact in the story.`;
  
  const promptText = basePrompt + difficultyAddition + randomizationSuffix;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // **增强时间戳显示信息**
    const timestampDisplay = language === 'zh' ? 
      `\n🎲 随机性分析系统启动...\n⏰ 当前时间: ${timestampInfo.currentFormatted}\n📅 历史锚点: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference}年前)\n🔍 时代特征: ${timestampInfo.historicalPeriod}\n✨ 时间变体: ${timestampInfo.timeVariant}\n🌟 随机种子: ${timestampInfo.randomSeed.toFixed(6)}\n🎯 历史维度: ${timestampInfo.historicalContext.length}个关键事件\n🌸 季节背景: ${timestampInfo.seasonalContext}\n` :
      `\n🎲 Randomization analysis system initiated...\n⏰ Current time: ${timestampInfo.currentFormatted}\n📅 Historical anchor: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference} years ago)\n🔍 Era characteristics: ${timestampInfo.historicalPeriod}\n✨ Time variant: ${timestampInfo.timeVariant}\n🌟 Random seed: ${timestampInfo.randomSeed.toFixed(6)}\n🎯 Historical dimensions: ${timestampInfo.historicalContext.length} key events\n🌸 Seasonal context: ${timestampInfo.seasonalContext}\n`;
    
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
    
    // **增强结果显示，展现随机性效果**
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
    
    // **生成具有时间戳特征的案件ID**
    const timestamp = Date.now();
    const randomComponent = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const caseId = `MH${new Date().getFullYear().toString().slice(-2)}${randomComponent}T${timestamp.toString().slice(-6)}`;
    
    // 确保数据结构完整性
    return {
      caseId,
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

// **增强案件结果格式化，展现随机性特征**
const formatCaseResult = (caseData: Partial<GameState>, language: Language, timestampInfo?: {
  randomSeed: number;
  timeVariant: string;
  historicalFormatted: string;
  yearsDifference: number;
  historicalPeriod: string;
  seasonalContext: string;
  historicalContext: Array<{ year: number; event: string }>;
}): string => {
  let caseInfo = `\n${t('newCaseFile', language)}\n${t('caseId', language)}: #${caseData.caseId}\n`;
  
  // **展现时间戳随机性信息**
  if (timestampInfo) {
    caseInfo += language === 'zh' ? 
      `🎲 随机性特征: 种子${timestampInfo.randomSeed.toFixed(4)} | ${timestampInfo.timeVariant}\n📅 历史背景: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference}年前)\n🔍 时代特征: ${timestampInfo.historicalPeriod}\n🌸 季节氛围: ${timestampInfo.seasonalContext}\n📊 历史维度: ${timestampInfo.historicalContext.length}个关键事件\n\n` :
      `🎲 Randomization Features: Seed${timestampInfo.randomSeed.toFixed(4)} | ${timestampInfo.timeVariant}\n📅 Historical Background: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference} years ago)\n🔍 Era Characteristics: ${timestampInfo.historicalPeriod}\n🌸 Seasonal Atmosphere: ${timestampInfo.seasonalContext}\n📊 Historical Dimensions: ${timestampInfo.historicalContext.length} key events\n\n`;
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
