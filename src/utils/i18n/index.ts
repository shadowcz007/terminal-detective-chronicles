
import { systemTranslations } from './system';
import { commandTranslations } from './commands';
import { errorTranslations } from './errors';
import { caseTranslations } from './case';
import { configTranslations } from './config';

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    ...systemTranslations.zh,
    ...commandTranslations.zh,
    ...errorTranslations.zh,
    ...caseTranslations.zh,
    ...configTranslations.zh,
  },
  en: {
    ...systemTranslations.en,
    ...commandTranslations.en,
    ...errorTranslations.en,
    ...caseTranslations.en,
    ...configTranslations.en,
  }
};

export const t = (key: string, language: Language, params?: Record<string, string>): string => {
  let text = translations[language][key as keyof typeof translations[typeof language]] || key;
  
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    });
  }
  
  return text;
};
