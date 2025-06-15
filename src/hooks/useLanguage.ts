
import { useState, useEffect } from 'react';

export type Language = 'zh' | 'en';

export interface LanguageConfig {
  current: Language;
}

const DEFAULT_LANGUAGE: Language = 'en';

// 从本地存储加载语言设置
const loadLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem('ai-detective-language');
    return (savedLanguage as Language) || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Failed to load language from localStorage:', error);
    return DEFAULT_LANGUAGE;
  }
};

// 保存语言设置到本地存储
const saveLanguage = (language: Language) => {
  try {
    localStorage.setItem('ai-detective-language', language);
  } catch (error) {
    console.error('Failed to save language to localStorage:', error);
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(loadLanguage);

  const switchLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    switchLanguage(newLanguage);
  };

  return { language, switchLanguage, toggleLanguage };
};
