
// 简化的游戏片段生成器 - 适合单行显示
const weatherFragments = [
  '分析天气数据',
  '检测环境条件', 
  '评估气象因素',
  '记录温湿度',
  '分析风向变化'
];

const locationFragments = [
  '扫描现场布局',
  '测量房间尺寸',
  '检查门窗状态',
  '分析地形特征',
  '记录位置坐标'
];

const characterFragments = [
  '分析人物关系',
  '检查身份信息',
  '评估行为模式',
  '记录证人证词',
  '分析心理状态'
];

const investigationFragments = [
  '采集物证样本',
  '进行DNA分析',
  '检查指纹数据',
  '分析血迹分布',
  '重建时间线'
];

const allFragments = [
  ...weatherFragments,
  ...locationFragments,
  ...characterFragments,
  ...investigationFragments
];

export const generateRandomFragment = (): string => {
  const fragment = allFragments[Math.floor(Math.random() * allFragments.length)];
  return fragment;
};

// 创建单行流式效果，带有loading动画
export const createSingleLineStreamingEffect = (
  onUpdate: (text: string, isComplete: boolean) => void,
  duration: number = 4000
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = 800; // 每800ms更换一个片段
    const totalSteps = Math.floor(duration / interval);
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        onUpdate('', true); // 清空并标记完成
        resolve();
        return;
      }

      const fragment = generateRandomFragment();
      const dots = '.'.repeat((currentStep % 3) + 1); // 动态点点点效果
      onUpdate(`正在分析: ${fragment}${dots}`, false);
      
      currentStep++;
    }, interval);
  });
};
