
import { Suspect, GameState } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';
import { getInterrogationPrompt } from '../utils/prompts';
import { executeStreamingRequest } from '../utils/streamingUtils';

export const interrogateSuspect = async (
  suspect: Suspect, 
  gameState: GameState, 
  onToken?: (token: string) => void,
  language: Language = 'zh'
): Promise<string> => {
  // 生成唯一的prompt，包含时间戳和随机元素
  const promptText = getInterrogationPrompt(suspect, gameState, language);
  
  // 在开发模式下输出详细调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 === INTERROGATION SERVICE DEBUG ===`);
    console.log(`👤 Target Suspect Details:`);
    console.log(`   - Name: ${suspect.name}`);
    console.log(`   - ID: ${suspect.id}`);
    console.log(`   - Occupation: ${suspect.occupation}`);
    console.log(`   - Relationship: ${suspect.relationship}`);
    console.log(`   - Motive: ${suspect.motive.substring(0, 50)}...`);
    console.log(`🎯 Game State Context:`);
    console.log(`   - Current Interrogation: ${gameState.currentInterrogation}`);
    console.log(`   - Case ID: ${gameState.caseId}`);
    console.log(`   - Victim: ${gameState.victim}`);
    console.log(`   - Total Suspects: ${gameState.suspects.length}`);
    console.log(`📝 Prompt Details:`);
    console.log(`   - Length: ${promptText.length} characters`);
    console.log(`   - Preview: ${promptText.substring(0, 200)}...`);
    console.log(`🔄 Request Type: ${onToken ? 'Streaming' : 'Non-streaming'}`);
    console.log(`🌐 Language: ${language}`);
    console.log(`=================================`);
    
    // 验证状态一致性
    if (gameState.currentInterrogation !== suspect.id) {
      console.warn(`⚠️ STATE INCONSISTENCY WARNING:`);
      console.warn(`   Expected: ${suspect.id}`);
      console.warn(`   Actual currentInterrogation: ${gameState.currentInterrogation}`);
    } else {
      console.log(`✅ State consistency verified - currentInterrogation matches suspect ID`);
    }
  }
  
  // 如果有onToken回调，说明需要流式效果
  if (onToken) {
    const startTime = Date.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Starting streaming interrogation for ${suspect.name} at ${new Date(startTime).toISOString()}`);
    }
    
    const result = await executeStreamingRequest({
      promptText,
      apiConfig: gameState.apiConfig,
      language,
      startMessage: t('startInterrogation', language, { name: suspect.name }),
      completeMessage: t('interrogationStarted', language, { name: suspect.name }),
      tipMessage: t('interrogationTip', language)
    }, onToken);
    
    const endTime = Date.now();
    
    // 调试信息和结果验证
    if (process.env.NODE_ENV === 'development') {
      console.log(`🏁 Streaming interrogation completed for ${suspect.name}`);
      console.log(`⏱️ Duration: ${endTime - startTime}ms`);
      console.log(`📊 Result stats:`);
      console.log(`   - Length: ${result?.length || 0} characters`);
      console.log(`   - Contains suspect name: ${result?.includes(suspect.name) ? 'YES' : 'NO'}`);
      console.log(`   - Contains suspect occupation: ${result?.includes(suspect.occupation) ? 'YES' : 'NO'}`);
      
      // 结果一致性验证
      if (result) {
        const suspectNameInResult = result.includes(suspect.name);
        const suspectOccupationInResult = result.includes(suspect.occupation);
        
        if (suspectNameInResult && suspectOccupationInResult) {
          console.log(`✅ RESULT CONSISTENCY CHECK PASSED for ${suspect.name}`);
        } else {
          console.warn(`⚠️ RESULT CONSISTENCY WARNING for ${suspect.name}:`);
          console.warn(`   - Name found: ${suspectNameInResult}`);
          console.warn(`   - Occupation found: ${suspectOccupationInResult}`);
          console.warn(`   - This may indicate incorrect result association`);
        }
        
        // 显示结果预览
        console.log(`📝 Result preview: ${result.substring(0, 150)}...`);
      } else {
        console.error(`❌ Empty result returned for ${suspect.name}`);
      }
    }
    
    return result;
  } else {
    // 非流式模式，使用实际的API请求
    const { realLLMRequest } = await import('./llmClient');
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Starting non-streaming interrogation for ${suspect.name}`);
    }
    
    const result = await realLLMRequest(promptText, gameState.apiConfig);
    
    // 调试信息和结果验证
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Non-streaming interrogation completed for ${suspect.name}`);
      console.log(`📊 Result stats:`);
      console.log(`   - Length: ${result?.length || 0} characters`);
      console.log(`   - Contains suspect name: ${result?.includes(suspect.name) ? 'YES' : 'NO'}`);
      console.log(`📝 Result preview: ${result?.substring(0, 100)}...`);
      
      // 结果一致性验证
      if (result && !result.includes(suspect.name)) {
        console.warn(`⚠️ NON-STREAMING RESULT CONSISTENCY WARNING: Result may not match suspect ${suspect.name}`);
      }
    }
    
    return result;
  }
};
