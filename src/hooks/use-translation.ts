"use client";

import { useLanguage } from '@/lib/language';
import { translations } from '@/lib/translations';
import type { TranslationKeys } from '@/lib/translations';
import { useCallback } from 'react';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key: TranslationKeys, replacements?: Record<string, string>) => {
    let translation = translations[language][key] || translations['en'][key];
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{{${rKey}}}`, replacements[rKey]);
      });
    }
    return translation;
  }, [language]);

  return { t, language };
};