
import { Language, t } from './i18n';

// 游戏片段类型定义
const fragmentTypes = {
  weather: [
    'analyzeWeatherData',
    'detectEnvironmentalConditions', 
    'evaluateMeteorologicalFactors',
    'recordTemperatureHumidity',
    'analyzeWindDirectionChanges'
  ],
  location: [
    'scanSceneLayout',
    'measureRoomDimensions',
    'checkWindowDoorStatus',
    'analyzeTerrainFeatures',
    'recordLocationCoordinates'
  ],
  character: [
    'analyzeCharacterRelationships',
    'checkIdentityInformation',
    'evaluateBehaviorPatterns',
    'recordWitnessTestimony',
    'analyzePsychologicalState'
  ],
  investigation: [
    'collectEvidenceSamples',
    'performDNAAnalysis',
    'checkFingerprintData',
    'analyzeBloodstainDistribution',
    'reconstructTimeline'
  ]
};

const allFragmentKeys = [
  ...fragmentTypes.weather,
  ...fragmentTypes.location,
  ...fragmentTypes.character,
  ...fragmentTypes.investigation
];

export const generateRandomFragment = (language: Language): string => {
  const fragmentKey = allFragmentKeys[Math.floor(Math.random() * allFragmentKeys.length)];
  return t(fragmentKey, language);
};

// 创建单行流式效果，带有loading动画，支持外部停止条件
export const createSingleLineStreamingEffect = (
  onUpdate: (text: string, isComplete: boolean) => void,
  language: Language,
  shouldStop: () => boolean, // 新增：外部停止条件函数
  interval: number = 800 // 可选：更新间隔时间
): Promise<void> => {
  return new Promise((resolve) => {
    let currentStep = 0;

    const timer = setInterval(() => {
      // 检查外部停止条件
      if (shouldStop()) {
        clearInterval(timer);
        onUpdate('', true); // 清空并标记完成
        resolve();
        return;
      }

      const fragment = generateRandomFragment(language);
      const dots = '.'.repeat((currentStep % 3) + 1); // 动态点点点效果
      const analyzingText = t('analyzing', language);
      onUpdate(`${analyzingText}: ${fragment}${dots}`, false);
      
      currentStep++;
    }, interval);
  });
};
