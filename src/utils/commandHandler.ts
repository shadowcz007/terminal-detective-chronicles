import { GameState } from '../types/gameTypes';
import { Language, t } from './i18n';
import { generateCase, interrogateSuspect, generateCrimeScene } from './aiService';
import { handleDifficultyCommands } from '../commands/difficultyCommands';
import { handleProgressCommands } from '../commands/progressCommands';
import { ProgressManager } from '../features/progress/progressManager';
import { formatCaseAsMarkdown, downloadMarkdownFile } from './exportUtils';
import { executeStreamingRequest } from './streamingUtils';
import { getInterrogationPrompt } from './prompts';

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
    case 'export_case': {
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
    }

    case 'current_stats': {
      if (!gameState.currentCaseStats.isActive) {
        return language === 'zh' ? 
          '当前没有活跃案件，无法显示统计数据' :
          'No active case, cannot display statistics';
      }
      
      const currentTime = gameState.currentCaseStats.startTime ? 
        Math.floor((Date.now() - gameState.currentCaseStats.startTime) / 1000) : 0;
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
      return language === 'zh' ? `
📊 当前案件统计：
   进行时间: ${formatTime(currentTime)}
   审问次数: ${gameState.currentCaseStats.interrogationCount}
   错误次数: ${gameState.currentCaseStats.wrongGuessCount}
   案件ID: #${gameState.caseId}
` : `
📊 Current Case Statistics:
   Elapsed Time: ${formatTime(currentTime)}
   Interrogations: ${gameState.currentCaseStats.interrogationCount}
   Wrong Guesses: ${gameState.currentCaseStats.wrongGuessCount}
   Case ID: #${gameState.caseId}
`;
    }

    case 'help': {
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
  current_stats  - 查看当前案件统计
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
  current_stats  - View current case statistics
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
    }

    case 'status': {
      if (!gameState.caseId) {
        return t('noActiveCase', language);
      }
      
      // 计算当前时间和统计
      const currentTime2 = gameState.currentCaseStats.startTime ? 
        Math.floor((Date.now() - gameState.currentCaseStats.startTime) / 1000) : 0;
      const formatTime2 = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
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
      
      const statsText = language === 'zh' ? `

📊 当前统计：
   进行时间: ${formatTime2(currentTime2)}
   审问次数: ${gameState.currentCaseStats.interrogationCount}
   错误次数: ${gameState.currentCaseStats.wrongGuessCount}` : `

📊 Current Statistics:
   Elapsed Time: ${formatTime2(currentTime2)}
   Interrogations: ${gameState.currentCaseStats.interrogationCount}
   Wrong Guesses: ${gameState.currentCaseStats.wrongGuessCount}`;
      
      return statusText + statsText;
    }

    case 'clear_case': {
      if (!gameState.caseId) {
        return t('noCurrentCase', language);
      }
      
      // 清除案件数据和统计数据
      updateGameState({
        caseId: '',
        caseDescription: '',
        victim: '',
        suspects: [],
        evidence: [],
        solution: '',
        currentInterrogation: undefined,
        currentCaseStats: {
          startTime: null,
          interrogationCount: 0,
          wrongGuessCount: 0,
          isActive: false
        }
      });
      
      return t('caseCleared', language);
    }

    case 'new_case': {
      try {
        // **关键修复：确保 startTime 正确记录**
        const currentTime = Date.now();
        const newCaseStats = {
          startTime: currentTime,
          interrogationCount: 0,
          wrongGuessCount: 0,
          isActive: true
        };
        
        console.log('🎯 [NEW_CASE] Initializing case stats with startTime:', currentTime);
        console.log('📊 [NEW_CASE] Full stats object:', newCaseStats);
        
        const caseData = await generateCase(gameState.apiConfig, onStreamToken, language, gameState.difficulty.level);
        
        // **关键修复：先更新状态，然后验证保存**
        const stateUpdate = {
          ...caseData,
          currentCaseStats: newCaseStats
        };
        
        console.log('🔄 [NEW_CASE] Updating state with:', {
          caseId: stateUpdate.caseId,
          startTime: stateUpdate.currentCaseStats.startTime,
          isActive: stateUpdate.currentCaseStats.isActive
        });
        
        updateGameState(stateUpdate);
        
        // **验证状态保存**
        setTimeout(() => {
          try {
            const savedState = localStorage.getItem('ai-detective-game-state');
            if (savedState) {
              const parsed = JSON.parse(savedState);
              console.log('🔍 [NEW_CASE] Verification - saved startTime:', parsed.currentCaseStats?.startTime);
              console.log('🔍 [NEW_CASE] Verification - should be:', currentTime);
              console.log('🔍 [NEW_CASE] Verification - match:', parsed.currentCaseStats?.startTime === currentTime);
            }
          } catch (error) {
            console.error('❌ [NEW_CASE] Verification failed:', error);
          }
        }, 100);
        
        console.log('✅ [NEW_CASE] Case initialized with verified stats');
        
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
    }

    case 'list_suspects': {
      if (gameState.suspects.length === 0) {
        return t('noActiveCase', language);
      }
      
      // 返回特殊标记，让Terminal组件知道要显示UI
      return 'SHOW_SUSPECT_LIST_UI';
    }

    case 'evidence': {
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
    }

    case 'interrogate': {
      const suspectIndex = parseInt(args[0]) - 1;
      if (isNaN(suspectIndex) || !gameState.suspects[suspectIndex]) {
        return t('validSuspectId', language);
      }
      
      try {
        const suspect = gameState.suspects[suspectIndex];
        
        // 生成唯一的审讯会话ID
        const interrogationSessionId = `${suspect.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('🎯 [INTERROGATE] Starting interrogation session:', interrogationSessionId);
        console.log('👤 [INTERROGATE] Target Suspect:', suspect.name);
        console.log('📊 [INTERROGATE] Current stats before update:', gameState.currentCaseStats);
        
        // **关键修复：创建一个新的状态对象，确保状态更新的原子性**
        const updatedStats = {
          ...gameState.currentCaseStats,
          interrogationCount: gameState.currentCaseStats.interrogationCount + 1
        };
        
        console.log('📊 [INTERROGATE] Updated stats to be set:', updatedStats);
        
        // **关键修复：使用Promise来确保状态更新的同步性**
        return new Promise((resolve) => {
          // 先更新状态
          updateGameState({ 
            currentInterrogation: suspect.id,
            currentCaseStats: updatedStats
          });
          
          console.log('✅ [INTERROGATE] State update triggered');
          
          // 使用setTimeout确保状态更新完成后再进行后续操作
          setTimeout(async () => {
            try {
              // 创建包含更新后状态的gameState对象
              const updatedGameState = {
                ...gameState,
                currentInterrogation: suspect.id,
                currentCaseStats: updatedStats
              };
              
              console.log('🔍 [INTERROGATE] Using updated game state for interrogation');
              console.log('📊 [INTERROGATE] Final stats in updatedGameState:', updatedGameState.currentCaseStats);
              
              if (onStreamToken) {
                console.log('🚀 [INTERROGATE] Starting streaming interrogation');
                
                const result = await executeStreamingRequest({
                  promptText: getInterrogationPrompt(suspect, updatedGameState, language),
                  apiConfig: gameState.apiConfig,
                  language,
                  startMessage: t('startInterrogation', language, { name: suspect.name }),
                  completeMessage: t('interrogationStarted', language, { name: suspect.name }),
                  tipMessage: t('interrogationTip', language),
                  displayRealResult: true
                }, onStreamToken);
                
                console.log('🏁 [INTERROGATE] Streaming interrogation completed');
                resolve('');
              } else {
                console.log('📋 [INTERROGATE] Starting non-streaming interrogation');
                
                const interrogationResult = await interrogateSuspect(suspect, updatedGameState, undefined, language);
                
                console.log('🏁 [INTERROGATE] Non-streaming interrogation completed');
                
                resolve(`
${t('interrogationRecord', language, { name: suspect.name })}
${interrogationResult}

${t('interrogationTip', language)}
`);
              }
            } catch (error) {
              console.error('❌ [INTERROGATE] Error during interrogation:', error);
              resolve(t('interrogationFailed', language, {
                error: error instanceof Error ? error.message : t('unknownError', language)
              }));
            }
          }, 100); // 100ms延迟确保状态更新完成
        });
      } catch (error) {
        console.error('❌ [INTERROGATE] Outer error:', error);
        return t('interrogationFailed', language, {
          error: error instanceof Error ? error.message : t('unknownError', language)
        });
      }
    }

    case 'recreate': {
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
    }

    case 'submit': {
      const submitIndex = parseInt(args[0]) - 1;
      if (isNaN(submitIndex) || !gameState.suspects[submitIndex]) {
        return t('specifyAccusedSuspect', language);
      }
      
      const accusedSuspect = gameState.suspects[submitIndex];
      const isCorrect = gameState.solution.includes(accusedSuspect.name) || gameState.solution.includes(accusedSuspect.id);
      
      console.log('🎯 [SUBMIT] Submitting accusation against:', accusedSuspect.name);
      
      // **关键修复：直接从 localStorage 读取最新状态**
      const getLatestStateFromCache = () => {
        try {
          const savedState = localStorage.getItem('ai-detective-game-state');
          if (savedState) {
            const parsed = JSON.parse(savedState);
            console.log('💾 [SUBMIT] Reading from localStorage:', {
              startTime: parsed.currentCaseStats?.startTime,
              interrogationCount: parsed.currentCaseStats?.interrogationCount,
              wrongGuessCount: parsed.currentCaseStats?.wrongGuessCount,
              isActive: parsed.currentCaseStats?.isActive
            });
            return parsed;
          }
        } catch (error) {
          console.error('❌ [SUBMIT] Error reading from localStorage:', error);
        }
        console.warn('⚠️ [SUBMIT] Fallback to gameState:', gameState.currentCaseStats);
        return gameState;
      };
      
      const latestState = getLatestStateFromCache();
      const currentStats = latestState.currentCaseStats;
      
      console.log('📊 [SUBMIT] Current stats from cache:', {
        startTime: currentStats.startTime,
        interrogationCount: currentStats.interrogationCount,
        wrongGuessCount: currentStats.wrongGuessCount,
        startTimeType: typeof currentStats.startTime
      });
      
      // **关键修复：验证 startTime 有效性**
      if (!currentStats.startTime) {
        console.error('❌ [SUBMIT] startTime is null/undefined, cannot calculate completion time');
        return language === 'zh' ? 
          '❌ 错误：无法获取案件开始时间，请重新开始新案件' :
          '❌ Error: Cannot get case start time, please start a new case';
      }
      
      // **修复错误计数逻辑**
      const finalStats = {
        ...currentStats,
        wrongGuessCount: isCorrect ? 
          currentStats.wrongGuessCount : 
          currentStats.wrongGuessCount + 1
      };
      
      // **修复时间计算**
      const completionTime = Math.floor((Date.now() - currentStats.startTime) / 1000);
      
      console.log('⏱️ [SUBMIT] Time calculation:', {
        currentTime: Date.now(),
        startTime: currentStats.startTime,
        difference: Date.now() - currentStats.startTime,
        completionTimeSeconds: completionTime
      });
      
      console.log('📊 [SUBMIT] Final stats for record:', {
        completionTime,
        interrogationCount: finalStats.interrogationCount,
        wrongGuessCount: finalStats.wrongGuessCount,
        isCorrect
      });
      
      // 如果答错，立即更新错误次数
      if (!isCorrect) {
        updateGameState({ currentCaseStats: finalStats });
      }
      
      // 记录游戏结果
      const { record, newAchievements } = ProgressManager.recordCaseCompletion(
        gameState,
        completionTime,
        finalStats.interrogationCount,
        finalStats.wrongGuessCount,
        isCorrect
      );
      
      console.log('🏆 [SUBMIT] Generated record:', record);
      
      // 更新游戏进度和重置统计数据
      const updatedProgress = {
        ...gameState.gameProgress,
        completedCases: [...gameState.gameProgress.completedCases, record],
        achievements: [...gameState.gameProgress.achievements, ...newAchievements]
      };
      
      // 重置当前案件统计
      const resetStats = {
        startTime: null,
        interrogationCount: 0,
        wrongGuessCount: 0,
        isActive: false
      };
      
      updateGameState({ 
        gameProgress: updatedProgress,
        currentCaseStats: resetStats
      });
      
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
   审问次数: ${finalStats.interrogationCount}
   错误次数: ${finalStats.wrongGuessCount}
   获得星级: ${stars}

🏆 案件已记录到通关记录中
` : `
🎉 Congratulations! Case Solved!

✅ ${accusedSuspect.name} is indeed the killer!
💡 Truth: ${accusedSuspect.motive}

📊 Game Statistics:
   Completion Time: ${formatTime(completionTime)}
   Interrogations: ${finalStats.interrogationCount}
   Wrong Guesses: ${finalStats.wrongGuessCount}
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
    }

    case 'config': {
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
          case 'url': {
            if (!value) return t('endpointCannotBeEmpty', language);
            updateApiConfig({ url: value });
            return t('endpointSet', language, { url: value });
          }
            
          case 'key': {
            if (!value) return t('keyCannotBeEmpty', language);
            updateApiConfig({ key: value });
            return t('keySet', language, { key: value.substring(0, 10) });
          }
            
          case 'model': {
            if (!value) return t('modelCannotBeEmpty', language);
            updateApiConfig({ model: value });
            return t('modelSet', language, { model: value });
          }
            
          default:
            return t('unknownConfigItem', language, { item: configType });
        }
      }
    }

    case 'clear': {
      return '\n'.repeat(50) + t('terminalCleared', language);
    }

    case 'exit': {
      return t('thankYouMessage', language);
    }

    default:
      return t('unknownCommand', language, { cmd });
  }
};
