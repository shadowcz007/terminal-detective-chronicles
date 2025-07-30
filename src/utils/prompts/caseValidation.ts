import { Language } from '../i18n';
import { GameState } from '../../types/gameTypes';

// 案件逻辑一致性验证
export interface CaseValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// 验证案件逻辑一致性
export const validateCaseLogic = (caseData: Partial<GameState>, language: Language): CaseValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // 1. 验证凶手身份明确性
  if (!caseData.solution || !caseData.suspects) {
    errors.push(language === 'zh' ? '案件缺少明确的凶手身份' : 'Case lacks clear culprit identity');
  } else {
    const culpritName = extractCulpritName(caseData.solution);
    const culpritExists = caseData.suspects.some(s => s.name.includes(culpritName));
    if (!culpritExists) {
      errors.push(language === 'zh' ? '凶手不在嫌疑人列表中' : 'Culprit not in suspect list');
    }
  }

  // 2. 验证动机合理性
  if (caseData.suspects) {
    caseData.suspects.forEach((suspect, index) => {
      if (!suspect.motive || suspect.motive.length < 20) {
        warnings.push(language === 'zh' ? 
          `嫌疑人${suspect.name}的动机描述过于简单` : 
          `Suspect ${suspect.name}'s motive is too simple`);
      }
    });
  }

  // 3. 验证证据关联性
  if (caseData.evidence && caseData.suspects) {
    const evidenceCount = caseData.evidence.length;
    const suspectCount = caseData.suspects.length;
    
    if (evidenceCount < suspectCount) {
      warnings.push(language === 'zh' ? 
        '证据数量少于嫌疑人数量，可能导致推理困难' : 
        'Evidence count less than suspect count, may cause reasoning difficulty');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// 从solution中提取凶手姓名
const extractCulpritName = (solution: string): string => {
  // 使用正则表达式提取姓名
  const namePatterns = [
    /凶手是(.+?)(?:[，。]|$)/,
    /真正的凶手是(.+?)(?:[，。]|$)/,
    /The killer is (.+?)(?:[,.]|$)/,
    /The real culprit is (.+?)(?:[,.]|$)/
  ];

  for (const pattern of namePatterns) {
    const match = solution.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return '';
};

// 生成案件一致性增强提示词
export const getCaseConsistencyPrompt = (language: Language): string => {
  return language === 'zh' ? `
【案件一致性要求】
1. 凶手身份必须在嫌疑人列表中，且在整个案件中保持不变
2. 每个嫌疑人的动机必须与其背景、职业、关系相符
3. 证据必须形成完整的证据链，指向唯一真相
4. 不在场证明必须可验证，且存在破绽或证实的可能
5. 案件时间线必须逻辑清晰，无矛盾之处

【逻辑验证检查点】
- 凶手的作案手法是否与其身份、能力相符？
- 证据是否能够排除其他嫌疑人？
- 时间线是否允许凶手完成作案？
- 动机是否足够强烈到促使杀人？
- 现场布置是否符合凶手的心理状态？
` : `
【CASE CONSISTENCY REQUIREMENTS】
1. Culprit identity must be in suspect list and remain unchanged throughout
2. Each suspect's motive must match their background, profession, and relationship
3. Evidence must form complete chain pointing to unique truth
4. Alibis must be verifiable with potential flaws or confirmation
5. Case timeline must be logically clear without contradictions

【LOGIC VERIFICATION CHECKPOINTS】
- Does culprit's method match their identity and capabilities?
- Can evidence eliminate other suspects?
- Does timeline allow culprit to complete the crime?
- Is motive strong enough to drive murder?
- Does scene setup match culprit's psychological state?
`;
};