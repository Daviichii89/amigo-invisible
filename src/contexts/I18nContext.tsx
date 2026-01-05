import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getLanguage, setLanguage as saveLanguage, getTranslations } from '../i18n/index';
import type { Language } from '../i18n/index';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tReplace: (key: string, replacements: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    setLanguageState(getLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    saveLanguage(lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = getTranslations(language);
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      // Fallback to default language if key not found
      value = getTranslations('es');
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    return value || key;
  };

  const tReplace = (key: string, replacements: Record<string, string>): string => {
    let text = t(key);
    for (const [key, value] of Object.entries(replacements)) {
      text = text.replace(`{${key}}`, value);
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tReplace }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n debe ser usado dentro de I18nProvider');
  }
  return context;
}
