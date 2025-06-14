import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { executeCommand } from '../utils/commandHandler';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState(''); // 新增：专门处理loading文本
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { gameState, updateGameState, updateApiConfig } = useGameState();

  useEffect(() => {
    // 显示启动动画
    const initMessage = `
===============================================================================
                          █████╗ ██╗     ███████╗██████╗ 
                         ██╔══██╗██║     ██╔════╝██╔══██╗
                         ███████║██║     █████╗  ██║  ██║
                         ██╔══██║██║     ██╔══╝  ██║  ██║
                         ██║  ██║███████╗███████╗██████╔╝
                         ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ 
===============================================================================
AI DETECTIVE TERMINAL v2.1.5 | 当前案件ID: #${generateCaseId()}
-------------------------------------------------------------------------------
系统初始化完成... 
${gameState.apiConfig.key ? '✅ AI模式: 真实API (支持流式传输)' : '⚠️ AI模式: 模拟演示'}
输入 'help' 查看可用命令
输入 'config' 配置API设置
输入 'new_case' 开始新案件
`;
    addToHistory(initMessage);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentResponse]);

  const generateCaseId = () => {
    return `MH${new Date().getFullYear().toString().slice(-2)}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

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
          handleStreamToken
        );
        
        // 流式响应完成后，将当前响应添加到历史记录
        if (currentResponse) {
          addToHistory(currentResponse);
          setCurrentResponse('');
        }
        
        // 清空loading文本
        setLoadingText('');
        
        // 如果还有额外的结果信息，也添加到历史记录
        if (result && result !== currentResponse) {
          addToHistory(result);
        }

        // 显示操作提示
        if (command.toLowerCase().startsWith('new_case')) {
          addToHistory('\n可用操作：\n  list_suspects - 查看嫌疑人\n  evidence - 查看证据\n  recreate - 重现现场\n  interrogate [ID] - 审问嫌疑人');
        }
      } else {
        // 非流式命令或未配置API密钥
        const result = await executeCommand(command, gameState, updateGameState, updateApiConfig);
        addToHistory(result);
      }
    } catch (error) {
      addToHistory(`ERROR: ${error instanceof Error ? error.message : '未知错误'}`);
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
            <span className="mr-2">处理中</span>
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
