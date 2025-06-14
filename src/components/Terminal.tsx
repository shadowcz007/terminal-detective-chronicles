import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useLanguage } from '../hooks/useLanguage';
import { executeCommand } from '../utils/commandHandler';
import { t } from '../utils/i18n';
import { Switch } from '@/components/ui/switch';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { gameState, updateGameState, updateApiConfig } = useGameState();
  const { language, toggleLanguage } = useLanguage();

  // 生成案件ID的函数
  const generateCaseId = () => {
    return `MH${new Date().getFullYear().toString().slice(-2)}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  useEffect(() => {
    // 检查是否有保存的案件
    const hasExistingCase = gameState.caseId && gameState.caseDescription;
    
    // 显示启动动画 - 根据语言显示对应的提示信息
    const apiStatus = gameState.apiConfig.key ? t('aiModeReal', language) : t('aiModeDemo', language);
    const caseStatus = hasExistingCase ? t('caseRestored', language) : '';
    const statusCommand = hasExistingCase ? t('statusCommandText', language) : '';
    
    const initMessage = t('systemInit', language, {
      caseId: hasExistingCase ? gameState.caseId : generateCaseId(),
      apiStatus,
      caseStatus,
      statusCommand
    });
    
    // 清空历史记录并添加新的初始化信息
    setHistory([initMessage]);

    // 如果有现有案件，显示案件信息
    if (hasExistingCase) {
      const caseInfo = t('caseInfo', language, {
        description: gameState.caseDescription,
        victim: gameState.victim,
        suspectCount: gameState.suspects.length.toString(),
        evidenceCount: gameState.evidence.length.toString()
      });
      setHistory(prev => [...prev, caseInfo]);
    }
  }, [language, gameState.caseId, gameState.caseDescription, gameState.victim, gameState.suspects.length, gameState.evidence.length, gameState.apiConfig.key]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentResponse]);

  const addToHistory = (text: string) => {
    setHistory(prev => [...prev, text]);
  };

  const handleStreamToken = (token: string) => {
    if (token.startsWith('\r')) {
      // 处理单行更新（回车符开头）
      setLoadingText(token.slice(1));
    } else {
      // 处理正常流式输出
      setCurrentResponse(prev => prev + token);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const command = input.trim();
    addToHistory(`> ${command}`);
    setInput('');
    setIsLoading(true);
    setCurrentResponse('');
    setLoadingText('');

    // 检查是否是需要流式响应的命令
    const streamingCommands = ['new_case', 'interrogate', 'recreate'];
    const shouldStream = streamingCommands.some(cmd => command.toLowerCase().startsWith(cmd));

    try {
      if (shouldStream && gameState.apiConfig.key) {
        setIsStreaming(true);
        const result = await executeCommand(
          command, 
          gameState, 
          updateGameState, 
          updateApiConfig,
          handleStreamToken,
          language // 传递语言参数
        );
        
        // 流式响应完成后，将当前响应添加到历史记录
        if (currentResponse) {
          addToHistory(currentResponse);
          setCurrentResponse('');
        }
        
        // 清空loading文本
        setLoadingText('');
        
        // 如果还有额外的结果信息，也添加到历史记录
        if (result && result !== currentResponse && result.trim()) {
          addToHistory(result);
        }

        // 在案件生成后显示操作提示
        if (command.toLowerCase().startsWith('new_case')) {
          const operations = language === 'zh' ? `
可用操作：
  list_suspects - 查看嫌疑人详情
  evidence - 查看证据档案  
  recreate - 重现犯罪现场
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  status - 查看案件状态
  submit [ID] - 提交最终结论` : `
Available Operations:
  list_suspects - View suspect details
  evidence - View evidence files
  recreate - Recreate crime scene  
  interrogate [ID] - Interrogate suspect (e.g: interrogate 1)
  status - Check case status
  submit [ID] - Submit final conclusion`;
          addToHistory(operations);
        }
      } else {
        // 非流式命令或未配置API密钥
        const result = await executeCommand(command, gameState, updateGameState, updateApiConfig, undefined, language);
        addToHistory(result);
        
        // 在案件生成后显示操作提示（非流式模式）
        if (command.toLowerCase().startsWith('new_case')) {
          const operations = language === 'zh' ? `
可用操作：
  list_suspects - 查看嫌疑人详情
  evidence - 查看证据档案  
  recreate - 重现犯罪现场
  interrogate [ID] - 审问嫌疑人 (例: interrogate 1)
  status - 查看案件状态
  submit [ID] - 提交最终结论` : `
Available Operations:
  list_suspects - View suspect details
  evidence - View evidence files
  recreate - Recreate crime scene  
  interrogate [ID] - Interrogate suspect (e.g: interrogate 1)
  status - Check case status
  submit [ID] - Submit final conclusion`;
          addToHistory(operations);
        }
      }
    } catch (error) {
      const errorMsg = language === 'zh' ? 
        `ERROR: ${error instanceof Error ? error.message : '未知错误'}` :
        `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`;
      addToHistory(errorMsg);
    }

    setIsLoading(false);
    setIsStreaming(false);
    setLoadingText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-black text-green-400 font-mono">
      {/* 语言切换开关 */}
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className={language === 'zh' ? 'text-green-400' : 'text-gray-500'}>中</span>
          <Switch
            checked={language === 'en'}
            onCheckedChange={toggleLanguage}
            className="data-[state=checked]:bg-green-600"
          />
          <span className={language === 'en' ? 'text-green-400' : 'text-gray-500'}>EN</span>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 whitespace-pre-wrap text-sm leading-relaxed"
        style={{ 
          textShadow: '0 0 5px currentColor',
          fontFamily: 'Courier New, monospace'
        }}
      >
        {history.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
        
        {/* 显示当前流式响应 */}
        {currentResponse && (
          <div className="mb-1">
            {currentResponse}
            {isStreaming && <span className="animate-pulse">█</span>}
          </div>
        )}

        {/* 显示loading文本（单行更新） */}
        {loadingText && (
          <div className="mb-1">
            {loadingText}
            <span className="animate-pulse text-yellow-400">█</span>
          </div>
        )}
        
        {isLoading && !isStreaming && !loadingText && (
          <div className="flex items-center">
            <span className="mr-2">{t('processing', language)}</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2 text-green-300">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono caret-green-400"
          style={{ 
            textShadow: '0 0 5px currentColor',
            fontFamily: 'Courier New, monospace'
          }}
          disabled={isLoading}
          autoFocus
        />
        <span className="animate-pulse text-green-300">█</span>
      </form>
    </div>
  );
};

export default Terminal;
