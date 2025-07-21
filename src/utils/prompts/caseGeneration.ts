
import { Language } from '../i18n';
import { TimestampInfo } from '../timestampUtils';

export const getCaseGenerationPrompt = (language: Language, timestampInfo?: TimestampInfo): string => {
  // If no timestamp info provided, return original prompt
  if (!timestampInfo) {
    return getOriginalPrompt(language);
  }

  return language === 'zh' ? 
    `你是一个专业的推理小说作家。现在需要你基于特定的历史时间背景来生成一个复杂的谋杀案件。

【时间背景设定】
当前时间：${timestampInfo.currentFormatted}
历史关键时间点：${timestampInfo.historicalFormatted}（${timestampInfo.yearsDifference}年前）
历史时期：${timestampInfo.historicalPeriod}

【历史背景分析要求】
1. 首先基于历史时间点（${timestampInfo.historical.getFullYear()}年）推理出3-5个该时期的重要历史事件或社会现象
2. 这些历史事件必须与即将生成的案件有合理的因果关系
3. 案件的背景、动机、人物设定都应该与历史事件紧密相关
4. 历史事件的影响应该延续到现在，成为案件发生的根本原因

【案件生成要求】
严格按照以下JSON格式返回，并确保案件与历史背景高度关联：

{
  "historicalContext": {
    "keyEvents": ["历史事件1", "历史事件2", "历史事件3"],
    "relevance": "历史事件与案件的关联性说明"
  },
  "description": "案件概述描述，必须体现历史背景的影响 (string)",
  "victim": "受害者信息，与历史背景相关 (string)",
  "suspects": [
    {
      "id": "1 (string)",
      "name": "嫌疑人姓名 (string)",
      "occupation": "职业，与历史背景相关 (string)",
      "relationship": "与死者关系 (string)",
      "motive": "作案动机，与历史事件相关 (string)",
      "alibi": "不在场证明 (string)"
    }
  ],
  "evidence": [
    {
      "id": "1 (string)",
      "name": "证物名称 (string)",
      "description": "详细描述，可能包含历史痕迹 (string)",
      "location": "发现地点 (string)"
    }
  ],
  "solution": "真相揭示，必须指定真正的凶手并解释历史根源 (string)"
}

【重要创作要求】：
1. 必须严格按照上述JSON格式输出，不要添加任何额外的文字说明
2. 所有字段都必须是字符串(string)类型
3. historicalContext部分必须准确反映${timestampInfo.historical.getFullYear()}年的历史背景
4. 案件背景必须与历史事件有合理的因果关系，不能生硬拼接
5. 生成3个嫌疑人，每个都有与历史背景相关的完整背景信息
6. 生成3-4个关键证据，其中至少一个与历史背景直接相关
7. 确保逻辑合理，历史时间线清晰，现代与历史的联系自然
8. solution中必须明确指定真正的凶手并解释历史根源
9. 避免使用常见的推理小说套路，结合历史背景创造独特情节
10. 人物姓名和职业要符合历史时代特征，避免时代错位

【逻辑一致性强制要求】：
11. 凶手必须是suspects数组中的一个，solution中的凶手姓名必须与suspects中的name完全匹配
12. 每个嫌疑人的alibi必须包含具体的时间、地点、证人信息，便于后续验证
13. 证据必须形成逻辑链条：至少2个证据指向真凶，1-2个证据排除其他嫌疑人
14. 凶手的motive必须足够强烈，能够解释为什么选择杀人而非其他解决方式
15. 作案手法必须与凶手的身份、能力、性格相符，不能超出其能力范围
16. 时间线必须精确：案发时间、各嫌疑人的行踪、证据产生时间要完全吻合
17. 现场布置必须符合凶手的心理状态和掩盖意图

【历史关联创作指南】：
- ${timestampInfo.historical.getFullYear()}年发生的事件如何影响了今天的案件？
- 受害者或嫌疑人与历史事件有什么直接或间接的关系？
- 是否涉及历史遗留问题、家族恩怨、商业纠纷的延续？
- 证据中是否包含历史文档、老照片、过期合同等历史物证？
- 案件的真相是否揭示了一个跨越${timestampInfo.yearsDifference}年的复杂故事？

【创意方向建议】：
基于${timestampInfo.historicalPeriod}的特征，考虑以下元素：
- 该时期的技术发展对现在的影响
- 当时的商业模式或社会现象的现代后果
- 历史人物的现代传承或遗产纠纷
- 跨时代的秘密、承诺或复仇计划
- 历史文档或证据的现代价值

请基于以上要求，创造一个与${timestampInfo.historical.getFullYear()}年历史背景紧密相关的全新推理案件。` :
    `You are a professional mystery novel writer. You need to generate a complex murder case based on specific historical time background.

【TIME BACKGROUND SETTING】
Current time: ${timestampInfo.currentFormatted}
Historical key time point: ${timestampInfo.historicalFormatted} (${timestampInfo.yearsDifference} years ago)
Historical period: ${timestampInfo.historicalPeriod}

【HISTORICAL BACKGROUND ANALYSIS REQUIREMENTS】
1. First, infer 3-5 important historical events or social phenomena based on the historical time point (${timestampInfo.historical.getFullYear()})
2. These historical events must have reasonable causal relationships with the case to be generated
3. The case background, motives, and character settings should be closely related to historical events
4. The influence of historical events should continue to the present and become the fundamental cause of the case

【CASE GENERATION REQUIREMENTS】
Strictly follow this JSON format and ensure the case is highly associated with historical background:

{
  "historicalContext": {
    "keyEvents": ["Historical event 1", "Historical event 2", "Historical event 3"],
    "relevance": "Explanation of relevance between historical events and the case"
  },
  "description": "Case overview description, must reflect historical background influence (string)",
  "victim": "Victim information, related to historical background (string)",
  "suspects": [
    {
      "id": "1 (string)",
      "name": "Suspect name (string)",
      "occupation": "Occupation, related to historical background (string)",
      "relationship": "Relationship to victim (string)",
      "motive": "Motive, related to historical events (string)",
      "alibi": "Alibi (string)"
    }
  ],
  "evidence": [
    {
      "id": "1 (string)",
      "name": "Evidence name (string)",
      "description": "Detailed description, may contain historical traces (string)",
      "location": "Location found (string)"
    }
  ],
  "solution": "Truth revelation, must specify the real culprit and explain historical origins (string)"
}

【IMPORTANT CREATIVE REQUIREMENTS】:
1. Must strictly follow the above JSON format, do not add any additional text
2. All fields must be string type
3. historicalContext section must accurately reflect the historical background of ${timestampInfo.historical.getFullYear()}
4. Case background must have reasonable causal relationships with historical events, not forced connections
5. Generate 3 suspects, each with complete background information related to historical background
6. Generate 3-4 key pieces of evidence, at least one directly related to historical background
7. Ensure logical consistency, clear historical timeline, natural connection between modern and historical
8. Solution must clearly specify the real culprit and explain historical origins
9. Avoid common mystery novel tropes, create unique plots combined with historical background
10. Character names and occupations should conform to historical era characteristics, avoid anachronisms

【HISTORICAL ASSOCIATION CREATIVE GUIDE】:
- How did events that occurred in ${timestampInfo.historical.getFullYear()} influence today's case?
- What direct or indirect relationships do victims or suspects have with historical events?
- Does it involve historical legacy issues, family feuds, or continuation of business disputes?
- Do the evidence include historical documents, old photos, expired contracts, or other historical evidence?
- Does the truth of the case reveal a complex story spanning ${timestampInfo.yearsDifference} years?

【CREATIVE DIRECTION SUGGESTIONS】:
Based on the characteristics of ${timestampInfo.historicalPeriod}, consider these elements:
- Impact of technological developments of that era on the present
- Modern consequences of business models or social phenomena of that time
- Modern inheritance or legacy disputes of historical figures
- Cross-era secrets, promises, or revenge plans
- Modern value of historical documents or evidence

Please create a completely new mystery case closely related to the historical background of ${timestampInfo.historical.getFullYear()} based on the above requirements.`;
};

