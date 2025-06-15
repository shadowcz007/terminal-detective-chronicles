
import { Language } from '../hooks/useLanguage';

export interface CommandSuggestion {
  command: string;
  description: { zh: string; en: string };
  example: string;
  category: 'basic' | 'investigation' | 'config' | 'game';
  requiresCase?: boolean;
}

export const commandSuggestions: CommandSuggestion[] = [
  // Basic commands
  {
    command: 'help',
    description: {
      zh: '显示所有可用命令的帮助信息',
      en: 'Display help information for all available commands'
    },
    example: 'help',
    category: 'basic'
  },
  {
    command: 'clear',
    description: {
      zh: '清空终端屏幕',
      en: 'Clear the terminal screen'
    },
    example: 'clear',
    category: 'basic'
  },
  {
    command: 'status',
    description: {
      zh: '查看当前案件的状态和进展',
      en: 'Check current case status and progress'
    },
    example: 'status',
    category: 'basic',
    requiresCase: true
  },
  
  // Investigation commands
  {
    command: 'new_case',
    description: {
      zh: '生成一个新的案件开始调查',
      en: 'Generate a new case to start investigation'
    },
    example: 'new_case',
    category: 'investigation'
  },
  {
    command: 'list_suspects',
    description: {
      zh: '显示当前案件的嫌疑人名单',
      en: 'Display current case suspect list'
    },
    example: 'list_suspects',
    category: 'investigation',
    requiresCase: true
  },
  {
    command: 'interrogate',
    description: {
      zh: '审讯指定的嫌疑人或证人',
      en: 'Interrogate specified suspects or witnesses'
    },
    example: 'interrogate 1',
    category: 'investigation',
    requiresCase: true
  },
  {
    command: 'evidence',
    description: {
      zh: '查看当前案件的证据档案',
      en: 'View current case evidence files'
    },
    example: 'evidence',
    category: 'investigation',
    requiresCase: true
  },
  {
    command: 'recreate',
    description: {
      zh: '重现案发现场或特定场景',
      en: 'Recreate crime scenes or specific scenarios'
    },
    example: 'recreate',
    category: 'investigation',
    requiresCase: true
  },
  {
    command: 'submit',
    description: {
      zh: '提交最终结论，指控嫌疑人',
      en: 'Submit final conclusion and accuse suspect'
    },
    example: 'submit 1',
    category: 'investigation',
    requiresCase: true
  },
  {
    command: 'clear_case',
    description: {
      zh: '清除当前案件数据',
      en: 'Clear current case data'
    },
    example: 'clear_case',
    category: 'investigation',
    requiresCase: true
  },
  
  // Game commands
  {
    command: 'difficulty',
    description: {
      zh: '查看或设置游戏难度等级',
      en: 'View or set game difficulty level'
    },
    example: 'difficulty medium',
    category: 'game'
  },
  {
    command: 'records',
    description: {
      zh: '查看通关记录和统计',
      en: 'View completion records and statistics'
    },
    example: 'records',
    category: 'game'
  },
  {
    command: 'achievements',
    description: {
      zh: '查看解锁的成就',
      en: 'View unlocked achievements'
    },
    example: 'achievements',
    category: 'game'
  },
  {
    command: 'stats',
    description: {
      zh: '查看游戏统计数据',
      en: 'View game statistics'
    },
    example: 'stats',
    category: 'game'
  },
  {
    command: 'reset_progress',
    description: {
      zh: '重置游戏进度',
      en: 'Reset game progress'
    },
    example: 'reset_progress',
    category: 'game'
  },
  
  // Config commands
  {
    command: 'config',
    description: {
      zh: '查看或修改API设置',
      en: 'View or modify API settings'
    },
    example: 'config key your-api-key',
    category: 'config'
  }
];

export const getFilteredSuggestions = (
  input: string, 
  hasActiveCase: boolean, 
  language: Language
): CommandSuggestion[] => {
  const trimmedInput = input.trim().toLowerCase();
  
  // If input starts with '/', show all commands
  if (trimmedInput === '/') {
    return commandSuggestions.filter(cmd => 
      !cmd.requiresCase || hasActiveCase
    );
  }
  
  // Filter by input prefix
  const filtered = commandSuggestions.filter(cmd => {
    const matchesInput = cmd.command.toLowerCase().startsWith(trimmedInput);
    const hasCase = !cmd.requiresCase || hasActiveCase;
    return matchesInput && hasCase;
  });
  
  return filtered;
};
