
import { GameState, ApiConfig } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { createSingleLineStreamingEffect } from '../utils/gameFragments';
import { streamLLMRequest, llmRequest } from './llmClient';

export const generateCase = async (
  config: ApiConfig, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<Partial<GameState>> => {
  const promptText = language === 'zh' ? 
    `你是一个专业的推理小说作家。请生成一个复杂的谋杀案件，严格按照以下JSON格式返回：

{
  "description": "案件简述（2-3句话描述案件概况）",
  "victim": "受害者姓名和身份信息",
  "suspects": [
    {
      "id": "1",
      "name": "嫌疑人姓名",
      "occupation": "职业",
      "relationship": "与死者的关系",
      "motive": "犯罪动机",
      "alibi": "不在场证明"
    },
    {
      "id": "2", 
      "name": "嫌疑人姓名",
      "occupation": "职业",
      "relationship": "与死者的关系",
      "motive": "犯罪动机",
      "alibi": "不在场证明"
    },
    {
      "id": "3",
      "name": "嫌疑人姓名", 
      "occupation": "职业",
      "relationship": "与死者的关系",
      "motive": "犯罪动机",
      "alibi": "不在场证明"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "证据名称",
      "description": "证据详细描述",
      "location": "发现地点"
    },
    {
      "id": "2",
      "name": "证据名称",
      "description": "证据详细描述", 
      "location": "发现地点"
    },
    {
      "id": "3",
      "name": "证据名称",
      "description": "证据详细描述",
      "location": "发现地点"
    }
  ],
  "solution": "真相解释：指明真正的凶手（必须是嫌疑人中的一个）及其作案手法和真实动机"
}

要求：
1. 必须严格按照上述JSON格式输出，不要添加任何额外的文字说明
2. 生成3个嫌疑人，每个都有完整的信息
3. 生成3-4个关键证据
4. 确保逻辑合理，线索丰富
5. solution中必须指定真正的凶手（从嫌疑人中选择）` :
    `You are a professional mystery novel writer. Please generate a complex murder case strictly following this JSON format:

{
  "description": "Case summary (2-3 sentences describing the case overview)",
  "victim": "Victim's name and identity information",
  "suspects": [
    {
      "id": "1",
      "name": "Suspect name",
      "occupation": "Occupation",
      "relationship": "Relationship with deceased",
      "motive": "Criminal motive",
      "alibi": "Alibi"
    },
    {
      "id": "2",
      "name": "Suspect name", 
      "occupation": "Occupation",
      "relationship": "Relationship with deceased",
      "motive": "Criminal motive",
      "alibi": "Alibi"
    },
    {
      "id": "3",
      "name": "Suspect name",
      "occupation": "Occupation", 
      "relationship": "Relationship with deceased",
      "motive": "Criminal motive",
      "alibi": "Alibi"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "Evidence name",
      "description": "Detailed evidence description",
      "location": "Discovery location"
    },
    {
      "id": "2", 
      "name": "Evidence name",
      "description": "Detailed evidence description",
      "location": "Discovery location"
    },
    {
      "id": "3",
      "name": "Evidence name", 
      "description": "Detailed evidence description",
      "location": "Discovery location"
    }
  ],
  "solution": "Truth explanation: Identify the real culprit (must be one of the suspects) and their method and true motive"
}

Requirements:
1. Must strictly follow the above JSON format, do not add any additional text
2. Generate 3 suspects, each with complete information
3. Generate 3-4 key pieces of evidence
4. Ensure logical consistency and rich clues
5. Solution must specify the real culprit (chosen from suspects)`;

  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示案件生成的混淆信息流
    onToken(t('caseAnalysisSystemStart', language));
    
    let streamingComplete = false;
    
    // 启动混淆的单行流式效果（使用停止条件函数）
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
    const apiPromise = streamLLMRequest(promptText, config, (token: string) => {
      // 当流式响应开始时，停止混淆效果
      if (!streamingComplete) {
        streamingComplete = true;
        onToken(`\n${t('caseFileGenerationComplete', language)}\n`);
      }
      // 显示真实的流式响应
      onToken(token);
    });
    
    // 等待API请求完成
    const streamingResult = await apiPromise;
    
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
