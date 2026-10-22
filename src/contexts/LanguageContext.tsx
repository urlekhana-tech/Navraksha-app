import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, LanguageItem } from '../i18n/languages';
import { getTranslation, TranslationStrings } from '../i18n/translations';

interface LanguageContextType {
  language: string;
  currentLanguageItem: LanguageItem;
  setLanguage: (lang: string) => void;
  t: (key: keyof TranslationStrings) => string;
  languages: LanguageItem[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('navraksha_lang') || 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('navraksha_lang', lang);
  };

  const currentLanguageItem =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: keyof TranslationStrings): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguageItem,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
