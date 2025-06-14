
// 统一的AI服务入口，重新导出所有功能
export { generateCase } from '../services/caseGenerator';
export { interrogateSuspect } from '../services/interrogationService';
export { generateCrimeScene } from '../services/sceneService';
export { streamLLMRequest, realLLMRequest, llmRequest } from '../services/llmClient';
export { mockLLMRequest } from '../services/mockService';
