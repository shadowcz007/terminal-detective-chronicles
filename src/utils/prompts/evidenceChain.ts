import { Language } from '../i18n';
import { GameState, Evidence } from '../../types/gameTypes';

// 证据链分析结果
export interface EvidenceChainAnalysis {
   chainStrength: 'weak' | 'moderate' | 'strong';
   missingLinks: string[];
   contradictions: string[];
   supportingEvidence: Evidence[];
   eliminatingEvidence: Evidence[];
}

// 生成证据链分析prompt
export const getEvidenceChainPrompt = (gameState: GameState, language: Language): string => {
   const evidenceList = gameState.evidence?.map(e =>
      `- ${e.name}: ${e.description} (发现于: ${e.location})`
   ).join('\n') || '';

   const suspectList = gameState.suspects?.map(s =>
      `- ${s.name} (${s.occupation}): 动机=${s.motive}, 不在场证明=${s.alibi}`
   ).join('\n') || '';

   return language === 'zh' ? `
【证据链分析任务】
请基于以下案件信息，分析证据链的完整性和逻辑性：

案件背景：${gameState.caseDescription}
受害者：${gameState.victim}
案件真相：${gameState.solution}

现有证据：
${evidenceList}

嫌疑人信息：
${suspectList}

【分析要求】
请从以下角度分析证据链：

1. **证据指向性分析**
   - 哪些证据直接指向真凶？
   - 哪些证据可以排除其他嫌疑人？
   - 证据之间是否存在相互支撑的关系？

2. **逻辑漏洞识别**
   - 证据链中是否存在逻辑断层？
   - 是否有相互矛盾的证据？
   - 关键环节是否缺失证据支撑？

3. **证据质量评估**
   - 证据的可信度如何？
   - 是否存在可能被伪造的证据？
   - 证据的时间线是否合理？

4. **推理路径构建**
   - 从证据到结论的推理路径是否清晰？
   - 是否存在其他可能的解释？
   - 如何用现有证据说服陪审团？

请提供详细的分析报告，指出证据链的强弱点，并建议需要补充的关键证据。
` : `
【EVIDENCE CHAIN ANALYSIS TASK】
Please analyze the completeness and logic of the evidence chain based on the following case information:

Case Background: ${gameState.caseDescription}
Victim: ${gameState.victim}
Case Truth: ${gameState.solution}

Available Evidence:
${evidenceList}

Suspect Information:
${suspectList}

【ANALYSIS REQUIREMENTS】
Please analyze the evidence chain from the following perspectives:

1. **Evidence Direction Analysis**
   - Which evidence directly points to the real culprit?
   - Which evidence can eliminate other suspects?
   - Do the pieces of evidence support each other?

2. **Logic Gap Identification**
   - Are there logical gaps in the evidence chain?
   - Are there contradictory pieces of evidence?
   - Are key links missing evidence support?

3. **Evidence Quality Assessment**
   - How credible is the evidence?
   - Is there evidence that could be forged?
   - Is the evidence timeline reasonable?

4. **Reasoning Path Construction**
   - Is the reasoning path from evidence to conclusion clear?
   - Are there other possible explanations?
   - How to convince a jury with existing evidence?

Please provide a detailed analysis report, pointing out the strengths and weaknesses of the evidence chain, and suggest key evidence that needs to be supplemented.
`;
};

