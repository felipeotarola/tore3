import { NAV_OVERLAY, TOREKULL } from '@/lib/torekull';

export const NAV_ITEMS = NAV_OVERLAY;

export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: TOREKULL.instagram,
    icon: 'Instagram',
  },
  {
    name: 'Facebook',
    href: TOREKULL.facebook,
    icon: 'Facebook',
  },
] as const;

export const CONTACT_EMAIL = TOREKULL.email;

