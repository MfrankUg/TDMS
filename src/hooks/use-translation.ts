"use client";

import { useLanguage } from '@/lib/language';
import { translations } from '@/lib/translations';
import type { TranslationKeys } from '@/lib/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKeys) => {
    return translations[language][key] || translations['en'][key];
  };

  return { t, language };
};
