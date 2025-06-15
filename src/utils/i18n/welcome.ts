
export const welcomeTranslations = {
  zh: {
    systemInit: `
🌀 CHRONOS 时空探案系统 v2.4.1 启动中...
⚡ 量子处理器：在线
🔮 时空感知模块：已校准
🎯 案件数据库：已连接

当前案件：{{caseId}}
AI模式：{{apiStatus}}
{{caseStatus}}

输入 'help' 查看可用命令
{{statusCommand}}
`,
    aiModeReal: '🤖 真实AI模式 (已配置API)',
    aiModeDemo: '🎭 演示模式 (使用模拟数据)',
    caseRestored: '📂 检测到未完成案件，已自动恢复',
    statusCommandText: "输入 'status' 查看案件详情",
    caseInfo: `
📋 案件信息：
   描述：{{description}}
   受害者：{{victim}}
   嫌疑人：{{suspectCount}} 人
   证据：{{evidenceCount}} 项`,
    availableOperations: `
🔍 可用操作：
   list_suspects  - 查看嫌疑人名单
   evidence      - 查看证据档案
   interrogate [ID] - 审讯嫌疑人
   recreate      - 重现犯罪现场
   submit [ID]   - 提交最终结论`,
    terminalSubtitle: '时空探案终端 - 追寻真相的量子界面',
    processing: '处理中',
    paradoxResolved: '🌟 时空悖论已解决！获得时间加速奖励',
    paradoxFailed: '⚠️ 时空悖论处理失败，时间流出现干扰'
  },
  en: {
    systemInit: `
🌀 CHRONOS Temporal Detective System v2.4.1 Initializing...
⚡ Quantum Processor: Online
🔮 Temporal Perception Module: Calibrated
🎯 Case Database: Connected

Current Case: {{caseId}}
AI Mode: {{apiStatus}}
{{caseStatus}}

Type 'help' for available commands
{{statusCommand}}
`,
    aiModeReal: '🤖 Real AI Mode (API Configured)',
    aiModeDemo: '🎭 Demo Mode (Using Mock Data)',
    caseRestored: '📂 Incomplete case detected, automatically restored',
    statusCommandText: "Type 'status' for case details",
    caseInfo: `
📋 Case Information:
   Description: {{description}}
   Victim: {{victim}}
   Suspects: {{suspectCount}} people
   Evidence: {{evidenceCount}} items`,
    availableOperations: `
🔍 Available Operations:
   list_suspects  - View suspect list
   evidence      - View evidence files
   interrogate [ID] - Interrogate suspects
   recreate      - Recreate crime scene
   submit [ID]   - Submit final conclusion`,
    terminalSubtitle: 'Temporal Detective Terminal - Quantum Interface for Truth Seeking',
    processing: 'Processing',
    paradoxResolved: '🌟 Temporal paradox resolved! Time acceleration bonus gained',
    paradoxFailed: '⚠️ Temporal paradox resolution failed, timeline interference detected'
  }
};
