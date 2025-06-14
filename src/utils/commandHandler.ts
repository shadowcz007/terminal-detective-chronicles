import { GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { generateCase, interrogateSuspect, generateCrimeScene } from './aiService';

export const executeCommand = async (
  command: string, 
  gameState: GameState, 
  updateGameState: (updates: Partial<GameState>) => void,
  updateApiConfig: (config: Partial<GameState['apiConfig']>) => void,
  onStreamToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<string> => {
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      return t('help', language);

    case 'lang':
      // 语言切换命令 - 这个实际上由Terminal组件处理，这里只是返回确认信息
      return t('languageSwitched', language);

    case 'status':
      if (!gameState.caseId) {
        return t('noActiveCase', language);
      }
      
      const statusText = language === 'zh' ? `
=== 案件状态 ===
案件ID: #${gameState.caseId}
案件描述: ${gameState.caseDescription}
受害者: ${gameState.victim}
嫌疑人数量: ${gameState.suspects.length}
证据数量: ${gameState.evidence.length}
当前审问: ${gameState.currentInterrogation ? '进行中' : '无'}

进度统计:
- 已审问嫌疑人: ${gameState.suspects.filter(s => s.id === gameState.currentInterrogation).length}/${gameState.suspects.length}
- 收集证据: ${gameState.evidence.length}个` : `
=== Case Status ===
Case ID: #${gameState.caseId}
Case Description: ${gameState.caseDescription}
Victim: ${gameState.victim}
Number of Suspects: ${gameState.suspects.length}
Number of Evidence: ${gameState.evidence.length}
Current Interrogation: ${gameState.currentInterrogation ? 'In Progress' : 'None'}

Progress Statistics:
- Interrogated Suspects: ${gameState.suspects.filter(s => s.id === gameState.currentInterrogation).length}/${gameState.suspects.length}
- Collected Evidence: ${gameState.evidence.length} items`;
      
      return statusText;

    case 'clear_case':
      if (!gameState.caseId) {
        return language === 'zh' ? '当前没有案件需要清除' : 'No case to clear currently';
      }
      
      // 清除案件数据但保留API配置
      updateGameState({
        caseId: '',
        caseDescription: '',
        victim: '',
        suspects: [],
        evidence: [],
        solution: '',
        currentInterrogation: undefined
      });
      
      return t('caseCleared', language);

    case 'new_case':
      try {
        const caseData = await generateCase(gameState.apiConfig, onStreamToken, language);
        updateGameState(caseData);
        
        // 生成详细的案件信息显示 - 使用翻译
        let caseInfo = `
${t('newCaseFile', language)}
${t('caseId', language)}: #${caseData.caseId}
${t('overview', language)}: ${caseData.caseDescription}
${t('victim', language)}: ${caseData.victim}

${t('suspectsOverview', language)}`;
        
        caseData.suspects?.forEach((suspect, index) => {
          caseInfo += `\n[${index + 1}] ${suspect.name} - ${suspect.occupation}`;
          caseInfo += `\n    ${t('relationship', language)}: ${suspect.relationship}`;
        });
        
        caseInfo += `\n\n${t('initialEvidence', language)}`;
        caseData.evidence?.forEach((evidence, index) => {
          caseInfo += `\n[${index + 1}] ${evidence.name}`;
          caseInfo += `\n    ${t('location', language)}: ${evidence.location}`;
        });
        
        return caseInfo;
      } catch (error) {
        const errorMsg = language === 'zh' ? 
          `案件生成失败: ${error instanceof Error ? error.message : '未知错误'}` :
          `Case generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        return errorMsg;
      }

    case 'list_suspects':
      if (gameState.suspects.length === 0) {
        return t('noActiveCase', language);
      }
      
      let suspectList = `\n${t('suspectList', language)}\n`;
      gameState.suspects.forEach((suspect, index) => {
        suspectList += `[${index + 1}] ${suspect.name} - ${suspect.occupation}\n`;
        suspectList += `    ${language === 'zh' ? '与死者关系' : 'Relationship with victim'}: ${suspect.relationship}\n`;
        suspectList += `    ${language === 'zh' ? '表面动机' : 'Apparent motive'}: ${suspect.motive.substring(0, 30)}...\n\n`;
      });
      return suspectList;

    case 'evidence':
      if (gameState.evidence.length === 0) {
        return t('noActiveCase', language);
      }
      
      let evidenceList = `\n${t('evidenceFiles', language)}\n`;
      gameState.evidence.forEach((evidence, index) => {
        evidenceList += `[${index + 1}] ${evidence.name}\n`;
        evidenceList += `    ${language === 'zh' ? '发现地点' : 'Location found'}: ${evidence.location}\n`;
        evidenceList += `    ${language === 'zh' ? '描述' : 'Description'}: ${evidence.description}\n\n`;
      });
      return evidenceList;

    case 'interrogate':
      const suspectIndex = parseInt(args[0]) - 1;
      if (isNaN(suspectIndex) || !gameState.suspects[suspectIndex]) {
        return language === 'zh' ? '请指定有效的嫌疑人编号，例如: interrogate 1' : 'Please specify a valid suspect ID, e.g., interrogate 1.';
      }
      
      try {
        const suspect = gameState.suspects[suspectIndex];
        updateGameState({ currentInterrogation: suspect.id });
        
        if (onStreamToken) {
          // 如果支持流式输出，不返回额外信息，让流式输出自然完成
          await interrogateSuspect(suspect, gameState, onStreamToken);
          return ''; // 返回空字符串，避免重复显示
        } else {
          // 非流式模式
          const interrogationResult = await interrogateSuspect(suspect, gameState);
          return `
${t('interrogationRecord', language, { name: suspect.name })}
${interrogationResult}

${language === 'zh' ? '提示: 注意观察回答中的矛盾和可疑之处\n输入其他命令继续调查，或审问其他嫌疑人' : 'Tip: Watch for contradictions and suspicious elements in the responses\nEnter other commands to continue investigation, or interrogate other suspects'}
`;
        }
      } catch (error) {
        return language === 'zh' ? `审问失败: ${error instanceof Error ? error.message : '未知错误'}` : `Interrogation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

    case 'recreate':
      if (!gameState.caseDescription) {
        return language === 'zh' ? '请先生成案件才能重现犯罪现场' : 'Please generate a case first to recreate the crime scene.';
      }
      
      try {
        const crimeScene = await generateCrimeScene(gameState, onStreamToken);
        return `
${t('crimeSceneRecreation', language)}
${crimeScene}

${language === 'zh' ? '分析现场细节，寻找可疑之处...' : 'Analyze scene details, look for suspicious elements...'}
`;
      } catch (error) {
        return language === 'zh' ? `现场重现失败: ${error instanceof Error ? error.message : '未知错误'}` : `Scene recreation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

    case 'submit':
      const submitIndex = parseInt(args[0]) - 1;
      if (isNaN(submitIndex) || !gameState.suspects[submitIndex]) {
        return language === 'zh' ? '请指定要指控的嫌疑人编号，例如: submit 2' : 'Please specify the suspect ID to accuse, e.g., submit 2.';
      }
      
      const accusedSuspect = gameState.suspects[submitIndex];
      const isCorrect = accusedSuspect.id === gameState.solution;
      
      if (isCorrect) {
        return language === 'zh' ? `
🎉 恭喜！推理正确！

${accusedSuspect.name} 确实是凶手！
真相: ${accusedSuspect.motive}

案件已结案。输入 'new_case' 开始新的挑战。
` : `
🎉 Congratulations! Correct deduction!

${accusedSuspect.name} is indeed the killer!
Truth: ${accusedSuspect.motive}

Case closed. Type 'new_case' to start a new challenge.
`;
      } else {
        return language === 'zh' ? `
❌ 推理错误！

${accusedSuspect.name} 不是真凶。
请重新审视证据和嫌疑人的证词，寻找真正的线索。

输入 'interrogate [ID]' 继续调查
` : `
❌ Incorrect deduction!

${accusedSuspect.name} is not the real killer.
Please re-examine the evidence and suspects' testimonies for real clues.

Type 'interrogate [ID]' to continue investigation
`;
      }

    case 'config':
      if (args.length === 0) {
        // 显示当前配置
        const { apiConfig } = gameState;
        const maskedKey = apiConfig.key ? `${apiConfig.key.substring(0, 10)}...` : '未设置';
        return `
=== API 配置 ===
端点: ${apiConfig.url}
模型: ${apiConfig.model}
密钥: ${maskedKey}

使用方法:
  config url <API端点>    - 设置API端点
  config key <API密钥>    - 设置API密钥
  config model <模型名>   - 设置模型

常用配置示例:
  config url https://api.openai.com/v1/chat/completions
  config key sk-xxx...
  config model gpt-3.5-turbo

提示: ${apiConfig.key ? '✅ 已配置API密钥，将使用真实AI' : '⚠️ 未配置API密钥，当前使用模拟AI'}
`;
      } else {
        // 设置配置 - 严格按照用户输入，不处理大小写
        const configType = args[0];
        const configValue = args.slice(1);
        const value = configValue.join(' ');
        
        switch (configType) {
          case 'url':
            if (!value) return 'API端点不能为空';
            updateApiConfig({ url: value });
            return `API端点已设置为: ${value}`;
            
          case 'key':
            if (!value) return 'API密钥不能为空';
            updateApiConfig({ key: value });
            return `API密钥已设置 (${value.substring(0, 10)}...)`;
            
          case 'model':
            if (!value) return '模型名不能为空';
            updateApiConfig({ model: value });
            return `模型已设置为: ${value}`;
            
          default:
            return `未知配置项: ${configType}. 支持的配置项: url, key, model`;
        }
      }

    case 'clear':
      return '\n'.repeat(50) + (language === 'zh' ? '终端已清空' : 'Terminal cleared');

    case 'exit':
      return language === 'zh' ? '感谢使用AI侦探终端系统。再见！' : 'Thank you for using AI Detective Terminal System. Goodbye!';

    default:
      return t('unknownCommand', language, { cmd });
  }
};
