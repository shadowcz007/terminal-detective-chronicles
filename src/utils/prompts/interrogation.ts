
import { Language } from '../i18n';
import { Suspect, GameState } from '../../hooks/useGameState';

// 生成嫌疑人心理状态描述
const generatePsychologicalProfile = (suspect: Suspect, language: Language): string => {
  const profiles = {
    zh: {
      职员: '谨慎保守，习惯按规矩办事，面对质疑时容易紧张',
      医生: '理性冷静，善于分析，但可能隐藏专业秘密',
      教师: '善于表达，逻辑清晰，但在道德压力下可能露馅',
      商人: '圆滑世故，善于转移话题，习惯性撒谎掩盖真相',
      律师: '机敏谨慎，精通法律漏洞，不轻易承认任何指控',
      艺术家: '情绪化，创意思维，可能因冲动做出不理性行为',
      工程师: '逻辑严密，事实导向，但可能过于自信暴露破绽',
      记者: '敏锐观察，善于挖掘真相，但也可能隐瞒消息来源'
    },
    en: {
      employee: 'Cautious and conservative, follows rules, becomes nervous when questioned',
      doctor: 'Rational and calm, analytical, but may hide professional secrets',
      teacher: 'Articulate and logical, but may crack under moral pressure',
      businessman: 'Smooth and worldly, deflects topics, habitually lies to cover truth',
      lawyer: 'Sharp and cautious, knows legal loopholes, won\'t admit to charges easily',
      artist: 'Emotional and creative, may act irrationally on impulse',
      engineer: 'Logically rigorous, fact-oriented, but overconfidence may expose flaws',
      journalist: 'Keen observer, good at uncovering truth, but may hide sources'
    }
  };
  
  return profiles[language][suspect.occupation as keyof typeof profiles[typeof language]] || 
         (language === 'zh' ? '普通人格，在压力下可能表现不一致' : 'Average personality, may be inconsistent under pressure');
};

// 生成审问环境描述
const generateInterrogationEnvironment = (language: Language): string => {
  const environments = {
    zh: [
      '昏暗的审讯室内，只有一盏强光灯照在嫌疑人脸上',
      '警局的会议室，气氛严肃，墙上挂着法律条文',
      '安静的办公室，窗外传来微弱的街道噪音',
      '简陋的审讯室，桌子上放着录音设备',
      '明亮的调查室，桌上摆放着相关证据材料'
    ],
    en: [
      'In a dim interrogation room, only a bright lamp shines on the suspect\'s face',
      'Police station meeting room, serious atmosphere, legal documents on the wall',
      'Quiet office, faint street noise coming through the window',
      'Simple interrogation room with recording equipment on the table',
      'Bright investigation room with relevant evidence materials on the desk'
    ]
  };
  
  return environments[language][Math.floor(Math.random() * environments[language].length)];
};

// 生成个性化问题
const generatePersonalizedQuestions = (suspect: Suspect, gameState: GameState, language: Language): string => {
  const baseQuestions = language === 'zh' ? [
    `你在案发时间${new Date().toLocaleTimeString()}究竟在哪里？`,
    `你和${gameState.victim}最后一次见面的具体情况是什么？`,
    `关于${suspect.motive.substring(0, 20)}...这个动机，你有什么要解释的吗？`,
    `你的不在场证明中提到${suspect.alibi.substring(0, 15)}...有人能证实这一点吗？`
  ] : [
    `Where exactly were you at the time of incident ${new Date().toLocaleTimeString()}?`,
    `What were the specific circumstances of your last meeting with ${gameState.victim}?`,
    `Regarding the motive about ${suspect.motive.substring(0, 20)}... what do you have to explain?`,
    `Your alibi mentions ${suspect.alibi.substring(0, 15)}... can anyone verify this?`
  ];
  
  return baseQuestions.join('\n');
};

