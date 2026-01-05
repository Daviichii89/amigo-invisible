import { es } from './es';
import { en } from './en';

export type Language = 'es' | 'en';

const translations = {
  es,
  en,
};

const defaultLanguage: Language = 'es';

export function getLanguage(): Language {
  const stored = localStorage.getItem('language');
  if (stored === 'es' || stored === 'en') {
    return stored;
  }
  
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'es') return 'es';
  if (browserLang === 'en') return 'en';
  
  return defaultLanguage;
}

export function setLanguage(lang: Language): void {
  localStorage.setItem('language', lang);
}

export function t(key: string, language?: Language): string {
  const lang = language || getLanguage();
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (!value) {
    // Fallback to default language if key not found
    value = translations[defaultLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
  }
  
  return value || key;
}

export function tReplace(key: string, replacements: Record<string, string>, language?: Language): string {
  let text = t(key, language);
  for (const [key, value] of Object.entries(replacements)) {
    text = text.replace(`{${key}}`, value);
  }
  return text;
}

export function getTranslations(language?: Language) {
  const lang = language || getLanguage();
  return translations[lang];
}
