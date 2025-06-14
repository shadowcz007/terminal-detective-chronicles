
import { Suspect, GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { createSingleLineStreamingEffect } from '../utils/gameFragments';
import { llmRequest } from './llmClient';

export const interrogateSuspect = async (
  suspect: Suspect, 
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
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
    onToken(t('startInterrogation', language, { name: suspect.name }));
    
    // 启动混淆的单行流式效果
    const streamingPromise = createSingleLineStreamingEffect(
      (text: string, isComplete: boolean) => {
        if (isComplete) {
          onToken(t('startRecording', language));
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
    const hintMsg = t('interrogationTip', language);
    onToken(`\n\n${hintMsg}\n`);
    
    return response;
  } else {
    // 非流式模式
    return await llmRequest(promptText, gameState.apiConfig);
  }
};
