export const locales = ['sl', 'en'] as const;
export const defaultLocale = 'sl' as const;

export type Locale = (typeof locales)[number];

// URL path translations
export const pathnames = {
  '/': '/',
  '/stenske-poslikave': {
    sl: '/stenske-poslikave',
    en: '/wall-paintings'
  },
  '/delavnice': {
    sl: '/delavnice',
    en: '/workshops'
  },
  '/slike': {
    sl: '/slike',
    en: '/paintings'
  },
  '/izposoja': {
    sl: '/izposoja',
    en: '/rentals'
  },
  '/izposoja/[id]': {
    sl: '/izposoja/[id]',
    en: '/rentals/[id]'
  },
  '/fotografija': {
    sl: '/fotografija',
    en: '/photography'
  },
  '/galerija': {
    sl: '/galerija',
    en: '/gallery'
  },
  '/o-meni': {
    sl: '/o-meni',
    en: '/about'
  },
  '/kontakt': {
    sl: '/kontakt',
    en: '/contact'
  }
} as const;

