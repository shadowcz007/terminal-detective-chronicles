
import { GameState, ApiConfig } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { createSingleLineStreamingEffect } from '../utils/gameFragments';
import { llmRequest } from './llmClient';

export const generateCase = async (
  config: ApiConfig, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<Partial<GameState>> => {
  const promptText = language === 'zh' ? 
    `你是一个专业的推理小说作家。请生成一个复杂的谋杀案件，包含以下要素：

1. 案件基本信息：
   - 案件ID（格式：MH + 年份后两位 + 6位随机字符）
   - 案件简述（2-3句话）
   - 受害者姓名和身份

2. 嫌疑人信息（3-4个）：
   - 姓名、职业
   - 与死者的关系
   - 表面动机
   - 不在场证明

3. 关键证据（3-5个）：
   - 证据名称
   - 发现地点
   - 详细描述

4. 真相：指定真正的凶手（从嫌疑人中选择）

请用JSON格式返回，确保逻辑合理、线索丰富。` :
    `You are a professional mystery novel writer. Please generate a complex murder case with the following elements:

1. Basic case information:
   - Case ID (format: MH + last two digits of year + 6 random characters)
   - Case summary (2-3 sentences)
   - Victim's name and identity

2. Suspect information (3-4 people):
   - Name, occupation
   - Relationship with the deceased
   - Apparent motive
   - Alibi

3. Key evidence (3-5 items):
   - Evidence name
   - Discovery location
   - Detailed description

4. Truth: Specify the real culprit (chosen from suspects)

Please return in JSON format, ensuring logical consistency and rich clues.`;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示案件生成的混淆信息流
    onToken(t('caseAnalysisSystemStart', language));
    
    let streamingComplete = false;
    
    // 启动混淆的单行流式效果（持续运行直到API请求完成）
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (!streamingComplete) {
          // 只要API请求未完成，就继续显示混淆效果
          onToken(`\r${text}`);
        }
      }, 
      language,
      30000 // 设置足够长的时间，让它持续运行直到API完成
    );
    
    // 启动真实的API请求
    const apiPromise = llmRequest(promptText, config).then(response => {
      streamingComplete = true; // 标记API请求完成
      return response;
    });
    
    // 等待API请求完成
    const streamingResult = await apiPromise;
    
    // API完成后，停止混淆效果并显示完成提示
    onToken(`\n${t('caseFileGenerationComplete', language)}\n`);
    
    // 解析并显示最终结果
    const parsedResult = parseCaseResponse(streamingResult, language);
    
    // 将解析后的结果格式化显示给用户
    const resultDisplay = formatCaseResult(parsedResult, language);
    onToken(resultDisplay);
    
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
    }
    
    const caseData = JSON.parse(jsonContent);
    return {
      caseId: `MH${new Date().getFullYear().toString().slice(-2)}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      caseDescription: caseData.description,
      victim: caseData.victim,
      suspects: caseData.suspects,
      evidence: caseData.evidence,
      solution: caseData.solution
    };
  } catch (error) {
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
