import { GameState } from '../types/gameTypes';
import { Language, t } from './i18n';
import { generateCase, interrogateSuspect, generateCrimeScene } from './aiService';
import { handleDifficultyCommands } from '../commands/difficultyCommands';
import { handleProgressCommands } from '../commands/progressCommands';
import { ProgressManager } from '../features/progress/progressManager';
import { formatCaseAsMarkdown, downloadMarkdownFile } from './exportUtils';

// 游戏状态跟踪（用于记录开始时间等）
let gameStartTime: number | null = null;
let interrogationCount = 0;
let wrongGuessCount = 0;

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

  // 处理难度相关命令
  const difficultyResult = handleDifficultyCommands(cmd, args, gameState, updateGameState, language);
  if (difficultyResult) return difficultyResult;

  // 处理进度相关命令
  const progressResult = handleProgressCommands(cmd, args, gameState, updateGameState, language);
  if (progressResult) return progressResult;

  switch (cmd) {
    case 'export_case':
      if (!gameState.caseId) {
        return t('noActiveCase', language);
      }
      
      try {
        const markdownContent = formatCaseAsMarkdown(gameState, language);
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `case_${gameState.caseId}_${timestamp}.md`;
        
        downloadMarkdownFile(markdownContent, filename);
        
        return language === 'zh' ? 
          `📄 案件档案已导出为 ${filename}\n🔽 文件已自动下载到您的下载文件夹` :
          `📄 Case file exported as ${filename}\n🔽 File automatically downloaded to your downloads folder`;
      } catch (error) {
        return language === 'zh' ?
          `❌ 导出失败: ${error instanceof Error ? error.message : '未知错误'}` :
          `❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

    case 'help':
      return language === 'zh' ? `
可用命令：
  new_case       - 生成新案件
  list_suspects  - 显示嫌疑人名单
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  evidence       - 查看证据档案
  recreate       - 生成犯罪现场重现
  submit [嫌疑人ID] - 提交最终结论
  export_case    - 导出案件信息为MD文档
  status         - 查看当前案件状态
  clear_case     - 清除当前案件数据
  difficulty     - 查看/设置游戏难度
  records        - 查看通关记录
  achievements   - 查看成就系统
  stats          - 查看游戏统计
  reset_progress - 重置游戏进度
  config         - 查看/修改API设置
  lang           - 切换语言 (中/英文)
  clear          - 清空终端  
  exit           - 退出系统
` : `
Available Commands:
  new_case       - Generate new case
  list_suspects  - Display suspect list
  interrogate [ID] - Interrogate suspect (e.g: interrogate 1)
  evidence       - View evidence files
  recreate       - Generate crime scene recreation
  submit [Suspect ID] - Submit final conclusion
  export_case    - Export case information as MD document
  status         - Check current case status
  clear_case     - Clear current case data
  difficulty     - View/set game difficulty
  records        - View completion records
  achievements   - View achievement system
  stats          - View game statistics
  reset_progress - Reset game progress
  config         - View/modify API settings
  lang           - Switch language (Chinese/English)
  clear          - Clear terminal
  exit           - Exit system
`;

    case 'status':
      if (!gameState.caseId) {
        return t('noActiveCase', language);
      }
      
      const statusText = t('caseStatus', language, {
        caseId: gameState.caseId,
        description: gameState.caseDescription,
        victim: gameState.victim,
        suspectCount: gameState.suspects.length.toString(),
        evidenceCount: gameState.evidence.length.toString(),
        currentInterrogation: gameState.currentInterrogation ? t('inProgress', language) : t('none', language),
        interrogatedCount: gameState.suspects.filter(s => s.id === gameState.currentInterrogation).length.toString(),
        totalSuspects: gameState.suspects.length.toString()
      });
      
      return statusText;

    case 'clear_case':
      if (!gameState.caseId) {
        return t('noCurrentCase', language);
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
        // 重置游戏计时和计数器
        gameStartTime = Date.now();
        interrogationCount = 0;
        wrongGuessCount = 0;
        
        const caseData = await generateCase(gameState.apiConfig, onStreamToken, language, gameState.difficulty.level);
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
        return t('caseGenerationFailed', language, {
          error: error instanceof Error ? error.message : t('unknownError', language)
        });
      }

    case 'list_suspects':
      if (gameState.suspects.length === 0) {
        return t('noActiveCase', language);
      }
      
      let suspectList = `\n${t('suspectList', language)}\n`;
      gameState.suspects.forEach((suspect, index) => {
        suspectList += `[${index + 1}] ${suspect.name} - ${suspect.occupation}\n`;
        suspectList += `    ${t('relationshipWithVictim', language)}: ${suspect.relationship}\n`;
        suspectList += `    ${t('apparentMotive', language)}: ${suspect.motive.substring(0, 30)}...\n\n`;
      });
      return suspectList;

    case 'evidence':
      if (gameState.evidence.length === 0) {
        return t('noActiveCase', language);
      }
      
      let evidenceList = `\n${t('evidenceFiles', language)}\n`;
      gameState.evidence.forEach((evidence, index) => {
        evidenceList += `[${index + 1}] ${evidence.name}\n`;
        evidenceList += `    ${t('locationFound', language)}: ${evidence.location}\n`;
        evidenceList += `    ${t('description', language)}: ${evidence.description}\n\n`;
      });
      return evidenceList;

    case 'interrogate':
      const suspectIndex = parseInt(args[0]) - 1;
      if (isNaN(suspectIndex) || !gameState.suspects[suspectIndex]) {
        return t('validSuspectId', language);
      }
      
      try {
        const suspect = gameState.suspects[suspectIndex];
        updateGameState({ currentInterrogation: suspect.id });
        interrogationCount++; // 增加审问计数
        
        if (onStreamToken) {
          // 流式模式：获取审问结果并显示
          const interrogationResult = await interrogateSuspect(suspect, gameState, onStreamToken, language);
          
          // 显示审问结果
          if (interrogationResult) {
            onStreamToken(`\n${interrogationResult}\n`);
          }
          
          return ''; // 返回空字符串，避免重复显示
        } else {
          // 非流式模式
          const interrogationResult = await interrogateSuspect(suspect, gameState);
          return `
${t('interrogationRecord', language, { name: suspect.name })}
${interrogationResult}

${t('interrogationTip', language)}
`;
        }
      } catch (error) {
        return t('interrogationFailed', language, {
          error: error instanceof Error ? error.message : t('unknownError', language)
        });
      }

    case 'recreate':
      if (!gameState.caseDescription) {
        return t('generateCaseFirst', language);
      }
      
      try {
        const crimeScene = await generateCrimeScene(gameState, onStreamToken);
        return `
${t('crimeSceneRecreation', language)}
${crimeScene}

${t('analyzeSceneDetails', language)}
`;
      } catch (error) {
        return t('sceneRecreationFailed', language, {
          error: error instanceof Error ? error.message : t('unknownError', language)
        });
      }

    case 'submit':
      const submitIndex = parseInt(args[0]) - 1;
      if (isNaN(submitIndex) || !gameState.suspects[submitIndex]) {
        return t('specifyAccusedSuspect', language);
      }
      
      const accusedSuspect = gameState.suspects[submitIndex];
      const isCorrect = gameState.solution.includes(accusedSuspect.name) || gameState.solution.includes(accusedSuspect.id);
      
      // 计算完成时间
      const completionTime = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
      
      if (!isCorrect) {
        wrongGuessCount++; // 增加错误计数
      }
      
      // 记录游戏结果
      const { record, newAchievements } = ProgressManager.recordCaseCompletion(
        gameState,
        completionTime,
        interrogationCount,
        wrongGuessCount,
        isCorrect
      );
      
      // 更新游戏进度
      const updatedProgress = {
        ...gameState.gameProgress,
        completedCases: [...gameState.gameProgress.completedCases, record],
        achievements: [...gameState.gameProgress.achievements, ...newAchievements]
      };
      
      updateGameState({ gameProgress: updatedProgress });
      
      // 重置计时器和计数器
      gameStartTime = null;
      interrogationCount = 0;
      wrongGuessCount = 0;
      
      let resultMessage = '';
      
      if (isCorrect) {
        const stars = '★'.repeat(record.stars) + '☆'.repeat(3 - record.stars);
        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        resultMessage = language === 'zh' ? `
🎉 恭喜破案成功！

✅ ${accusedSuspect.name} 确实是真凶！
💡 真相：${accusedSuspect.motive}

📊 本局统计：
   完成时间: ${formatTime(completionTime)}
   审问次数: ${interrogationCount}
   错误次数: ${wrongGuessCount}
   获得星级: ${stars}

🏆 案件已记录到通关记录中
` : `
🎉 Congratulations! Case Solved!

✅ ${accusedSuspect.name} is indeed the killer!
💡 Truth: ${accusedSuspect.motive}

📊 Game Statistics:
   Completion Time: ${formatTime(completionTime)}
   Interrogations: ${interrogationCount}
   Wrong Guesses: ${wrongGuessCount}
   Stars Earned: ${stars}

🏆 Case recorded in completion records
`;
      } else {
        resultMessage = language === 'zh' ? `
❌ 推理错误！

${accusedSuspect.name} 不是真凶
请重新审视证据和线索

💡 提示：继续调查，真相就在眼前
` : `
❌ Incorrect Deduction!

${accusedSuspect.name} is not the killer
Please reexamine the evidence and clues

💡 Hint: Continue investigating, the truth is within reach
`;
      }
      
      // 显示新解锁的成就
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          resultMessage += `\n🎉 ${t('achievementUnlocked', language, { name: achievement.name })}`;
        });
      }
      
      return resultMessage;

    case 'config':
      if (args.length === 0) {
        // 显示当前配置
        const { apiConfig } = gameState;
        const maskedKey = apiConfig.key ? `${apiConfig.key.substring(0, 10)}...` : t('notSet', language);
        return `
${t('apiConfiguration', language)}
${t('endpoint', language)}: ${apiConfig.url}
${t('model', language)}: ${apiConfig.model}
${t('key', language)}: ${maskedKey}

${t('configUsage', language)}

${apiConfig.key ? t('configuredApiKey', language) : t('unconfiguredApiKey', language)}
`;
      } else {
        // 设置配置 - 严格按照用户输入，不处理大小写
        const configType = args[0];
        const configValue = args.slice(1);
        const value = configValue.join(' ');
        
        switch (configType) {
          case 'url':
            if (!value) return t('endpointCannotBeEmpty', language);
            updateApiConfig({ url: value });
            return t('endpointSet', language, { url: value });
            
          case 'key':
            if (!value) return t('keyCannotBeEmpty', language);
            updateApiConfig({ key: value });
            return t('keySet', language, { key: value.substring(0, 10) });
            
          case 'model':
            if (!value) return t('modelCannotBeEmpty', language);
            updateApiConfig({ model: value });
            return t('modelSet', language, { model: value });
            
          default:
            return t('unknownConfigItem', language, { item: configType });
        }
      }

    case 'clear':
      return '\n'.repeat(50) + t('terminalCleared', language);

    case 'exit':
      return t('thankYouMessage', language);

    default:
      return t('unknownCommand', language, { cmd });
  }
};
