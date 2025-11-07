import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import ptBR from './locales/pt-BR';
import esES from './locales/es-ES';

const i18n = new I18n({
  'pt-BR': ptBR,
  'es-ES': esES,
});

i18n.defaultLocale = 'pt-BR';

const deviceTag =
  typeof Localization.getLocales === 'function'
    ? Localization.getLocales()[0]?.languageTag
    : (Localization as any)?.locale;

function resolveSupportedLocale(tag?: string): 'pt-BR' | 'es-ES' {
  if (!tag) return 'pt-BR';
  const lower = tag.toLowerCase();
  if (lower.startsWith('es')) return 'es-ES';
  if (lower.startsWith('pt')) return 'pt-BR';
  return 'pt-BR';
}

i18n.locale = resolveSupportedLocale(deviceTag);

i18n.enableFallback = true;

export default i18n;
export const t = (key: string, options?: any) => i18n.t(key, options);

