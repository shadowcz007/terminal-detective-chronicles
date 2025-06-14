
export const commandTranslations = {
  zh: {
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
    
    noActiveCase: '当前没有活跃案件，请输入 "new_case" 生成新案件',
    caseCleared: '案件数据已清除！\nAPI配置已保留。\n\n输入 \'new_case\' 开始新的案件调查',
    unknownCommand: '未知命令: {{cmd}}. 输入 \'help\' 查看帮助',
    suspectList: '=== 嫌疑人名单 ===',
    evidenceFiles: '=== 证据档案 ===',
    interrogationRecord: '=== 审问记录: {{name}} ===',
    crimeSceneRecreation: '=== 犯罪现场重现 ===',
  },
  en: {
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
    
    noActiveCase: 'No active case currently, please type "new_case" to generate a new case',
    caseCleared: 'Case data cleared!\nAPI configuration preserved.\n\nType \'new_case\' to start a new investigation',
    unknownCommand: 'Unknown command: {{cmd}}. Type \'help\' for help',
    suspectList: '=== Suspect List ===',
    evidenceFiles: '=== Evidence Files ===',
    interrogationRecord: '=== Interrogation Record: {{name}} ===',
    crimeSceneRecreation: '=== Crime Scene Recreation ===',
  }
};
