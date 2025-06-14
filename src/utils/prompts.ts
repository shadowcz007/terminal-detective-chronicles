import { Language } from './i18n';
import { Suspect, GameState } from '../hooks/useGameState';

export const getCaseGenerationPrompt = (language: Language): string => {
  return language === 'zh' ? 
    `你是一个专业的推理小说作家。请生成一个复杂的谋杀案件，严格按照以下JSON格式返回：

{
  "description": "一位著名的艺术品收藏家在自己的豪宅书房中被发现死亡，现场留下了神秘的线索",
  "victim": "约翰·威廉姆斯，65岁，著名艺术品收藏家和画廊老板",
  "suspects": [
    {
      "id": "1",
      "name": "艾米莉·威廉姆斯",
      "occupation": "艺术史学者",
      "relationship": "死者的女儿",
      "motive": "继承遗产，与父亲在艺术品处理上有分歧",
      "alibi": "声称案发时在图书馆研究，但无人证实"
    },
    {
      "id": "2",
      "name": "马克·汤普森",
      "occupation": "艺术品鉴定师",
      "relationship": "死者的商业伙伴",
      "motive": "商业纠纷，怀疑死者出售赝品损害声誉",
      "alibi": "声称在家中整理文件，妻子可以作证"
    },
    {
      "id": "3",
      "name": "莎拉·陈",
      "occupation": "私人助理",
      "relationship": "死者的贴身助理",
      "motive": "发现死者的非法交易，担心被牵连",
      "alibi": "声称早退回家照顾生病的母亲"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "破碎的古董花瓶",
      "description": "一个价值连城的明代花瓶碎片散落在书房地板上，似乎是搏斗中被打破",
      "location": "书房地板"
    },
    {
      "id": "2",
      "name": "神秘的便条",
      "description": "一张写着'你知道真相'的便条，字迹潦草，疑似匆忙写下",
      "location": "死者桌案上"
    },
    {
      "id": "3",
      "name": "沾血的艺术品目录",
      "description": "一本翻开的艺术品拍卖目录，某页上有血迹，标记着一件失窃的名画",
      "location": "死者手边"
    },
    {
      "id": "4",
      "name": "监控录像",
      "description": "显示案发前两小时内有三人先后进入豪宅，但画面在关键时刻出现异常",
      "location": "豪宅安保系统"
    }
  ],
  "solution": "真相：马克·汤普森是真正的凶手。他发现约翰在出售赝品并将责任推给他，导致自己的职业声誉受损。当晚他前来对质，争执中失手杀死了约翰，然后伪造现场企图嫁祸给艾米莉。他利用自己对豪宅的熟悉程度篡改了监控录像的时间戳。"
}

要求：
1. 必须严格按照上述JSON格式输出，不要添加任何额外的文字说明
2. 生成3个嫌疑人，每个都有完整的信息
3. 生成3-4个关键证据
4. 确保逻辑合理，线索丰富
5. solution中必须指定真正的凶手（从嫌疑人中选择）
6. 参考示例的详细程度和复杂性
7. 创造富有挑战性的推理情节` :
    `You are a professional mystery novel writer. Please generate a complex murder case strictly following this JSON format:

{
  "description": "A famous art collector was found dead in the study of his mansion, with mysterious clues left at the scene",
  "victim": "John Williams, 65, renowned art collector and gallery owner",
  "suspects": [
    {
      "id": "1",
      "name": "Emily Williams",
      "occupation": "Art historian",
      "relationship": "Victim's daughter",
      "motive": "Inheritance dispute and disagreement over art handling",
      "alibi": "Claims to have been researching at the library, but no witnesses"
    },
    {
      "id": "2",
      "name": "Mark Thompson",
      "occupation": "Art appraiser",
      "relationship": "Victim's business partner",
      "motive": "Business dispute, suspected victim of selling forgeries damaging reputation",
      "alibi": "Claims to have been organizing documents at home, wife can testify"
    },
    {
      "id": "3",
      "name": "Sarah Chen",
      "occupation": "Personal assistant",
      "relationship": "Victim's personal assistant",
      "motive": "Discovered victim's illegal transactions, worried about being implicated",
      "alibi": "Claims to have left early to care for sick mother"
    }
  ],
  "evidence": [
    {
      "id": "1",
      "name": "Broken antique vase",
      "description": "Fragments of a priceless Ming Dynasty vase scattered on the study floor, seemingly broken during a struggle",
      "location": "Study floor"
    },
    {
      "id": "2",
      "name": "Mysterious note",
      "description": "A hastily written note saying 'You know the truth', with messy handwriting",
      "location": "On victim's desk"
    },
    {
      "id": "3",
      "name": "Bloodstained art catalog",
      "description": "An open art auction catalog with blood stains on a page marking a stolen famous painting",
      "location": "Next to victim"
    },
    {
      "id": "4",
      "name": "Security footage",
      "description": "Shows three people entering the mansion within two hours before the incident, but footage shows anomalies at crucial moments",
      "location": "Mansion security system"
    }
  ],
  "solution": "Truth: Mark Thompson is the real killer. He discovered John was selling forgeries and pushing the blame onto him, damaging his professional reputation. He came to confront John that night, accidentally killed him during the argument, then staged the scene to frame Emily. He used his familiarity with the mansion to tamper with the surveillance footage timestamps."
}

Requirements:
1.  Must strictly follow the above JSON format, do not add any additional text
2. Generate 3 suspects, each with complete information
3. Generate 3-4 key pieces of evidence
4. Ensure logical consistency and rich clues
5. Solution must specify the real culprit (chosen from suspects)
6. Follow the example's level of detail and complexity
7. Create challenging detective scenarios`;
};

export const getInterrogationPrompt = (suspect: Suspect, gameState: GameState, language: Language): string => {
  return language === 'zh' ?
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
};
