
export const caseTranslations = {
  zh: {
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
    
    relationshipWithVictim: '与死者关系',
    apparentMotive: '表面动机',
    locationFound: '发现地点',
    description: '描述',
    interrogationTip: '提示: 注意观察回答中的矛盾和可疑之处\n输入其他命令继续调查，或审问其他嫌疑人',
    analyzeSceneDetails: '分析现场细节，寻找可疑之处...',
    congratulations: '🎉 恭喜！推理正确！',
    suspectIsKiller: '{{name}} 确实是凶手！',
    truthRevealed: '真相: {{motive}}',
    caseClosed: '案件已结案。输入 \'new_case\' 开始新的挑战。',
    incorrectDeduction: '❌ 推理错误！',
    suspectNotKiller: '{{name}} 不是真凶。',
    reexamineEvidence: '请重新审视证据和嫌疑人的证词，寻找真正的线索。',
    continueInvestigation: '输入 \'interrogate [ID]\' 继续调查',
  },
  en: {
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
    
    relationshipWithVictim: 'Relationship with victim',
    apparentMotive: 'Apparent motive',
    locationFound: 'Location found',
    description: 'Description',
    interrogationTip: 'Tip: Watch for contradictions and suspicious elements in the responses\nEnter other commands to continue investigation, or interrogate other suspects',
    analyzeSceneDetails: 'Analyze scene details, look for suspicious elements...',
    congratulations: '🎉 Congratulations! Correct deduction!',
    suspectIsKiller: '{{name}} is indeed the killer!',
    truthRevealed: 'Truth: {{motive}}',
    caseClosed: 'Case closed. Type \'new_case\' to start a new challenge.',
    incorrectDeduction: '❌ Incorrect deduction!',
    suspectNotKiller: '{{name}} is not the real killer.',
    reexamineEvidence: 'Please re-examine the evidence and suspects\' testimonies for real clues.',
    continueInvestigation: 'Type \'interrogate [ID]\' to continue investigation',
  }
};
