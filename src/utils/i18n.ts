export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // 系统消息
    systemInit: `
===============================================================================
                          █████╗ ██╗     ███████╗██████╗ 
                         ██╔══██╗██║     ██╔════╝██╔══██╗
                         ███████║██║     █████╗  ██║  ██║
                         ██╔══██║██║     ██╔══╝  ██║  ██║
                         ██║  ██║███████╗███████╗██████╔╝
                         ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ 
===============================================================================
AI 侦探终端 v2.1.5 | 当前案件ID: #{{caseId}}
-------------------------------------------------------------------------------
系统初始化完成... 
{{apiStatus}}
{{caseStatus}}
输入 'help' 查看可用命令
输入 'config' 配置API设置
输入 'new_case' 开始新案件
{{statusCommand}}
`,
    aiModeReal: '✅ AI模式: 真实API (支持流式传输)',
    aiModeDemo: '⚠️ AI模式: 模拟演示',
    caseRestored: '🔄 检测到未完成案件，已自动恢复',
    statusCommandText: '输入 \'status\' 查看当前案件状态',
    
    // 案件信息
    caseInfo: `
=== 当前案件信息 ===
案件描述: {{description}}
受害者: {{victim}}
嫌疑人数量: {{suspectCount}}
证据数量: {{evidenceCount}}

可用操作：
  list_suspects - 查看嫌疑人
  evidence - 查看证据
  recreate - 重现现场
  interrogate [ID] - 审问嫌疑人
  clear_case - 清除当前案件
`,
    
    // 帮助信息
    help: `
可用命令：
  new_case       - 生成新案件
  list_suspects  - 显示嫌疑人名单
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  evidence       - 查看证据档案
  recreate       - 生成犯罪现场重现
  submit [嫌疑人ID] - 提交最终结论
  status         - 查看当前案件状态
  clear_case     - 清除当前案件数据
  config         - 查看/修改API设置
  lang           - 切换语言 (中/英文)
  clear          - 清空终端  
  exit           - 退出系统
`,
    
    // 其他常用文本
    processing: '处理中',
    noActiveCase: '当前没有活跃案件，请输入 "new_case" 生成新案件',
    caseCleared: '案件数据已清除！\nAPI配置已保留。\n\n输入 \'new_case\' 开始新的案件调查',
    languageSwitched: '语言已切换为中文',
    unknownCommand: '未知命令: {{cmd}}. 输入 \'help\' 查看帮助',
  },
  en: {
    // System messages
    systemInit: `
===============================================================================
                          █████╗ ██╗     ███████╗██████╗ 
                         ██╔══██╗██║     ██╔════╝██╔══██╗
                         ███████║██║     █████╗  ██║  ██║
                         ██╔══██║██║     ██╔══╝  ██║  ██║
                         ██║  ██║███████╗███████╗██████╔╝
                         ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ 
===============================================================================
AI DETECTIVE TERMINAL v2.1.5 | Current Case ID: #{{caseId}}
-------------------------------------------------------------------------------
System initialization complete... 
{{apiStatus}}
{{caseStatus}}
Type 'help' to view available commands
Type 'config' to configure API settings
Type 'new_case' to start a new case
{{statusCommand}}
`,
    aiModeReal: '✅ AI Mode: Real API (Streaming supported)',
    aiModeDemo: '⚠️ AI Mode: Demo simulation',
    caseRestored: '🔄 Unfinished case detected, automatically restored',
    statusCommandText: 'Type \'status\' to view current case status',
    
    // Case information
    caseInfo: `
=== Current Case Information ===
Case Description: {{description}}
Victim: {{victim}}
Number of Suspects: {{suspectCount}}
Number of Evidence: {{evidenceCount}}

Available Operations:
  list_suspects - View suspects
  evidence - View evidence
  recreate - Recreate crime scene
  interrogate [ID] - Interrogate suspect
  clear_case - Clear current case
`,
    
    // Help information
    help: `
Available Commands:
  new_case       - Generate new case
  list_suspects  - Display suspect list
  interrogate [ID] - Interrogate suspect (e.g: interrogate 1)
  evidence       - View evidence files
  recreate       - Generate crime scene recreation
  submit [Suspect ID] - Submit final conclusion
  status         - Check current case status
  clear_case     - Clear current case data
  config         - View/modify API settings
  lang           - Switch language (Chinese/English)
  clear          - Clear terminal
  exit           - Exit system
`,
    
    // Other common texts
    processing: 'Processing',
    noActiveCase: 'No active case currently, please type "new_case" to generate a new case',
    caseCleared: 'Case data cleared!\nAPI configuration preserved.\n\nType \'new_case\' to start a new investigation',
    languageSwitched: 'Language switched to English',
    unknownCommand: 'Unknown command: {{cmd}}. Type \'help\' for help',
  }
};

export const t = (key: string, language: Language, params?: Record<string, string>): string => {
  let text = translations[language][key as keyof typeof translations[typeof language]] || key;
  
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    });
  }
  
  return text;
};
