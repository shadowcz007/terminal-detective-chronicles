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
    
    // AI Service specific translations
    caseAnalysisSystemStart: '\n=== 案件分析系统启动 ===\n',
    caseFileGenerationComplete: '\n案件档案生成完成！\n',
    startInterrogation: '\n=== 开始审问 {{name}} ===\n',
    startRecording: '\n开始记录对话...\n\n',
    
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
    
    // 新增的案件生成相关翻译
    newCaseFile: '=== 新案件档案 ===',
    caseId: '案件ID',
    overview: '案件概述',
    victim: '受害者',
    suspectsOverview: '=== 嫌疑人概况 ===',
    relationship: '关系',
    initialEvidence: '=== 初步证据 ===',
    location: '位置',
    availableOperations: `
可用操作：
  list_suspects - 查看嫌疑人详情
  evidence - 查看证据档案  
  recreate - 重现犯罪现场
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  status - 查看案件状态
  submit [ID] - 提交最终结论`,
    
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
    
    // 状态相关
    caseStatus: `
=== 案件状态 ===
案件ID: #{{caseId}}
案件描述: {{description}}
受害者: {{victim}}
嫌疑人数量: {{suspectCount}}
证据数量: {{evidenceCount}}
当前审问: {{currentInterrogation}}

进度统计:
- 已审问嫌疑人: {{interrogatedCount}}/{{totalSuspects}}
- 收集证据: {{evidenceCount}}个`,
    
    // 错误和提示信息
    noCurrentCase: '当前没有案件需要清除',
    caseGenerationFailed: '案件生成失败: {{error}}',
    relationshipWithVictim: '与死者关系',
    apparentMotive: '表面动机',
    locationFound: '发现地点',
    description: '描述',
    validSuspectId: '请指定有效的嫌疑人编号，例如: interrogate 1',
    interrogationTip: '提示: 注意观察回答中的矛盾和可疑之处\n输入其他命令继续调查，或审问其他嫌疑人',
    interrogationFailed: '审问失败: {{error}}',
    generateCaseFirst: '请先生成案件才能重现犯罪现场',
    analyzeSceneDetails: '分析现场细节，寻找可疑之处...',
    sceneRecreationFailed: '现场重现失败: {{error}}',
    specifyAccusedSuspect: '请指定要指控的嫌疑人编号，例如: submit 2',
    congratulations: '🎉 恭喜！推理正确！',
    suspectIsKiller: '{{name}} 确实是凶手！',
    truthRevealed: '真相: {{motive}}',
    caseClosed: '案件已结案。输入 \'new_case\' 开始新的挑战。',
    incorrectDeduction: '❌ 推理错误！',
    suspectNotKiller: '{{name}} 不是真凶。',
    reexamineEvidence: '请重新审视证据和嫌疑人的证词，寻找真正的线索。',
    continueInvestigation: '输入 \'interrogate [ID]\' 继续调查',
    
    // 配置相关
    apiConfiguration: '=== API 配置 ===',
    endpoint: '端点',
    model: '模型',
    key: '密钥',
    notSet: '未设置',
    configUsage: `
使用方法:
  config url <API端点>    - 设置API端点
  config key <API密钥>    - 设置API密钥
  config model <模型名>   - 设置模型

常用配置示例:
  config url https://api.openai.com/v1/chat/completions
  config key sk-xxx...
  config model gpt-3.5-turbo`,
    configuredApiKey: '提示: ✅ 已配置API密钥，将使用真实AI',
    unconfiguredApiKey: '提示: ⚠️ 未配置API密钥，当前使用模拟AI',
    endpointCannotBeEmpty: 'API端点不能为空',
    endpointSet: 'API端点已设置为: {{url}}',
    keyCannotBeEmpty: 'API密钥不能为空',
    keySet: 'API密钥已设置 ({{key}}...)',
    modelCannotBeEmpty: '模型名不能为空',
    modelSet: '模型已设置为: {{model}}',
    unknownConfigItem: '未知配置项: {{item}}. 支持的配置项: url, key, model',
    terminalCleared: '终端已清空',
    thankYouMessage: '感谢使用AI侦探终端系统。再见！',
    
    // 其他常用文本
    processing: '处理中',
    noActiveCase: '当前没有活跃案件，请输入 "new_case" 生成新案件',
    caseCleared: '案件数据已清除！\nAPI配置已保留。\n\n输入 \'new_case\' 开始新的案件调查',
    languageSwitched: '语言已切换为中文',
    unknownCommand: '未知命令: {{cmd}}. 输入 \'help\' 查看帮助',
    suspectList: '=== 嫌疑人名单 ===',
    evidenceFiles: '=== 证据档案 ===',
    interrogationRecord: '=== 审问记录: {{name}} ===',
    crimeSceneRecreation: '=== 犯罪现场重现 ===',
    inProgress: '进行中',
    none: '无',
    unknownError: '未知错误',
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
    
    // 案件信息
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
    
    // 新增的案件生成相关翻译
    newCaseFile: '=== New Case File ===',
    caseId: 'Case ID',
    overview: 'Case Overview',
    victim: 'Victim',
    suspectsOverview: '=== Suspect Overview ===',
    relationship: 'Relationship',
    initialEvidence: '=== Initial Evidence ===',
    location: 'Location',
    availableOperations: `
Available Operations:
  list_suspects - View suspect details
  evidence - View evidence files
  recreate - Recreate crime scene  
  interrogate [ID] - Interrogate suspect (e.g: interrogate 1)
  status - Check case status
  submit [ID] - Submit final conclusion`,
    
    // 帮助信息
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
    
    // 状态相关
    caseStatus: `
=== Case Status ===
Case ID: #{{caseId}}
Case Description: {{description}}
Victim: {{victim}}
Number of Suspects: {{suspectCount}}
Number of Evidence: {{evidenceCount}}
Current Interrogation: {{currentInterrogation}}

Progress Statistics:
- Interrogated Suspects: {{interrogatedCount}}/{{totalSuspects}}
- Collected Evidence: {{evidenceCount}} items`,
    
    // 错误和提示信息
    noCurrentCase: 'No case to clear currently',
    caseGenerationFailed: 'Case generation failed: {{error}}',
    relationshipWithVictim: 'Relationship with victim',
    apparentMotive: 'Apparent motive',
    locationFound: 'Location found',
    description: 'Description',
    validSuspectId: 'Please specify a valid suspect ID, e.g., interrogate 1.',
    interrogationTip: 'Tip: Watch for contradictions and suspicious elements in the responses\nEnter other commands to continue investigation, or interrogate other suspects',
    interrogationFailed: 'Interrogation failed: {{error}}',
    generateCaseFirst: 'Please generate a case first to recreate the crime scene.',
    analyzeSceneDetails: 'Analyze scene details, look for suspicious elements...',
    sceneRecreationFailed: 'Scene recreation failed: {{error}}',
    specifyAccusedSuspect: 'Please specify the suspect ID to accuse, e.g., submit 2.',
    congratulations: '🎉 Congratulations! Correct deduction!',
    suspectIsKiller: '{{name}} is indeed the killer!',
    truthRevealed: 'Truth: {{motive}}',
    caseClosed: 'Case closed. Type \'new_case\' to start a new challenge.',
    incorrectDeduction: '❌ Incorrect deduction!',
    suspectNotKiller: '{{name}} is not the real killer.',
    reexamineEvidence: 'Please re-examine the evidence and suspects\' testimonies for real clues.',
    continueInvestigation: 'Type \'interrogate [ID]\' to continue investigation',
    
    // 配置相关
    apiConfiguration: '=== API Configuration ===',
    endpoint: 'Endpoint',
    model: 'Model',
    key: 'Key',
    notSet: 'Not set',
    configUsage: `
Usage:
  config url <API endpoint>    - Set API endpoint
  config key <API key>         - Set API key
  config model <model name>    - Set model

Common configuration examples:
  config url https://api.openai.com/v1/chat/completions
  config key sk-xxx...
  config model gpt-3.5-turbo`,
    configuredApiKey: 'Tip: ✅ API key configured, will use real AI',
    unconfiguredApiKey: 'Tip: ⚠️ API key not configured, currently using demo AI',
    endpointCannotBeEmpty: 'API endpoint cannot be empty',
    endpointSet: 'API endpoint set to: {{url}}',
    keyCannotBeEmpty: 'API key cannot be empty',
    keySet: 'API key set ({{key}}...)',
    modelCannotBeEmpty: 'Model name cannot be empty',
    modelSet: 'Model set to: {{model}}',
    unknownConfigItem: 'Unknown configuration item: {{item}}. Supported items: url, key, model',
    terminalCleared: 'Terminal cleared',
    thankYouMessage: 'Thank you for using AI Detective Terminal System. Goodbye!',
    
    // 其他常用文本
    processing: 'Processing',
    noActiveCase: 'No active case currently, please type "new_case" to generate a new case',
    caseCleared: 'Case data cleared!\nAPI configuration preserved.\n\nType \'new_case\' to start a new investigation',
    languageSwitched: 'Language switched to English',
    unknownCommand: 'Unknown command: {{cmd}}. Type \'help\' for help',
    suspectList: '=== Suspect List ===',
    evidenceFiles: '=== Evidence Files ===',
    interrogationRecord: '=== Interrogation Record: {{name}} ===',
    crimeSceneRecreation: '=== Crime Scene Recreation ===',
    inProgress: 'In Progress',
    none: 'None',
    unknownError: 'Unknown error',
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
