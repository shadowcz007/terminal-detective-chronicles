
import { Language } from '../i18n';
import { Suspect, GameState } from '../../hooks/useGameState';

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
