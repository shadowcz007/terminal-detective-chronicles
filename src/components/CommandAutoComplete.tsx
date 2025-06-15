import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { commandSuggestions, getFilteredSuggestions, CommandSuggestion } from '../utils/commandSuggestions';
import { Language } from '../hooks/useLanguage';

interface CommandAutoCompleteProps {
  input: string;
  onSelect: (command: string) => void;
  onClose: () => void;
  isVisible: boolean;
  hasActiveCase: boolean;
  language: Language;
}

const CommandAutoComplete: React.FC<CommandAutoCompleteProps> = ({
  input,
  onSelect,
  onClose,
  isVisible,
  hasActiveCase,
  language
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<CommandSuggestion[]>([]);
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const suggestions = getFilteredSuggestions(input, hasActiveCase, language);
      setFilteredSuggestions(suggestions);
      setSelectedIndex(0);
    }
  }, [input, isVisible, hasActiveCase, language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || filteredSuggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case 'Tab':
        case 'Enter':
          if (e.key === 'Tab') {
            e.preventDefault();
          }
          if (filteredSuggestions[selectedIndex]) {
            onSelect(filteredSuggestions[selectedIndex].command);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, filteredSuggestions, selectedIndex, onSelect, onClose]);

  if (!isVisible || filteredSuggestions.length === 0) {
    return null;
  }

  const categoryColors = {
    basic: 'text-cyan-400',
    investigation: 'text-purple-400',
    config: 'text-yellow-400',
    game: 'text-green-400'
  };

  const categoryNames = {
    basic: language === 'zh' ? '基础' : 'Basic',
    investigation: language === 'zh' ? '调查' : 'Investigation',
    config: language === 'zh' ? '配置' : 'Config',
    game: language === 'zh' ? '游戏' : 'Game'
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div 
        className="relative overflow-hidden rounded-lg shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #16213e 50%, #0a0a0a 100%)',
          border: '2px solid rgba(34, 211, 238, 0.5)',
          boxShadow: `
            0 0 30px rgba(34, 211, 238, 0.3),
            inset 0 0 20px rgba(34, 211, 238, 0.1),
            0 0 60px rgba(59, 130, 246, 0.2)
          `
        }}
      >
        {/* 添加时空特效背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"></div>
        </div>
        
        <Command ref={commandRef} className="bg-transparent relative z-10">
          <CommandList className="max-h-64">
            <CommandEmpty className="py-6 text-center text-sm text-gray-400">
              {language === 'zh' ? '未找到命令' : 'No commands found'}
            </CommandEmpty>
            
            {Object.entries(
              filteredSuggestions.reduce((acc, cmd, index) => {
                if (!acc[cmd.category]) acc[cmd.category] = [];
                acc[cmd.category].push({ ...cmd, originalIndex: index });
                return acc;
              }, {} as Record<string, (CommandSuggestion & { originalIndex: number })[]>)
            ).map(([category, commands]) => (
              <CommandGroup 
                key={category}
                heading={
                  <span className={`${categoryColors[category as keyof typeof categoryColors]} font-semibold text-xs uppercase tracking-wider`}>
                    {categoryNames[category as keyof typeof categoryNames]}
                  </span>
                }
              >
                {commands.map((cmd) => (
                  <CommandItem
                    key={cmd.command}
                    onSelect={() => onSelect(cmd.command)}
                    className={`
                      px-4 py-3 cursor-pointer transition-all duration-200 relative
                      ${cmd.originalIndex === selectedIndex 
                        ? 'bg-cyan-500/20 border-l-2 border-cyan-400' 
                        : 'hover:bg-black/70 hover:border-l-2 hover:border-cyan-400/50'
                      }
                    `}
                    style={cmd.originalIndex === selectedIndex ? {
                      boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.1)'
                    } : undefined}
                  >
                    <div className="flex flex-col space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 font-semibold">
                          {cmd.command}
                        </span>
                        <span 
                          className={`text-xs px-2 py-1 rounded ${categoryColors[cmd.category]}`}
                          style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(34, 211, 238, 0.2)'
                          }}
                        >
                          {categoryNames[cmd.category]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {cmd.description[language]}
                      </p>
                      <div 
                        className="rounded px-2 py-1 font-mono text-xs text-green-400"
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {'> '}{cmd.example}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
      
      {/* Navigation hint */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        <span className="mr-4">↑↓ {language === 'zh' ? '导航' : 'Navigate'}</span>
        <span className="mr-4">Tab/Enter {language === 'zh' ? '选择' : 'Select'}</span>
        <span>Esc {language === 'zh' ? '关闭' : 'Close'}</span>
      </div>
    </div>
  );
};

export default CommandAutoComplete;
