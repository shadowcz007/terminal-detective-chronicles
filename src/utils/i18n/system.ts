
export const systemTranslations = {
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
    
    // AI Service specific translations
    caseAnalysisSystemStart: '\n=== 案件分析系统启动 ===\n',
    caseFileGenerationComplete: '\n案件档案生成完成！\n',
    startInterrogation: '\n=== 开始审问 {{name}} ===\n',
    startRecording: '\n开始记录对话...\n\n',
    
    // 其他常用文本
    processing: '处理中',
    inProgress: '进行中',
    none: '无',
    unknownError: '未知错误',
    terminalCleared: '终端已清空',
    thankYouMessage: '感谢使用AI侦探终端系统。再见！',
    languageSwitched: '语言已切换为中文',
  },
  en: {
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
    
    // AI Service specific translations
    caseAnalysisSystemStart: '\n=== Case Analysis System Started ===\n',
    caseFileGenerationComplete: '\nCase file generation complete!\n',
    startInterrogation: '\n=== Starting interrogation of {{name}} ===\n',
    startRecording: '\nStarting conversation recording...\n\n',
    
    // 其他常用文本
    processing: 'Processing',
    inProgress: 'In Progress',
    none: 'None',
    unknownError: 'Unknown error',
    terminalCleared: 'Terminal cleared',
    thankYouMessage: 'Thank you for using AI Detective Terminal System. Goodbye!',
    languageSwitched: 'Language switched to English',
  }
};
