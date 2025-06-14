import { GameState, Suspect, Evidence, ApiConfig } from '../hooks/useGameState';
import { createSingleLineStreamingEffect } from './gameFragments';

// 流式响应处理函数
export const streamLLMRequest = async (
  prompt: string, 
  apiConfig: ApiConfig,
  onToken: (token: string) => void
): Promise<string> => {
  if (!apiConfig.key.trim()) {
    throw new Error('API密钥未配置，请先在config中设置');
  }

  if (!apiConfig.url.trim()) {
    throw new Error('API端点未配置，请先在config中设置');
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })
  };

  try {
    const response = await fetch(apiConfig.url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.error?.message || '未知错误'}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            return fullContent;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
              const content = parsed.choices[0].delta.content;
              if (content) {
                fullContent += content;
                onToken(content);
                // 添加延迟以实现打字机效果
                await new Promise(resolve => setTimeout(resolve, 30));
              }
            }
          } catch (e) {
            // 忽略解析错误的行
            continue;
          }
        }
      }
    }

    return fullContent;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`网络请求失败: ${error}`);
  }
};

// 真实的LLM API请求函数 - 非流式版本，作为备用
export const realLLMRequest = async (prompt: string, apiConfig: ApiConfig): Promise<string> => {
  if (!apiConfig.key.trim()) {
    throw new Error('API密钥未配置，请先在config中设置');
  }

  if (!apiConfig.url.trim()) {
    throw new Error('API端点未配置，请先在config中设置');
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  };

  try {
    const response = await fetch(apiConfig.url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.error?.message || '未知错误'}`);
    }

    const data = await response.json();
    
    // 适配新的响应格式
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error('API响应格式错误');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`网络请求失败: ${error}`);
  }
};

// 模拟AI请求函数 - 在实际应用中替换为真实API调用
export const mockLLMRequest = async (prompt: string): Promise<string> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 根据提示词类型返回不同的模拟响应
  if (prompt.includes('案件生成')) {
    return JSON.stringify({
      victim: '陈国栋',
      description: '亿万富翁陈国栋被发现死于私人书房，心脏被拆信刀刺穿',
      suspects: [
        {
          id: 'suspect_1',
          name: '张丽丽',
          occupation: '死者妻子',
          relationship: '夫妻关系',
          motive: '发现丈夫出轨并准备离婚，担心失去巨额财产继承权',
          alibi: '声称案发时在楼上卧室休息'
        },
        {
          id: 'suspect_2', 
          name: '王明远',
          occupation: '商业伙伴',
          relationship: '合作伙伴',
          motive: '因为十亿元项目分歧，死者威胁要撤销合作协议',
          alibi: '声称在公司加班到深夜'
        },
        {
          id: 'suspect_3',
          name: '李志强', 
          occupation: '私人医生',
          relationship: '医患关系',
          motive: '曾经误诊导致死者母亲去世，一直被死者威胁要曝光',
          alibi: '声称在医院值夜班'
        }
      ],
      evidence: [
        {
          id: 'evidence_1',
          name: '血迹拆信刀',
          description: '凶器，刀柄上发现指纹，但已被人为擦拭过',
          location: '死者胸前'
        },
        {
          id: 'evidence_2',
          name: '破碎花瓶',
          description: '昂贵的古董花瓶碎片，疑似搏斗时被打碎',
          location: '书房阳台'
        }
      ],
      solution: 'suspect_1'
    });
  }
  
  if (prompt.includes('审问')) {
    const responses = [
      '我当时在楼上休息，什么都没听到...',
      '这个问题我不想回答，请问其他的吧。',
      '我和死者的关系很复杂，但我绝对没有杀他！',
      '你这是在怀疑我吗？我有不在场证明！',
      '那天晚上确实有些异常，但我保证不是我做的...'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (prompt.includes('犯罪现场')) {
    return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                书房平面图                                     ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║    ┌─────────────────────────────────────┐    ┌─────────────────────────────┐ ║
║    │              书房主区域              │    │           阳台区域           │ ║
║    │                                     │    │                             │ ║
║    │  ┌─────┐     ┌─────────┐           │    │      ☠ 破碎花瓶             │ ║
║    │  │书架 │     │  办公桌  │           │    │         碎片                │ ║
║    │  │     │     │    💻   │           │    │                             │ ║
║    │  └─────┘     │  🗂️📎  │           │    │  ┌─────┐                   │ ║
║    │              └─────────┘           │    │  │花台 │                   │ ║
║    │                                     │    │  └─────┘                   │ ║
║    │         💀 尸体位置                 │    │                             │ ║
║    │        🔪 拆信刀                   │    │                             │ ║
║    │       🩸 血迹                      │    │                             │ ║
║    │                                     │    │                             │ ║
║    │  ┌─────┐                           │    │                             │ ║
║    │  │沙发 │                           │    │                             │ ║
║    │  └─────┘                           │    │                             │ ║
║    └─────────────────────────────────────┘    └─────────────────────────────┘ ║
║                               │                                               ║
║                               │                                               ║
║                          ┌─────────┐                                         ║
║                          │   门口   │                                         ║
║                          └─────────┘                                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

现场分析:
• 死者倒在办公桌前，面朝阳台方向
• 拆信刀插在胸前，角度表明凶手身高约1.7米
• 阳台花瓶被打碎，疑似搏斗痕迅
• 办公桌上文件散乱，但电脑未被触碰
• 门锁完好，内部反锁，凶手可能从阳台逃脱
`;
  }
  
  return '模拟AI响应：请检查提示词内容';
};

