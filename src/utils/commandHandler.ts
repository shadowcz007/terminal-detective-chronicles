
import { GameState } from '../hooks/useGameState';
import { Language, t } from './i18n';
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
      const isCorrect = accusedSuspect.id === gameState.solution;
      
      if (isCorrect) {
        return `
${t('congratulations', language)}

${t('suspectIsKiller', language, { name: accusedSuspect.name })}
${t('truthRevealed', language, { motive: accusedSuspect.motive })}

${t('caseClosed', language)}
`;
      } else {
        return `
${t('incorrectDeduction', language)}

${t('suspectNotKiller', language, { name: accusedSuspect.name })}
${t('reexamineEvidence', language)}

${t('continueInvestigation', language)}
`;
      }

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
