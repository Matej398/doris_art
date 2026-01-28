import { createNavigation } from 'next-intl/navigation';
import { locales, pathnames, defaultLocale } from './config';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    pathnames,
    localePrefix: 'always'
  });