// 使用流式API或模拟API的请求函数
const llmRequest = async (
  prompt: string, 
  apiConfig: ApiConfig, 
  onToken?: (token: string) => void
): Promise<string> => {
  // 如果配置了API密钥，使用真实API，否则使用模拟API
  if (apiConfig.key.trim()) {
    if (onToken) {
      return await streamLLMRequest(prompt, apiConfig, onToken);
    } else {
      return await realLLMRequest(prompt, apiConfig);
    }
  } else {
    return await mockLLMRequest(prompt);
  }
};

export const generateCase = async (
  config: ApiConfig, 
  onToken?: (token: string) => void,
  language: 'zh' | 'en' = 'zh'
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
    onToken('\n=== 案件分析系统启动 ===\n');
    
    // 启动混淆的单行流式效果
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (isComplete) {
          onToken('\n案件档案生成完成！\n');
        } else {
          // 清除当前行并显示新内容
          onToken(`\r${text}`);
        }
      }, 
      4000
    );
    
    // 同时在后台获取真实数据（不显示给用户）
    const responsePromise = llmRequest(promptText, config);
    
    // 等待流式效果完成
    await streamingPromise;
    
    // 获取真实响应
    const response = await responsePromise;
    
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
      throw new Error('案件生成失败：AI响应格式错误');
    }
  } else {
    // 非流式模式，直接返回结果
    const response = await llmRequest(promptText, config);
    
    try {
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
      throw new Error('案件生成失败：AI响应格式错误');
    }
  }
};

export const interrogateSuspect = async (
  suspect: Suspect, 
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: 'zh' | 'en' = 'zh'
): Promise<string> => {
  const promptText = language === 'zh' ?
    `你正在审问嫌疑人 ${suspect.name}。

案件背景：${gameState.caseDescription}
受害者：${gameState.victim}

嫌疑人信息：
- 姓名：${suspect.name}
- 职业：${suspect.occupation}  
- 与死者关系：${suspect.relationship}
- 动机：${suspect.motive}
- 不在场证明：${suspect.alibi}

请模拟这个嫌疑人回答以下问题，回答要符合人物性格，可能会有所隐瞒或撒谎：

1. 你在案发时间在哪里？
2. 你和死者最后一次见面是什么时候？
3. 你有什么要隐瞒的吗？
4. 有人能证明你的不在场证明吗？` :
    `You are interrogating suspect ${suspect.name}.

Case background: ${gameState.caseDescription}
Victim: ${gameState.victim}

Suspect information:
- Name: ${suspect.name}
- Occupation: ${suspect.occupation}
- Relationship with deceased: ${suspect.relationship}
- Motive: ${suspect.motive}
- Alibi: ${suspect.alibi}

Please simulate this suspect answering the following questions. Answers should match the character's personality and may involve concealment or lies:

1. Where were you at the time of the incident?
2. When was the last time you saw the deceased?
3. Is there anything you're hiding?
4. Can anyone verify your alibi?`;
  
  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    // 显示审问准备的混淆信息流
    const startMsg = language === 'zh' ? 
      `\n=== 开始审问 ${suspect.name} ===\n` :
      `\n=== Starting interrogation of ${suspect.name} ===\n`;
    onToken(startMsg);
    
    // 启动混淆的单行流式效果
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (isComplete) {
          const recordingMsg = language === 'zh' ? 
            '\n开始记录对话...\n\n' : 
            '\nStarting conversation recording...\n\n';
          onToken(recordingMsg);
        } else {
          // 清除当前行并显示新内容
          onToken(`\r${text}`);
        }
      }, 
      2000
    );
    
    // 同时在后台获取真实数据
    const responsePromise = llmRequest(promptText, gameState.apiConfig, (token: string) => {
      // 在流式效果完成后开始打字机效果
      onToken(token);
    });
    
    // 等待流式效果完成
    await streamingPromise;
    
    // 等待真实响应完成
    const response = await responsePromise;
    
    // 在审问结束后添加提示
    const hintMsg = language === 'zh' ?
      '\n\n提示: 注意观察回答中的矛盾和可疑之处\n输入其他命令继续调查，或审问其他嫌疑人\n' :
      '\n\nHint: Pay attention to contradictions and suspicious details in the answers\nEnter other commands to continue investigation, or interrogate other suspects\n';
    onToken(hintMsg);
    
    return response;
  } else {
    // 非流式模式
    return await llmRequest(promptText, gameState.apiConfig);
  }
};

export const generateCrimeScene = async (
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: 'zh' | 'en' = 'zh'
): Promise<string> => {
  const promptText = language === 'zh' ?
    `基于以下案件信息，详细描述犯罪现场的重现：

案件：${gameState.caseDescription}
受害者：${gameState.victim}

嫌疑人：
${gameState.suspects.map(s => `- ${s.name}: ${s.relationship}`).join('\n')}

证据：
${gameState.evidence.map(e => `- ${e.name} (${e.location}): ${e.description}`).join('\n')}

请生成一个详细的犯罪现场重现，包括：
1. 现场环境描述
2. 事件发生过程推测
3. 关键细节分析
4. 可疑之处指出` :
    `Based on the following case information, provide a detailed description of the crime scene recreation:

Case: ${gameState.caseDescription}
Victim: ${gameState.victim}

Suspects:
${gameState.suspects.map(s => `- ${s.name}: ${s.relationship}`).join('\n')}

Evidence:
${gameState.evidence.map(e => `- ${e.name} (${e.location}): ${e.description}`).join('\n')}

Please generate a detailed crime scene recreation including:
1. Scene environment description
2. Speculation on how events unfolded
3. Key detail analysis
4. Identification of suspicious elements`;

  return await llmRequest(promptText, gameState.apiConfig, onToken);
};
