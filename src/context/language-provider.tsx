
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bh from '@/locales/bh.json';
import mai from '@/locales/mai.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import kn from '@/locales/kn.json';
import bn from '@/locales/bn.json';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const translations: Record<string, any> = {
  en,
  hi,
  bh,
  mai,
  ta,
  te,
  kn,
  bn
};

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'bh', name: 'भोजपुरी (Bhojpuri)' },
    { code: 'mai', name: 'मैथिली (Maithili)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en'); // Default to English
  const { user } = useUser();
  const firestore = useFirestore();

  // Reference to the user's profile to get their saved language
  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/userProfiles`, user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile } = useDoc<any>(userProfileRef);

  // Effect to set the language based on a priority order
  useEffect(() => {
    // Priority 1: User's saved preference in their profile
    if (userProfile?.language && translations[userProfile.language]) {
      setLanguageState(userProfile.language);
      return;
    }
    // Priority 2: Browser's language preference
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      setLanguageState(browserLang);
      return;
    }
    // Priority 3: Fallback to English
    setLanguageState('en');
  }, [userProfile]); // Re-run when the user profile (and their saved language) is loaded

  const setLanguage = (lang: string) => {
    if (Object.keys(translations).includes(lang)) {
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
