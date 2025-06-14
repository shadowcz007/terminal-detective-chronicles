
export const errorTranslations = {
  zh: {
    // LLM Client errors
    apiKeyNotConfigured: 'API密钥未配置，请先在config中设置',
    apiEndpointNotConfigured: 'API端点未配置，请先在config中设置',
    apiRequestFailed: 'API请求失败',
    emptyResponseBody: '响应体为空',
    networkRequestFailed: '网络请求失败',
    invalidApiResponse: 'API响应格式错误',
    
    // 错误和提示信息
    noCurrentCase: '当前没有案件需要清除',
    caseGenerationFailed: '案件生成失败: {{error}}',
    validSuspectId: '请指定有效的嫌疑人编号，例如: interrogate 1',
    interrogationFailed: '审问失败: {{error}}',
    generateCaseFirst: '请先生成案件才能重现犯罪现场',
    sceneRecreationFailed: '现场重现失败: {{error}}',
    specifyAccusedSuspect: '请指定要指控的嫌疑人编号，例如: submit 2',
  },
  en: {
    // LLM Client errors
    apiKeyNotConfigured: 'API key not configured, please set it in config first',
    apiEndpointNotConfigured: 'API endpoint not configured, please set it in config first',
    apiRequestFailed: 'API request failed',
    emptyResponseBody: 'Empty response body',
    networkRequestFailed: 'Network request failed',
    invalidApiResponse: 'Invalid API response format',
    
    // 错误和提示信息
    noCurrentCase: 'No case to clear currently',
    caseGenerationFailed: 'Case generation failed: {{error}}',
    validSuspectId: 'Please specify a valid suspect ID, e.g., interrogate 1.',
    interrogationFailed: 'Interrogation failed: {{error}}',
    generateCaseFirst: 'Please generate a case first to recreate the crime scene.',
    sceneRecreationFailed: 'Scene recreation failed: {{error}}',
    specifyAccusedSuspect: 'Please specify the suspect ID to accuse, e.g., submit 2.',
  }
};
