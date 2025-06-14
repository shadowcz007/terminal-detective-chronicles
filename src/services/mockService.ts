
// 模拟AI请求函数 - 在实际应用中替换为真实API调用
export const mockLLMRequest = async (prompt: string): Promise<string> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 根据提示词类型返回不同的模拟响应
  if (prompt.includes('案件生成') || prompt.includes('generate a complex murder case')) {
    return JSON.stringify({
      victim: '陈国栋',
      description: '亿万富翁陈国栋被发现死于私人书房，心脏被拆信刀刺穿',
      suspects: [
        {
          id: 'suspect_1',
          name: '张丽丽',
          occupation: '死者妻子',
          relationship: '夫妻关系',
          motive: '发现丈夫出轨并准备离婚，担心失去巨额财产继承权',
          alibi: '声称案发时在楼上卧室休息'
        },
        {
          id: 'suspect_2', 
          name: '王明远',
          occupation: '商业伙伴',
          relationship: '合作伙伴',
          motive: '因为十亿元项目分歧，死者威胁要撤销合作协议',
          alibi: '声称在公司加班到深夜'
        },
        {
          id: 'suspect_3',
          name: '李志强', 
          occupation: '私人医生',
          relationship: '医患关系',
          motive: '曾经误诊导致死者母亲去世，一直被死者威胁要曝光',
          alibi: '声称在医院值夜班'
        }
      ],
      evidence: [
        {
          id: 'evidence_1',
          name: '血迹拆信刀',
          description: '凶器，刀柄上发现指纹，但已被人为擦拭过',
          location: '死者胸前'
        },
        {
          id: 'evidence_2',
          name: '破碎花瓶',
          description: '昂贵的古董花瓶碎片，疑似搏斗时被打碎',
          location: '书房阳台'
        }
      ],
      solution: 'suspect_1'
    });
  }
  
  if (prompt.includes('审问') || prompt.includes('interrogating suspect')) {
    const responses = [
      '我当时在楼上休息，什么都没听到...',
      '这个问题我不想回答，请问其他的吧。',
      '我和死者的关系很复杂，但我绝对没有杀他！',
      '你这是在怀疑我吗？我有不在场证明！',
      '那天晚上确实有些异常，但我保证不是我做的...'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (prompt.includes('犯罪现场') || prompt.includes('crime scene recreation')) {
    return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                书房平面图                                     ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║    ┌─────────────────────────────────────┐    ┌─────────────────────────────┐ ║
║    │              书房主区域              │    │           阳台区域           │ ║
║    │                                     │    │                             │ ║
║    │  ┌─────┐     ┌─────────┐           │    │      ☠ 破碎花瓶             │ ║
║    │  │书架 │     │  办公桌  │           │    │         碎片                │ ║
║    │  │     │     │    💻   │           │    │                             │ ║
║    │  └─────┘     │  🗂️📎  │           │    │  ┌─────┐                   │ ║
║    │              └─────────┘           │    │  │花台 │                   │ ║
║    │                                     │    │  └─────┘                   │ ║
║    │         💀 尸体位置                 │    │                             │ ║
║    │        🔪 拆信刀                   │    │                             │ ║
║    │       🩸 血迹                      │    │                             │ ║
║    │                                     │    │                             │ ║
║    │  ┌─────┐                           │    │                             │ ║
║    │  │沙发 │                           │    │                             │ ║
║    │  └─────┘                           │    │                             │ ║
║    └─────────────────────────────────────┘    └─────────────────────────────┘ ║
║                               │                                               ║
║                               │                                               ║
║                          ┌─────────┐                                         ║
║                          │   门口   │                                         ║
║                          └─────────┘                                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

现场分析:
• 死者倒在办公桌前，面朝阳台方向
• 拆信刀插在胸前，角度表明凶手身高约1.7米
• 阳台花瓶被打碎，疑似搏斗痕迅
• 办公桌上文件散乱，但电脑未被触碰
• 门锁完好，内部反锁，凶手可能从阳台逃脱
`;
  }
  
  return '模拟AI响应：请检查提示词内容';
};
