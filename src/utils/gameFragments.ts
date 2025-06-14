
// 游戏片段生成器 - 用于在案件生成时提供视觉反馈
const weatherFragments = [
  '夜幕降临，雨水敲打着窗户',
  '月光透过云层洒向大地',
  '寒风呼啸，街道空无一人',
  '雾气弥漫，能见度极低',
  '雷声隆隆，电光划破夜空',
  '细雨绵绵，路面湿滑',
  '晨曦初现，鸟儿开始鸣叫',
  '阴云密布，压抑的气氛'
];

const locationFragments = [
  '豪华别墅的灯光渐渐暗淡',
  '办公大楼里传来异样的声音',
  '古老庄园的秘密房间',
  '市中心的高档公寓',
  '郊外的废弃工厂',
  '码头附近的仓库区',
  '繁华商业街的后巷',
  '静谧的住宅小区'
];

const characterFragments = [
  '一个神秘的身影匆匆离去',
  '目击者的证词存在矛盾',
  '嫌疑人的表情显得紧张',
  '关键人物拒绝配合调查',
  '意外发现了隐藏的线索',
  '某人的不在场证明有漏洞',
  '重要证人突然改口',
  '新的嫌疑人浮出水面'
];

const investigationFragments = [
  '法医正在检查现场',
  '指纹分析结果即将出炉',
  '监控录像显示异常',
  'DNA检测发现新线索',
  '血迹分析揭示真相',
  '凶器上发现关键证据',
  '时间线存在可疑之处',
  '动机调查取得突破'
];

const allFragments = [
  ...weatherFragments,
  ...locationFragments,
  ...characterFragments,
  ...investigationFragments
];

export const generateRandomFragment = (): string => {
  const fragment = allFragments[Math.floor(Math.random() * allFragments.length)];
  return fragment + '...';
};

export const createStreamingEffect = (
  onToken: (token: string) => void,
  duration: number = 3000
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = 100; // 每100ms输出一个片段
    const totalSteps = Math.floor(duration / interval);
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        resolve();
        return;
      }

      const fragment = generateRandomFragment();
      // 模拟打字机效果，逐字符输出
      let charIndex = 0;
      const charTimer = setInterval(() => {
        if (charIndex >= fragment.length) {
          clearInterval(charTimer);
          onToken('\n');
          return;
        }
        onToken(fragment[charIndex]);
        charIndex++;
      }, 30);

      currentStep++;
    }, interval);
  });
};
