
import { ApiConfig } from '../hooks/useGameState';
import { Language, t } from '../utils/i18n';

// 流式响应处理函数
export const streamLLMRequest = async (
  prompt: string, 
  apiConfig: ApiConfig,
  onToken: (token: string) => void
): Promise<string> => {
  if (!apiConfig.key.trim()) {
    throw new Error(t('apiKeyNotConfigured', 'zh'));
  }

  if (!apiConfig.url.trim()) {
    throw new Error(t('apiEndpointNotConfigured', 'zh'));
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })
  };

  try {
    const response = await fetch(apiConfig.url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${t('apiRequestFailed', 'zh')}: ${response.status} ${response.statusText} - ${errorData.error?.message || t('unknownError', 'zh')}`);
    }

    if (!response.body) {
      throw new Error(t('emptyResponseBody', 'zh'));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            return fullContent;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
              const content = parsed.choices[0].delta.content;
              if (content) {
                fullContent += content;
                onToken(content);
                // 添加延迟以实现打字机效果
                await new Promise(resolve => setTimeout(resolve, 30));
              }
            }
          } catch (e) {
            // 忽略解析错误的行
            continue;
          }
        }
      }
    }

    return fullContent;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`${t('networkRequestFailed', 'zh')}: ${error}`);
  }
};

// 真实的LLM API请求函数 - 非流式版本，作为备用
export const realLLMRequest = async (prompt: string, apiConfig: ApiConfig): Promise<string> => {
  if (!apiConfig.key.trim()) {
    throw new Error(t('apiKeyNotConfigured', 'zh'));
  }

  if (!apiConfig.url.trim()) {
    throw new Error(t('apiEndpointNotConfigured', 'zh'));
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  };

  try {
    const response = await fetch(apiConfig.url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${t('apiRequestFailed', 'zh')}: ${response.status} ${response.statusText} - ${errorData.error?.message || t('unknownError', 'zh')}`);
    }

    const data = await response.json();
    
    // 适配新的响应格式
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error(t('invalidApiResponse', 'zh'));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`${t('networkRequestFailed', 'zh')}: ${error}`);
  }
};

// 使用流式API或模拟API的请求函数
export const llmRequest = async (
  prompt: string, 
  apiConfig: ApiConfig, 
  onToken?: (token: string) => void
): Promise<string> => {
  // 如果配置了API密钥，使用真实API，否则使用模拟API
  if (apiConfig.key.trim()) {
    if (onToken) {
      return await streamLLMRequest(prompt, apiConfig, onToken);
    } else {
      return await realLLMRequest(prompt, apiConfig);
    }
  } else {
    const { mockLLMRequest } = await import('./mockService');
    return await mockLLMRequest(prompt);
  }
};
