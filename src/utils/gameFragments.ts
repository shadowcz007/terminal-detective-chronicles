
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

// 创建单行流式效果，带有loading动画
export const createSingleLineStreamingEffect = (
  onUpdate: (text: string, isComplete: boolean) => void,
  language: Language,
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

      const fragment = generateRandomFragment(language);
      const dots = '.'.repeat((currentStep % 3) + 1); // 动态点点点效果
      const analyzingText = t('analyzing', language);
      onUpdate(`${analyzingText}: ${fragment}${dots}`, false);
      
      currentStep++;
    }, interval);
  });
};
