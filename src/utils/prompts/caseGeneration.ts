
import { Language } from '../i18n';

export const getCaseGenerationPrompt = (language: Language): string => {
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

【禁用元素列表】：
- 常见职业：医生、律师、秘书、管家、厨师
- 常见地点：豪宅、办公室、医院、酒店
- 常见动机：金钱、复仇、嫉妒、遗产
- 常见证物：刀具、绳索、毒药、血迹
- 常见手法：下毒、勒死、刺杀、推下高楼

【创意方向建议】：
- 现代科技背景：AI研发、区块链、虚拟现实、生物技术
- 特殊职业环境：极地科考、深海探索、航天工程、考古发掘
- 新兴社会现象：网红经济、电竞产业、共享经济、环保运动
- 独特现场环境：实验室、数据中心、艺术工作室、健身房
- 创新证据类型：数字痕迹、生物样本、环境数据、行为模式

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

【FORBIDDEN ELEMENTS LIST】:
- Common occupations: doctor, lawyer, secretary, butler, chef
- Common locations: mansion, office, hospital, hotel
- Common motives: money, revenge, jealousy, inheritance
- Common evidence: weapons, rope, poison, bloodstains
- Common methods: poisoning, strangling, stabbing, pushing from height

【CREATIVE DIRECTION SUGGESTIONS】:
- Modern tech backgrounds: AI development, blockchain, virtual reality, biotechnology
- Special professional environments: polar research, deep sea exploration, aerospace engineering, archaeological excavation
- Emerging social phenomena: influencer economy, esports industry, sharing economy, environmental movement
- Unique crime scenes: laboratories, data centers, art studios, gyms
- Innovative evidence types: digital traces, biological samples, environmental data, behavioral patterns

Please create a completely new and compelling mystery case based on these requirements.`;
};