export const getInterrogationPrompt = (suspect: Suspect, gameState: GameState, language: Language): string => {
  // 生成唯一标识符
  const timestamp = new Date().toISOString();
  const sessionId = `INT_${suspect.id}_${Date.now()}`;
  const interrogationCount = Math.floor(Math.random() * 3) + 1; // 模拟审问次数
  
  // 获取心理描述、环境和个性化问题
  const psychProfile = generatePsychologicalProfile(suspect, language);
  const environment = generateInterrogationEnvironment(language);
  const personalizedQuestions = generatePersonalizedQuestions(suspect, gameState, language);
  
  // 获取凶手身份锁定信息
  const { getCulpritLock, getCulpritConstraintPrompt } = require('../culpritLock');
  const culpritLock = getCulpritLock(gameState.caseId);
  const culpritConstraint = culpritLock ? getCulpritConstraintPrompt(culpritLock, language) : '';
  
  // 判断当前嫌疑人是否为真凶
  const isRealCulprit = culpritLock && culpritLock.culpritId === suspect.id;
  
  return language === 'zh' ?
    `【审讯记录 - 会话ID: ${sessionId}】
时间戳: ${timestamp}
第 ${interrogationCount} 次审问

${culpritConstraint}

案件背景：${gameState.caseDescription}
受害者：${gameState.victim}
审问环境：${environment}

被审讯人档案：
- 姓名：${suspect.name}
- 职业：${suspect.occupation}  
- 与死者关系：${suspect.relationship}
- 涉案动机：${suspect.motive}
- 声称的不在场证明：${suspect.alibi}
- 心理特征：${psychProfile}
- 身份状态：${isRealCulprit ? '⚠️ 真凶' : '✓ 无辜嫌疑人'}

角色扮演指导：
你现在要扮演嫌疑人${suspect.name}，一个${suspect.occupation}。你的性格特征是：${psychProfile}。
${isRealCulprit ? 
  `⚠️ 你是真正的凶手，必须：
  - 隐瞒真相但不能完全否认所有指控
  - 在压力下可能露出破绽或矛盾
  - 表现出内疚、紧张或防御性的心理状态
  - 试图转移话题或推卸责任
  - 对关键证据表现出异常的反应` :
  `✓ 你是无辜的，必须：
  - 诚实回答问题，但可能对某些细节记忆模糊
  - 表现出被冤枉的愤怒或困惑
  - 主动提供可能有用的线索
  - 对真凶的行为表示震惊或不理解
  - 配合调查，希望尽快澄清真相`}

你可能会：
- 根据自己的心理特征表现出相应的情绪反应
- 有选择性地透露信息
- 在某些敏感问题上撒谎或回避
- 显示出与你职业和背景相符的说话方式

针对性审问问题：
${personalizedQuestions}

请以第一人称的角度，用${suspect.name}的身份和性格来回答这些问题。回答要体现出你的职业特点、心理状态，以及对案件的真实态度。` :
    `【Interrogation Record - Session ID: ${sessionId}】
Timestamp: ${timestamp}
Interrogation #${interrogationCount}

${culpritConstraint}

Case Background: ${gameState.caseDescription}
Victim: ${gameState.victim}
Interrogation Environment: ${environment}

Subject Profile:
- Name: ${suspect.name}
- Occupation: ${suspect.occupation}
- Relationship with deceased: ${suspect.relationship}
- Suspected motive: ${suspect.motive}
- Claimed alibi: ${suspect.alibi}
- Psychological traits: ${psychProfile}
- Identity Status: ${isRealCulprit ? '⚠️ Real Culprit' : '✓ Innocent Suspect'}

Role-playing Instructions:
You are now playing ${suspect.name}, a ${suspect.occupation}. Your personality traits are: ${psychProfile}.
${isRealCulprit ? 
  `⚠️ You are the real culprit and must:
  - Hide the truth but cannot completely deny all accusations
  - May show flaws or contradictions under pressure
  - Display guilt, nervousness, or defensive psychological state
  - Try to deflect topics or shift blame
  - Show abnormal reactions to key evidence` :
  `✓ You are innocent and must:
  - Answer questions honestly, but may have fuzzy memory of some details
  - Show anger or confusion at being wrongly accused
  - Proactively provide potentially useful clues
  - Express shock or incomprehension at the real culprit's actions
  - Cooperate with investigation, hoping to clear your name quickly`}

You might:
- Show emotional reactions consistent with your psychological traits
- Selectively reveal information
- Lie or evade sensitive questions
- Display speech patterns consistent with your profession and background

Targeted Questions:
${personalizedQuestions}

Please respond in first person as ${suspect.name}, reflecting your identity and personality. Your answers should demonstrate your professional characteristics, psychological state, and true attitude toward the case.`;
};
