import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Updates the document's `dir` and `lang` attributes
 * whenever the i18n language changes (RTL support).
 */
const DirectionManager = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || 'en';
    const dir = i18n.dir(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [i18n, i18n.resolvedLanguage, i18n.language]);

  return null;
};

export default DirectionManager;
