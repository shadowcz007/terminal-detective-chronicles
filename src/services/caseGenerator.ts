
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
    
    // 启动混淆的单行流式效果 - 修正参数顺序
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (isComplete) {
          onToken(t('caseFileGenerationComplete', language));
        } else {
          // 清除当前行并显示新内容
          onToken(`\r${text}`);
        }
      }, 
      language,
      4000
    );
    
    // 同时在后台获取真实数据（不显示给用户）
    const responsePromise = llmRequest(promptText, config);
    
    // 等待流式效果完成
    await streamingPromise;
    
    // 获取真实响应
    const response = await responsePromise;
    
    return parseCaseResponse(response, language);
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
