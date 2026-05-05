import enAbout from '../locales/en/about.json';
import enCommon from '../locales/en/common.json';
import enPatterns from '../locales/en/patterns.json';
import enReflection from '../locales/en/reflection.json';
import enVortex from '../locales/en/vortex.json';
import enLunar from '../locales/en/lunar.json';
import esAbout from '../locales/es/about.json';
import esCommon from '../locales/es/common.json';
import esLunar from '../locales/es/lunar.json';
import esPatterns from '../locales/es/patterns.json';
import esReflection from '../locales/es/reflection.json';
import esVortex from '../locales/es/vortex.json';
import roAbout from '../locales/ro/about.json';
import roCommon from '../locales/ro/common.json';
import roLunar from '../locales/ro/lunar.json';
import roPatterns from '../locales/ro/patterns.json';
import roReflection from '../locales/ro/reflection.json';
import roVortex from '../locales/ro/vortex.json';

export const resources = {
  es: {
    vortex: esVortex,
    common: esCommon,
    reflection: esReflection,
    patterns: esPatterns,
    about: esAbout,
    lunar: esLunar,
  },
  en: {
    vortex: enVortex,
    common: enCommon,
    reflection: enReflection,
    patterns: enPatterns,
    about: enAbout,
    lunar: enLunar,
  },
  ro: {
    vortex: roVortex,
    common: roCommon,
    reflection: roReflection,
    patterns: roPatterns,
    about: roAbout,
    lunar: roLunar,
  },
} as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;
