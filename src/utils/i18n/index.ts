
import { systemTranslations } from './system';
import { commandTranslations } from './commands';
import { errorTranslations } from './errors';
import { caseTranslations } from './case';
import { configTranslations } from './config';
import { gameFragmentsTranslations } from './gameFragments';
import { difficultyTranslations } from './difficulty';
import { welcomeTranslations } from './welcome';

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    ...systemTranslations.zh,
    ...commandTranslations.zh,
    ...errorTranslations.zh,
    ...caseTranslations.zh,
    ...configTranslations.zh,
    ...gameFragmentsTranslations.zh,
    ...difficultyTranslations.zh,
    ...welcomeTranslations.zh,
  },
  en: {
    ...systemTranslations.en,
    ...commandTranslations.en,
    ...errorTranslations.en,
    ...caseTranslations.en,
    ...configTranslations.en,
    ...gameFragmentsTranslations.en,
    ...difficultyTranslations.en,
    ...welcomeTranslations.en,
  }
};

export const t = (key: string, language: Language, params?: Record<string, string>): string => {
  const value = translations[language][key as keyof typeof translations[typeof language]];
  
  // If value is undefined, return key
  if (value === undefined) {
    return key;
  }
  
  // If value is not a string (like nested objects), return key
  if (typeof value !== 'string') {
    return key;
  }
  
  let text = value;
  
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    });
  }
  
  return text;
};
