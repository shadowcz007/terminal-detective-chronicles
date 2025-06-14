
import { Language } from '../i18n';

export const getCaseGenerationPrompt = (language: Language): string => {
  return language === 'zh' ? 
    `你是一个专业的推理小说作家。请生成一个复杂的谋杀案件，严格按照以下JSON格式返回：

{
  "description": "案件概述描述",
  "victim": "受害者信息",
  "suspects": [
    {
      "id": "1",
      "name": "嫌疑人姓名",
      "occupation": "职业",
      "relationship": "与死者关系",
      "motive": "作案动机",
      "alibi": "不在场证明"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "证物名称",
      "description": "详细描述",
      "location": "发现地点"
    }
  ],
  "solution": "真相揭示，必须指定真正的凶手"
}

【重要创作要求】：
1. 必须严格按照上述JSON格式输出，不要添加任何额外的文字说明
2. 必须生成完全原创的内容，避免使用常见的推理小说套路
3. 案件背景必须具有独特性：选择不同寻常的场所、职业或情境
4. 生成3个嫌疑人，每个都有完整且独特的背景信息
5. 生成3-4个关键证据，每个证据都应该有独特的特征
6. 确保逻辑合理，线索丰富但不重复常见模式
7. solution中必须明确指定真正的凶手（从嫌疑人中选择）
8. 避免使用以下常见元素：艺术品收藏家、商业伙伴纠纷、遗产争夺
9. 创新性要求：尝试不同的职业背景、不寻常的作案手法、独特的现场环境
10. 人物姓名必须多样化，避免使用约翰、艾米莉、马克等常见英文名
11. 证据类型要有创新性，避免使用破碎花瓶、神秘便条等常见证物

【创意方向建议】：
- 可以考虑科技行业、医疗领域、教育机构、娱乐圈等不同背景
- 探索现代社交媒体、数字化证据、新兴技术等元素
- 尝试不同的人际关系网络和动机类型
- 创造独特的现场环境和作案手法

请基于以上要求，创造一个全新的、引人入胜的推理案件。` :
    `You are a professional mystery novel writer. Please generate a complex murder case strictly following this JSON format:

{
  "description": "Case overview description",
  "victim": "Victim information",
  "suspects": [
    {
      "id": "1",
      "name": "Suspect name",
      "occupation": "Occupation",
      "relationship": "Relationship to victim",
      "motive": "Motive",
      "alibi": "Alibi"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "Evidence name",
      "description": "Detailed description",
      "location": "Location found"
    }
  ],
  "solution": "Truth revelation, must specify the real culprit"
}

【IMPORTANT CREATIVE REQUIREMENTS】:
1. Must strictly follow the above JSON format, do not add any additional text
2. Must generate completely original content, avoid common mystery novel tropes
3. Case background must be unique: choose unusual locations, professions, or situations
4. Generate 3 suspects, each with complete and unique background information
5. Generate 3-4 key pieces of evidence, each with distinctive characteristics
6. Ensure logical consistency and rich clues without repeating common patterns
7. Solution must clearly specify the real culprit (chosen from suspects)
8. Avoid using these common elements: art collectors, business partner disputes, inheritance fights
9. Innovation requirements: try different professional backgrounds, unusual methods, unique crime scenes
10. Character names must be diverse, avoid common names like John, Emily, Mark
11. Evidence types should be innovative, avoid broken vases, mysterious notes, etc.

【CREATIVE DIRECTION SUGGESTIONS】:
- Consider tech industry, medical field, educational institutions, entertainment industry backgrounds
- Explore modern social media, digital evidence, emerging technology elements
- Try different interpersonal networks and motive types
- Create unique crime scenes and methods

Please create a completely new and compelling mystery case based on these requirements.`;
};