const getOriginalPrompt = (language: Language): string => {
  return language === 'zh' ? 
    `你是一个专业的推理小说作家。请生成一个复杂的谋杀案件，严格按照以下JSON格式返回：

{
  "description": "案件概述描述 (string)",
  "victim": "受害者信息 (string)",
  "suspects": [
    {
      "id": "1 (string)",
      "name": "嫌疑人姓名 (string)",
      "occupation": "职业 (string)",
      "relationship": "与死者关系 (string)",
      "motive": "作案动机 (string)",
      "alibi": "不在场证明 (string)"
    }
  ],
  "evidence": [
    {
      "id": "1 (string)",
      "name": "证物名称 (string)",
      "description": "详细描述 (string)",
      "location": "发现地点 (string)"
    }
  ],
  "solution": "真相揭示，必须指定真正的凶手 (string)"
}

【重要创作要求】：
1. 必须严格按照上述JSON格式输出，不要添加任何额外的文字说明
2. 所有字段都必须是字符串(string)类型
3. 必须生成完全原创的内容，避免使用常见的推理小说套路
4. 案件背景必须具有独特性：选择不同寻常的场所、职业或情境
5. 生成3个嫌疑人，每个都有完整且独特的背景信息
6. 生成3-4个关键证据，每个证据都应该有独特的特征
7. 确保逻辑合理，线索丰富但不重复常见模式
8. solution中必须明确指定真正的凶手（从嫌疑人中选择）
9. 避免使用以下常见元素：艺术品收藏家、商业伙伴纠纷、遗产争夺、毒药投毒、密室杀人
10. 创新性要求：尝试不同的职业背景、不寻常的作案手法、独特的现场环境
11. 人物姓名必须多样化，避免使用约翰、艾米莉、马克、李华、王强等常见姓名
12. 证据类型要有创新性，避免使用破碎花瓶、神秘便条、指纹、DNA等常见证物
13. 避免生成与示例过于相似的内容，确保每次生成的案件都具有独创性

请基于以上要求，创造一个全新的、引人入胜的推理案件。` :
    `You are a professional mystery novel writer. Please generate a complex murder case strictly following this JSON format:

{
  "description": "Case overview description (string)",
  "victim": "Victim information (string)",
  "suspects": [
    {
      "id": "1 (string)",
      "name": "Suspect name (string)",
      "occupation": "Occupation (string)",
      "relationship": "Relationship to victim (string)",
      "motive": "Motive (string)",
      "alibi": "Alibi (string)"
    }
  ],
  "evidence": [
    {
      "id": "1 (string)",
      "name": "Evidence name (string)",
      "description": "Detailed description (string)",
      "location": "Location found (string)"
    }
  ],
  "solution": "Truth revelation, must specify the real culprit (string)"
}

【IMPORTANT CREATIVE REQUIREMENTS】:
1. Must strictly follow the above JSON format, do not add any additional text
2. All fields must be string type
3. Must generate completely original content, avoid common mystery novel tropes
4. Case background must be unique: choose unusual locations, professions, or situations
5. Generate 3 suspects, each with complete and unique background information
6. Generate 3-4 key pieces of evidence, each with distinctive characteristics
7. Ensure logical consistency and rich clues without repeating common patterns
8. Solution must clearly specify the real culprit (chosen from suspects)
9. Avoid using these common elements: art collectors, business partner disputes, inheritance fights, poison murders, locked room mysteries
10. Innovation requirements: try different professional backgrounds, unusual methods, unique crime scenes
11. Character names must be diverse, avoid common names like John, Emily, Mark, Li Hua, Wang Qiang
12. Evidence types should be innovative, avoid broken vases, mysterious notes, fingerprints, DNA, etc.
13. Avoid generating content too similar to examples, ensure each generated case has originality

Please create a completely new and compelling mystery case based on these requirements.`;
};
