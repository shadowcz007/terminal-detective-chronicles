import { GameState, Suspect, Evidence, ApiConfig } from '../hooks/useGameState';

// 真实的LLM API请求函数
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
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API响应格式错误');
    }

    return data.choices[0].message.content;
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

// 使用真实API或模拟API的请求函数
const llmRequest = async (prompt: string, apiConfig: ApiConfig): Promise<string> => {
  // 如果配置了API密钥，使用真实API，否则使用模拟API
  if (apiConfig.key.trim()) {
    return await realLLMRequest(prompt, apiConfig);
  } else {
    return await mockLLMRequest(prompt);
  }
};

export const generateCase = async (apiConfig: ApiConfig): Promise<Partial<GameState>> => {
  const prompt = `作为犯罪剧本生成器，请创建一起谋杀案，包含：
1. 50字内的案件背景描述
2. 受害者姓名
3. 3名嫌疑人，每人包含：姓名、职业、与死者关系、犯罪动机、不在场证明
4. 2个重要证据线索

请以JSON格式返回，结构如下：
{
  "victim": "受害者姓名",
  "description": "案件背景描述",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "嫌疑人姓名",
      "occupation": "职业",
      "relationship": "与死者关系",
      "motive": "犯罪动机",
      "alibi": "不在场证明"
    }
  ],
  "evidence": [
    {
      "id": "evidence_1",
      "name": "证据名称",
      "description": "证据描述",
      "location": "发现地点"
    }
  ],
  "solution": "suspect_1"
}`;
  
  const response = await llmRequest(prompt, apiConfig);
  
  try {
    const caseData = JSON.parse(response);
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
};

export const interrogateSuspect = async (suspect: Suspect, gameState: GameState): Promise<string> => {
  const prompt = `你正在扮演嫌疑人${suspect.name}（${suspect.occupation}）。
背景：${gameState.caseDescription}
你的动机：${suspect.motive}
你的不在场证明：${suspect.alibi}

请回答侦探的问题。注意：
1. 如果问题涉及你的犯罪动机，要试图隐瞒或转移话题
2. 保持角色一致性，符合你的身份和背景
3. 回答要自然，不要过于正式
4. 每次回答控制在1-2句话

侦探现在要问你几个问题，请逐一回答：
1. 案发当晚你在哪里？
2. 你和死者的关系如何？
3. 你有什么要隐瞒的吗？
4. 有人能证明你的不在场证明吗？`;
  
  return await llmRequest(prompt, gameState.apiConfig);
};

export const generateCrimeScene = async (gameState: GameState): Promise<string> => {
  const prompt = `根据以下案件信息生成犯罪现场ASCII示意图：
案件：${gameState.caseDescription}
受害者：${gameState.victim}
证据：${gameState.evidence.map(e => `${e.name}（${e.location}）`).join('、')}

要求：
1. 使用纯文本字符绘制二维俯视图
2. 包含关键物品和证据位置
3. 标注尸体位置和可疑痕迹
4. 宽度不超过80字符
5. 添加现场分析说明`;
  
  return await llmRequest(prompt, gameState.apiConfig);
};
