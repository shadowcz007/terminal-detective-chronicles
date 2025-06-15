
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useLanguage } from '../hooks/useLanguage';
import { executeCommand } from '../utils/commandHandler';
import { t } from '../utils/i18n';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import TemporalPanels from './ChronosUI/TemporalPanels';
import RealityBleed from './ChronosUI/RealityBleed';
import CrystalWiring from './ChronosUI/CrystalWiring';
import GlitchOverlay from './ChronosUI/GlitchOverlay';
import ParadoxMinigame from './ChronosUI/ParadoxMinigame';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showParadox, setShowParadox] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState<'low' | 'medium' | 'high'>('low');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
        suspectCount: (gameState.suspects || []).length.toString(),
        evidenceCount: (gameState.evidence || []).length.toString()
      });
      setHistory(prev => [...prev, caseInfo]);
    }
  }, [language, gameState.caseId, gameState.caseDescription, gameState.victim, gameState.suspects?.length || 0, gameState.evidence?.length || 0, gameState.apiConfig.key]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
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
    
    // 添加到命令历史记录
    if (command && !commandHistory.includes(command)) {
      setCommandHistory(prev => [...prev, command]);
    }
    
    setInput('');
    setHistoryIndex(-1); // 重置历史索引
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
          addToHistory(t('availableOperations', language));
        }
      } else {
        // 非流式命令或未配置API密钥
        const result = await executeCommand(command, gameState, updateGameState, updateApiConfig, undefined, language);
        addToHistory(result);
        
        // 在案件生成后显示操作提示（非流式模式）
        if (command.toLowerCase().startsWith('new_case')) {
          addToHistory(t('availableOperations', language));
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
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Check for paradox trigger
  useEffect(() => {
    const shouldTriggerParadox = Math.random() < 0.1 && isLoading && gameState.apiConfig.key;
    if (shouldTriggerParadox && !showParadox) {
      setTimeout(() => setShowParadox(true), 2000);
    }
  }, [isLoading, showParadox, gameState.apiConfig.key]);

  // Adjust glitch intensity based on difficulty
  useEffect(() => {
    switch (gameState.difficulty.level) {
      case 'easy':
        setGlitchIntensity('low');
        break;
      case 'hard':
        setGlitchIntensity('high');
        break;
      default:
        setGlitchIntensity('medium');
    }
  }, [gameState.difficulty.level]);

  const handleParadoxResolve = (success: boolean) => {
    if (success) {
      addToHistory(t('paradoxResolved', language));
      // Time acceleration bonus - reduce loading time
      setIsLoading(false);
    } else {
      addToHistory(t('paradoxFailed', language));
      // Add temporal interference
      setGlitchIntensity('high');
      setTimeout(() => setGlitchIntensity('medium'), 3000);
    }
    setShowParadox(false);
  };

  return (
    <div className="chronos-terminal h-screen flex flex-col relative overflow-hidden">
      <RealityBleed />
      <CrystalWiring />
      <GlitchOverlay intensity={glitchIntensity} active={true} />
      
      {showParadox && (
        <ParadoxMinigame
          onResolve={handleParadoxResolve}
          onClose={() => setShowParadox(false)}
        />
      )}

      {/* Main Content Area - now takes full height minus fixed input */}
      <div className="terminal-content flex-1 flex flex-col p-4 relative z-10 pb-20">
        {/* Language Switch in Temporal Panel */}
        <TemporalPanels timeSpeed="future">
          <div className="flex justify-between items-center mb-2">
            <div className="terminal-title">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                CHRONOS-CORRUPTION TERMINAL
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {t('terminalSubtitle', language)}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className={language === 'zh' ? 'text-cyan-400' : 'text-gray-500'}>中</span>
              <Switch
                checked={language === 'en'}
                onCheckedChange={toggleLanguage}
                className="data-[state=checked]:bg-cyan-600"
              />
              <span className={language === 'en' ? 'text-cyan-400' : 'text-gray-500'}>EN</span>
            </div>
          </div>
        </TemporalPanels>
        
        {/* Main Terminal Output Area with ScrollArea */}
        <TemporalPanels timeSpeed="present">
          <div className="flex-1 min-h-0">
            <ScrollArea 
              ref={scrollAreaRef}
              className="h-full terminal-output"
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed p-4">
                {history.map((line, index) => (
                  <div key={index} className="mb-1 terminal-line">
                    {line}
                  </div>
                ))}
                
                {/* Current streaming response */}
                {currentResponse && (
                  <div className="mb-1 streaming-response">
                    {currentResponse}
                    {isStreaming && <span className="cursor-quantum">█</span>}
                  </div>
                )}

                {/* Loading text */}
                {loadingText && (
                  <div className="mb-1 loading-line">
                    {loadingText}
                    <span className="cursor-quantum text-yellow-400">█</span>
                  </div>
                )}
                
                {isLoading && !isStreaming && !loadingText && (
                  <div className="flex items-center loading-indicator">
                    <span className="mr-2">{t('processing', language)}</span>
                    <div className="flex space-x-1">
                      <div className="quantum-dot"></div>
                      <div className="quantum-dot" style={{animationDelay: '0.2s'}}></div>
                      <div className="quantum-dot" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TemporalPanels>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
        <TemporalPanels timeSpeed="present">
          <form onSubmit={handleSubmit} className="flex temporal-input-fixed">
            <span className="mr-2 text-cyan-300 prompt-symbol">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-cyan-400 font-mono caret-cyan-400 terminal-input"
              disabled={isLoading}
              autoFocus
            />
            <span className="cursor-quantum text-cyan-300">█</span>
          </form>
        </TemporalPanels>
      </div>
    </div>
  );
};

export default Terminal;
