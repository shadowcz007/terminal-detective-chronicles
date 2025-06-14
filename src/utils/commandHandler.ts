
import { GameState } from '../hooks/useGameState';
import { generateCase, interrogateSuspect, generateCrimeScene } from './aiService';

export const executeCommand = async (
  command: string, 
  gameState: GameState, 
  updateGameState: (updates: Partial<GameState>) => void,
  updateApiConfig: (config: Partial<GameState['apiConfig']>) => void
): Promise<string> => {
  const [cmd, ...args] = command.toLowerCase().split(' ');

  switch (cmd) {
    case 'help':
      return `
可用命令：
  new_case       - 生成新案件
  list_suspects  - 显示嫌疑人名单
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  evidence       - 查看证据档案
  recreate       - 生成犯罪现场重现
  submit [嫌疑人ID] - 提交最终结论
  config         - 查看/修改API设置
  config url [URL] - 设置API端点
  config key [KEY] - 设置API密钥
  config model [MODEL] - 设置模型
  clear          - 清空终端
  exit           - 退出系统
`;

    case 'new_case':
      try {
        const caseData = await generateCase(gameState.apiConfig);
        updateGameState(caseData);
        return `
新案件已生成！
案件ID: #${caseData.caseId}
${caseData.caseDescription}

受害者: ${caseData.victim}
嫌疑人数量: ${caseData.suspects?.length || 0}
初始证据: ${caseData.evidence?.length || 0}个

输入 'list_suspects' 查看嫌疑人信息
输入 'evidence' 查看证据档案
`;
      } catch (error) {
        return `案件生成失败: ${error instanceof Error ? error.message : '未知错误'}`;
      }

    case 'list_suspects':
      if (gameState.suspects.length === 0) {
        return '当前没有案件，请先输入 "new_case" 生成案件';
      }
      
      let suspectList = '\n=== 嫌疑人名单 ===\n';
      gameState.suspects.forEach((suspect, index) => {
        suspectList += `[${index + 1}] ${suspect.name} - ${suspect.occupation}\n`;
        suspectList += `    与死者关系: ${suspect.relationship}\n`;
        suspectList += `    表面动机: ${suspect.motive.substring(0, 30)}...\n\n`;
      });
      return suspectList;

    case 'evidence':
      if (gameState.evidence.length === 0) {
        return '当前没有证据，请先输入 "new_case" 生成案件';
      }
      
      let evidenceList = '\n=== 证据档案 ===\n';
      gameState.evidence.forEach((evidence, index) => {
        evidenceList += `[${index + 1}] ${evidence.name}\n`;
        evidenceList += `    发现地点: ${evidence.location}\n`;
        evidenceList += `    描述: ${evidence.description}\n\n`;
      });
      return evidenceList;

    case 'interrogate':
      const suspectIndex = parseInt(args[0]) - 1;
      if (isNaN(suspectIndex) || !gameState.suspects[suspectIndex]) {
        return '请指定有效的嫌疑人编号，例如: interrogate 1';
      }
      
      try {
        const suspect = gameState.suspects[suspectIndex];
        updateGameState({ currentInterrogation: suspect.id });
        
        const interrogationResult = await interrogateSuspect(suspect, gameState);
        return `
=== 审问记录: ${suspect.name} ===
${interrogationResult}

提示: 注意观察回答中的矛盾和可疑之处
输入其他命令继续调查，或审问其他嫌疑人
`;
      } catch (error) {
        return `审问失败: ${error instanceof Error ? error.message : '未知错误'}`;
      }

    case 'recreate':
      if (!gameState.caseDescription) {
        return '请先生成案件才能重现犯罪现场';
      }
      
      try {
        const crimeScene = await generateCrimeScene(gameState);
        return `
=== 犯罪现场重现 ===
${crimeScene}

分析现场细节，寻找可疑之处...
`;
      } catch (error) {
        return `现场重现失败: ${error instanceof Error ? error.message : '未知错误'}`;
      }

    case 'submit':
      const submitIndex = parseInt(args[0]) - 1;
      if (isNaN(submitIndex) || !gameState.suspects[submitIndex]) {
        return '请指定要指控的嫌疑人编号，例如: submit 2';
      }
      
      const accusedSuspect = gameState.suspects[submitIndex];
      const isCorrect = accusedSuspect.id === gameState.solution;
      
      if (isCorrect) {
        return `
🎉 恭喜！推理正确！

${accusedSuspect.name} 确实是凶手！
真相: ${accusedSuspect.motive}

案件已结案。输入 'new_case' 开始新的挑战。
`;
      } else {
        return `
❌ 推理错误！

${accusedSuspect.name} 不是真凶。
请重新审视证据和嫌疑人的证词，寻找真正的线索。

输入 'interrogate [ID]' 继续调查
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
        // 设置配置
        const [configType, ...configValue] = args;
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
      return '\n'.repeat(50) + '终端已清空';

    case 'exit':
      return '感谢使用AI侦探终端系统。再见！';

    default:
      return `未知命令: ${cmd}. 输入 'help' 查看帮助`;
  }
};
