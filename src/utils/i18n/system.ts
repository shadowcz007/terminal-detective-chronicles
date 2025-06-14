
export const systemTranslations = {
  zh: {
    systemInit: `
████████╗███████╗███╗   ███╗██████╗  ██████╗ ██████╗  █████╗ ██╗     
╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██║     
   ██║   █████╗  ██╔████╔██║██████╔╝██║   ██║██████╔╝███████║██║     
   ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗██╔══██║██║     
   ██║   ███████╗██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

⧈ CHRONOS-CORRUPTION TERMINAL v2.47.∞ ⧈
⧊ 时空裂隙检测系统 | 时间线ID: {{caseId}} ⧊
⧈ 量子态: {{apiStatus}} ⧈
{{caseStatus}}
{{statusCommand}}

[系统] 时空传输链接已建立...
[警告] 检测到时间线不稳定...
[状态] 待命中... 输入 'help' 查看可用的时空操作
`,
    terminalSubtitle: "由戴森球供能的时空遗物，外星科技修补而成",
    processing: "[时空计算中]",
    aiModeReal: "真实AI模式",
    aiModeDemo: "演示模式",
    caseRestored: "\n[时空] 检测到未完成的案件，正在恢复时间线...",
    statusCommandText: "输入 'status' 查看案件详情",
    caseInfo: "\n━━━ 案件时空坐标 ━━━\n描述: {{description}}\n受害者: {{victim}}\n嫌疑人数量: {{suspectCount}}\n证据数量: {{evidenceCount}}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    availableOperations: "\n⧈ 可用的时空操作 ⧈\n- interrogate <嫌疑人姓名>: 审问嫌疑人\n- recreate: 重现犯罪现场\n- solve: 提交推理答案\n- status: 查看案件状态\n- help: 显示帮助信息",
    paradoxWarning: "⚠️ 时空悖论检测",
    timeRemaining: "时间剩余",
    paradoxResolved: "[时空] 悖论已解决，获得时间加速奖励！",
    paradoxFailed: "[时空] 悖论解决失败，时空干扰增强..."
  },
  en: {
    systemInit: `
████████╗███████╗███╗   ███╗██████╗  ██████╗ ██████╗  █████╗ ██╗     
╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██║     
   ██║   █████╗  ██╔████╔██║██████╔╝██║   ██║██████╔╝███████║██║     
   ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗██╔══██║██║     
   ██║   ███████╗██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

⧈ CHRONOS-CORRUPTION TERMINAL v2.47.∞ ⧈
⧊ Temporal Rift Detection System | Timeline ID: {{caseId}} ⧊
⧈ Quantum State: {{apiStatus}} ⧈
{{caseStatus}}
{{statusCommand}}

[SYSTEM] Temporal transmission link established...
[WARNING] Timeline instability detected...
[STATUS] Standing by... Type 'help' for available temporal operations
`,
    terminalSubtitle: "Tachyon-powered relic from a disintegrating timeline, patched with alien tech",
    processing: "[TEMPORAL COMPUTING]",
    aiModeReal: "Real AI Mode",
    aiModeDemo: "Demo Mode",
    caseRestored: "\n[TEMPORAL] Unfinished case detected, restoring timeline...",
    statusCommandText: "Type 'status' for case details",
    caseInfo: "\n━━━ Case Temporal Coordinates ━━━\nDescription: {{description}}\nVictim: {{victim}}\nSuspect Count: {{suspectCount}}\nEvidence Count: {{evidenceCount}}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    availableOperations: "\n⧈ Available Temporal Operations ⧈\n- interrogate <suspect name>: Interrogate suspect\n- recreate: Recreate crime scene\n- solve: Submit deduction\n- status: View case status\n- help: Show help information",
    paradoxWarning: "⚠️ Temporal Paradox Detected",
    timeRemaining: "Time Remaining",
    paradoxResolved: "[TEMPORAL] Paradox resolved, time acceleration bonus granted!",
    paradoxFailed: "[TEMPORAL] Paradox resolution failed, temporal interference intensified..."
  }
};
