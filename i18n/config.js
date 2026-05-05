export const locales = ['en', 'es', 'ro'];
export const defaultLocale = 'en';
export const namespaces = ['vortex', 'common', 'reflection', 'patterns', 'about', 'lunar'];

export const supportedLocales = [...locales];

export function isSupportedLocale(locale) {
  return !!locale && supportedLocales.includes(locale);
}
