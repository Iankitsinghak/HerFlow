
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations: Record<string, any> = {
  en,
  hi
};

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    // Add more Indian languages here
    // { code: 'bn', name: 'বাংলা' }, // Bengali
    // { code: 'te', name: 'తెలుగు' }, // Telugu
    // { code: 'mr', name: 'मराठी' }, // Marathi
    // { code: 'ta', name: 'தமிழ்' }, // Tamil
    // { code: 'gu', name: 'ગુજરાતી' }, // Gujarati
    // { code: 'kn', name: 'ಕನ್ನಡ' }, // Kannada
    // { code: 'ml', name: 'മലയാളം' }, // Malayalam
    // { code: 'pa', name: 'ਪੰਜਾਬੀ' }, // Punjabi
    // { code: 'or', name: 'ଓଡ଼ିଆ' }, // Odia
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      setLanguageState(browserLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is not found
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  }, [language]);

  const value = { language, setLanguage, t, languages };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
    const { t } = useLanguage();
    return { t };
}
