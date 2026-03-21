import { ProjectCategory } from '@/lib/types';

const BLOB_ORIGIN = 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com';

export const TOREKULL = {
  name: 'TOREKULL',
  legalName: 'TOREKULL Interior Architecture and Design & Partners AB',
  email: 'Info@torekull.se',
  phone: '+46 (0) 706 306 809',
  instagram: 'https://instagram.com/torekullinteriorarchitecture',
  facebook: 'https://www.facebook.com/torekullinteriorarchitecture',
  addresses: [
    'Stora Gråmunkegränd 5, SE 111 27 Stockholm, Sweden',
    'Hornsbergsvägen 18, SE 112 15 Stockholm, Sweden',
  ],
  quote: 'The function of design is letting design function',
  quoteAuthor: 'Micha Commeren',
} as const;

export const HERO_VIDEO_URL =
  'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/videos/loopdrone2-1774133795723.mp4';

export const NAV_PRIMARY = [
  { label: 'PROJECTS', href: '/projects' },
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: 'WHAT WE DO', href: '/what-we-do' },
      { label: 'COLLABORATIONS', href: '/collaborations' },
    ],
  },
  { label: 'PRESS', href: '/press' },
  { label: 'CONTACT', href: '/contact' },
] as const;

export const NAV_OVERLAY = [
  { label: 'HOME', href: '/' },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'ABOUT', href: '/about' },
  { label: 'WHAT WE DO', href: '/what-we-do' },
  { label: 'COLLABORATIONS', href: '/collaborations' },
  { label: 'PRESS', href: '/press' },
  { label: 'CONTACT', href: '/contact' },
] as const;

export const COLLABORATION_MARQUEE = [
  'Kasai',
  'Moyagi',
  'La Botanica',
  '3Sixty Skybar',
  'Biblioteket Live',
  'Deck Brasserie',
  'Chouchou',
  'Canta Lola',
  'Hallwylska',
  'Rose Club',
  'Walthon Advokater',
  'Delish Bakehouse',
  'Cava Bar',
] as const;

export const HOME_HERO_SLUGS = [
  '3sixty-skybar',
  'moyagi-london',
  'la-botanica',
  'kasai-stockholm',
  'biblioteket-live-cocktail-bar',
  'deck-brasserie-bar',
] as const;

export const HOME_FEATURED_SLUGS = [
  'kasai-stockholm',
  'moyagi-london',
] as const;

export const PROJECT_FILTERS: Array<{
  value: 'all' | ProjectCategory;
  label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'restaurants', label: 'Restaurants' },
  { value: 'bars', label: 'Bars' },
  { value: 'cafes', label: 'Cafes' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  restaurants: 'Restaurants',
  bars: 'Bars',
  cafes: 'Cafes',
  office: 'Office',
  other: 'Other',
  'logo-design': 'Logo Design',
  'brand-identity': 'Brand Identity',
  'icon-design': 'Icon Design',
};

export const HOME_STATS = [
  { title: 'Projects completed', value: '20+' },
  { title: 'Countries worked in', value: '5' },
  { title: 'Award wins', value: 'International Property Awards' },
  { title: 'Languages', value: '5' },
] as const;

export const SERVICES = [
  {
    title: 'Interior Architecture',
    description:
      'Complete interior architecture for commercial spaces - restaurants, hotels, bars, boutiques, and offices. From concept to finished project.',
  },
  {
    title: 'Furniture Design',
    description:
      "Custom furniture design tailored to each project's unique identity and functional requirements.",
  },
  {
    title: 'Product Design',
    description:
      'Innovative product design solutions that bridge aesthetics and everyday functionality.',
  },
  {
    title: 'Concept Development',
    description:
      'Full creative concept development including material selection, lighting strategy, and spatial flow.',
  },
] as const;

export const PRESS_ITEMS = [
  {
    title: 'Modern Interior 2024 - Issue 4',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-modern-interior-2024-4.jpg`,
  },
  {
    title: 'International Property Awards 2022',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-ipa-2022-p114.jpg`,
  },
  {
    title: "World's Best Interior Design 2022-2023",
    image: `${BLOB_ORIGIN}/images/torekull/press/press-worlds-best-2022-2023.jpg`,
  },
  {
    title: 'Modern Interior 2024 - Issue 3',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-modern-interior-2024-3.jpg`,
  },
  {
    title: 'The World of Hospitality 2024',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-hospitality-2024-p1.jpg`,
  },
  {
    title: 'The World of Hospitality 2024 - p.28',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-hospitality-2024-p2.jpg`,
  },
  {
    title: "World's Best Interior Design 2021-2022",
    image: `${BLOB_ORIGIN}/images/torekull/press/press-worlds-best-2021-2022-ipa.jpg`,
  },
  {
    title: 'Property and Travel 2022 - Issue 3',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-property-travel-3.jpg`,
  },
  {
    title: 'Aftonbladet 2022',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-aftonbladet-2022.jpg`,
  },
  {
    title: 'Nojesguiden',
    image: `${BLOB_ORIGIN}/images/torekull/press/press-nojesguiden.jpg`,
  },
] as const;

export const AWARDS = [
  {
    title: 'European Property Awards',
    year: '2021-2022',
    image: `${BLOB_ORIGIN}/images/torekull/awards/award-eu-2021-1.png`,
  },
  {
    title: 'European Property Awards',
    year: '2021-2022',
    image: `${BLOB_ORIGIN}/images/torekull/awards/award-eu-2021-2.jpg`,
  },
  {
    title: 'European Property Awards',
    year: '2022-2023',
    image: `${BLOB_ORIGIN}/images/torekull/awards/award-eu-2022-1.jpg`,
  },
  {
    title: 'European Property Awards',
    year: '2022-2023',
    image: `${BLOB_ORIGIN}/images/torekull/awards/award-eu-2022-2.jpg`,
  },
] as const;

export const COLLABORATION_PARTNERS = [
  'Abreu Design Studio',
  'Integration Design',
  'Panea AB',
  'Gure Group',
  'Stil & Kansla',
  'Stylt',
] as const;

export const ABOUT_LANGUAGES = [
  'Swedish',
  'English',
  'Italian',
  'French',
  'Spanish',
] as const;

export const WHAT_WE_DO_PROCESS = [
  {
    title: 'Assess',
    description:
      'Understand what the client needs and wants. The client is always at the center.',
  },
  {
    title: 'Concept',
    description:
      "Custom design each project for the benefit of the client's unique story.",
  },
  {
    title: 'Detail',
    description:
      'Focus on quality, detail, and functionality - design must function to serve its purpose.',
  },
  {
    title: 'Deliver',
    description:
      'Hands-on involvement from idea to finished project, on time and within budget.',
  },
] as const;

export const BLOB_IMAGE_BASE = `${BLOB_ORIGIN}/images/torekull`;

