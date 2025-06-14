
export const configTranslations = {
  zh: {
    // 配置相关
    apiConfiguration: '=== API 配置 ===',
    endpoint: '端点',
    model: '模型',
    key: '密钥',
    notSet: '未设置',
    configUsage: `
使用方法:
  config url <API端点>    - 设置API端点
  config key <API密钥>    - 设置API密钥
  config model <模型名>   - 设置模型

常用配置示例:
  config url https://api.openai.com/v1/chat/completions
  config key sk-xxx...
  config model gpt-3.5-turbo`,
    configuredApiKey: '提示: ✅ 已配置API密钥，将使用真实AI',
    unconfiguredApiKey: '提示: ⚠️ 未配置API密钥，当前使用模拟AI',
    endpointCannotBeEmpty: 'API端点不能为空',
    endpointSet: 'API端点已设置为: {{url}}',
    keyCannotBeEmpty: 'API密钥不能为空',
    keySet: 'API密钥已设置 ({{key}}...)',
    modelCannotBeEmpty: '模型名不能为空',
    modelSet: '模型已设置为: {{model}}',
    unknownConfigItem: '未知配置项: {{item}}. 支持的配置项: url, key, model',
  },
  en: {
    // 配置相关
    apiConfiguration: '=== API Configuration ===',
    endpoint: 'Endpoint',
    model: 'Model',
    key: 'Key',
    notSet: 'Not set',
    configUsage: `
Usage:
  config url <API endpoint>    - Set API endpoint
  config key <API key>         - Set API key
  config model <model name>    - Set model

Common configuration examples:
  config url https://api.openai.com/v1/chat/completions
  config key sk-xxx...
  config model gpt-3.5-turbo`,
    configuredApiKey: 'Tip: ✅ API key configured, will use real AI',
    unconfiguredApiKey: 'Tip: ⚠️ API key not configured, currently using demo AI',
    endpointCannotBeEmpty: 'API endpoint cannot be empty',
    endpointSet: 'API endpoint set to: {{url}}',
    keyCannotBeEmpty: 'API key cannot be empty',
    keySet: 'API key set ({{key}}...)',
    modelCannotBeEmpty: 'Model name cannot be empty',
    modelSet: 'Model set to: {{model}}',
    unknownConfigItem: 'Unknown configuration item: {{item}}. Supported items: url, key, model',
  }
};
