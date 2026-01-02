// hooks/useTranslate.js
'use client';

import { useState, useEffect } from 'react';
import { t, getCurrentLanguage, onLanguageChange } from '@/app/language-store';

export default function useTranslate() {
  const [lang, setLang] = useState(getCurrentLanguage());
  
  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      setLang(newLang);
    });
    
    return unsubscribe;
  }, []);
  
  return { t, lang };
}