// 生成证据补强建议prompt
export const getEvidenceReinforcementPrompt = (
   weakPoints: string[],
   gameState: GameState,
   language: Language
): string => {
   const weakPointsList = weakPoints.map((point, index) => `${index + 1}. ${point}`).join('\n');

   return language === 'zh' ? `
【证据补强任务】
基于以下识别出的证据链薄弱点，请生成补强证据建议：

当前案件：${gameState.caseDescription}
真凶：${gameState.solution}

识别出的薄弱点：
${weakPointsList}

【补强要求】
请为每个薄弱点提供具体的证据补强建议：

1. **新证据类型**：建议添加什么类型的证据
2. **证据描述**：详细描述这个证据的内容和特征
3. **发现地点**：合理的证据发现位置
4. **逻辑作用**：这个证据如何加强整体证据链
5. **排除干扰**：如何避免这个证据被误解或质疑

请确保建议的证据：
- 与案件背景高度吻合
- 符合真凶的作案手法和心理
- 能够有效排除其他嫌疑人
- 在时间线上完全合理
- 具有足够的说服力
` : `
【EVIDENCE REINFORCEMENT TASK】
Based on the following identified weak points in the evidence chain, please generate evidence reinforcement suggestions:

Current Case: ${gameState.caseDescription}
Real Culprit: ${gameState.solution}

Identified Weak Points:
${weakPointsList}

【REINFORCEMENT REQUIREMENTS】
Please provide specific evidence reinforcement suggestions for each weak point:

1. **New Evidence Type**: What type of evidence should be added
2. **Evidence Description**: Detailed description of the evidence content and characteristics
3. **Discovery Location**: Reasonable location where evidence was found
4. **Logical Function**: How this evidence strengthens the overall evidence chain
5. **Eliminate Interference**: How to prevent this evidence from being misunderstood or questioned

Please ensure the suggested evidence:
- Highly matches the case background
- Conforms to the real culprit's method and psychology
- Can effectively eliminate other suspects
- Is completely reasonable in the timeline
- Has sufficient persuasive power
`;
};

// 生成误导证据设计prompt
export const getMisleadingEvidencePrompt = (gameState: GameState, language: Language): string => {
   return language === 'zh' ? `
【误导证据设计任务】
为了增加案件的推理难度和真实性，请设计一些巧妙的误导证据：

案件背景：${gameState.caseDescription}
真凶：${gameState.solution}
无辜嫌疑人：${gameState.suspects?.filter(s => !gameState.solution.includes(s.name)).map(s => s.name).join(', ')}

【设计要求】
请设计2-3个误导证据，每个证据应该：

1. **表面指向**：看起来指向某个无辜的嫌疑人
2. **合理解释**：有合理的替代解释，不会真正冤枉无辜者
3. **巧妙设计**：需要仔细分析才能发现其误导性
4. **增加难度**：让推理过程更加复杂和有趣

【输出格式】
对每个误导证据，请提供：
- 证据名称和描述
- 表面上指向哪个嫌疑人
- 为什么看起来有罪
- 真实的解释是什么
- 如何通过进一步调查揭穿误导性

请确保误导证据：
- 不会导致逻辑矛盾
- 有合理的存在原因
- 增加推理乐趣而非纯粹困扰
- 最终能够被聪明的侦探识破
` : `
【MISLEADING EVIDENCE DESIGN TASK】
To increase the reasoning difficulty and realism of the case, please design some clever misleading evidence:

Case Background: ${gameState.caseDescription}
Real Culprit: ${gameState.solution}
Innocent Suspects: ${gameState.suspects?.filter(s => !gameState.solution.includes(s.name)).map(s => s.name).join(', ')}

【DESIGN REQUIREMENTS】
Please design 2-3 pieces of misleading evidence, each should:

1. **Surface Direction**: Appears to point to an innocent suspect
2. **Reasonable Explanation**: Has reasonable alternative explanation, won't truly frame innocents
3. **Clever Design**: Requires careful analysis to discover its misleading nature
4. **Increase Difficulty**: Makes the reasoning process more complex and interesting

【OUTPUT FORMAT】
For each misleading evidence, please provide:
- Evidence name and description
- Which suspect it superficially points to
- Why it seems incriminating
- What the real explanation is
- How to expose the misleading nature through further investigation

Please ensure misleading evidence:
- Won't cause logical contradictions
- Has reasonable reasons for existence
- Adds reasoning fun rather than pure confusion
- Can ultimately be seen through by clever detectives
`;
};