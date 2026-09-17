import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../services/translations';

// Google Translate supported Indian languages
export const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
  { code: 'mni-Mtei', name: 'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)' },
  { code: 'bho', name: 'भोजपुरी (Bhojpuri)' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)' }
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('revastra_language') || 'hi'; // Default to Hindi to hide English
  });

  useEffect(() => {
    const currentLang = localStorage.getItem('revastra_language') || 'hi';
    
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${currentLang}; path=/;`;
    
    // Also save to localStorage
    if (language !== currentLang) {
       setLanguage(currentLang);
    }
  }, []);

  const t = (key) => {
    // Return English translation because Google Translate will translate the English DOM
    return TRANSLATIONS.en[key] || key;
  };

  const changeLanguage = (langCode) => {
    const isValid = INDIAN_LANGUAGES.some(lang => lang.code === langCode);
    if (isValid) {
      setLanguage(langCode);
      localStorage.setItem('revastra_language', langCode);
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      window.location.reload(); // Reload to apply Google Translate changes
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, supportedLanguages: INDIAN_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
