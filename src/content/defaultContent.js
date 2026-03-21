import awardEu2021_1 from '../assets/award-eu-2021-1.png'
import awardEu2021_2 from '../assets/award-eu-2021-2.jpg'
import awardEu2022_1 from '../assets/award-eu-2022-1.jpg'
import awardEu2022_2 from '../assets/award-eu-2022-2.jpg'

import pressModernInterior2024_4 from '../assets/press/press-modern-interior-2024-4.jpg'
import pressIpa2022p114 from '../assets/press/press-ipa-2022-p114.jpg'
import pressWorldsBest2022_2023 from '../assets/press/press-worlds-best-2022-2023.jpg'
import pressModernInterior2024_3 from '../assets/press/press-modern-interior-2024-3.jpg'
import pressHospitality2024p1 from '../assets/press/press-hospitality-2024-p1.jpg'
import pressHospitality2024p2 from '../assets/press/press-hospitality-2024-p2.jpg'
import pressWorldsBest2021_2022Ipa from '../assets/press/press-worlds-best-2021-2022-ipa.jpg'
import pressWorldsBest2021_2022 from '../assets/press/press-worlds-best-2021-2022.jpg'
import pressPropertyTravel3 from '../assets/press/press-property-travel-3.jpg'
import pressModernInterior2022 from '../assets/press/press-modern-interior-2022.jpg'
import pressAftonbladet2022 from '../assets/press/press-aftonbladet-2022.jpg'
import pressPropertyTravel2 from '../assets/press/press-property-travel-2.jpg'
import pressPropertyTravel1 from '../assets/press/press-property-travel-1.jpg'
import pressNojesguiden2022 from '../assets/press/press-nojesguiden-2022.jpg'
import pressNojesguiden from '../assets/press/press-nojesguiden.jpg'

import walthon1 from '../assets/projects/walthon-1.jpg'
import walthon2 from '../assets/projects/walthon-2.jpg'
import walthon3 from '../assets/projects/walthon-3.jpg'
import rose1 from '../assets/projects/rose-1.jpg'
import rose2 from '../assets/projects/rose-2.jpg'
import rose3 from '../assets/projects/rose-3.jpg'
import skybar1 from '../assets/projects/3sixty-1.jpg'
import skybar2 from '../assets/projects/3sixty-2.jpg'
import moyagi1 from '../assets/projects/moyagi-1.jpg'
import moyagi2 from '../assets/projects/moyagi-2.jpg'
import hallwylska1 from '../assets/projects/hallwylska-1.jpg'
import hallwylska2 from '../assets/projects/hallwylska-2.jpg'
import hallwylska3 from '../assets/projects/hallwylska-3.jpg'

export const heroFallbackImage = skybar1

export const defaultSiteSettings = {
  heroLine1: 'We shape atmosphere through',
  heroLine2: 'light, material and space.',
  heroCtaLabel: 'Explore Selected Projects',
  awardsTagline:
    "Europe's Best Interior Design Studio - European Property Awards",
  studioTitle: 'Philosophy & Studio',
  studioQuote:
    'We shape interiors through light, material restraint and craft. Each space feels inevitable, not over-explained.',
  studioSub: 'Design and function move together, never in competition.',
  disciplines: 'Interior Architecture, Furniture & Product Design',
  sectors: 'Hospitality, Culture & Private Residences',
  locations: 'Stockholm / New York',
  pressTitle: 'Press & Features',
  pressSubtitle: 'Selected features across design and architecture media.',
  contactTitle: 'Get In Touch',
  contactSubtitle: 'Start a project or request a portfolio.',
  contactNote:
    'Include timeline, location and scope - we reply within 2-3 business days.',
  visitLabel: 'Visit',
  contactAddress: 'Stora Gramunkegrand 5\nStockholm, Sweden',
  emailLabel: 'Email',
  contactEmail: 'info@torekull.se',
  phoneLabel: 'Phone',
  contactPhone: '+46 (0) 706 306 809',
  footerCopy:
    'TOREKULL Interior Architecture and Design & Partners AB. All Rights Reserved.',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2035.5!2d18.0703!3d59.3248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d5d3e3b1e07%3A0x2a0e1f5c4c9e5b2a!2sStora%20Gr%C3%A5munkegr%C3%A4nd%205%2C%20111%2029%20Stockholm!5e0!3m2!1sen!2sse!4v1700000000000',
}

export const defaultProjects = [
  {
    slug: 'walthon-advokater-office',
    title: 'Walthon Advokater Office',
    location: 'Stockholm, Sweden',
    completion: '2022',
    description:
      'New office for the law firm Walthon Advokater, located at the top of a Jugend property in the heart of Ostermalm.',
    website: 'https://www.walthon.se/',
    photo: 'Johan Eldrot',
    credits: [
      { label: 'Interior design concept', value: 'TOREKULL' },
      { label: 'House architect', value: 'Ahrbom & Partner' },
      { label: 'Graphic design and brand identity', value: 'Gure Group' },
    ],
    cover: walthon1,
    gallery: [walthon1, walthon2, walthon3],
    tone: 'tone-warm',
    sortOrder: 10,
  },
  {
    slug: 'rose-club',
    title: 'Rose Club',
    location: 'Stockholm, Sweden',
    completion: '2015',
    description:
      'Millimeter Arkitekter project, head interior architect and designer Maja-Li Torekull. Complete make-over and renovation of Rose Club and Bar Rose.',
    website: 'http://www.roseclub.se',
    via: 'Millimeter Arkitekter',
    credits: [],
    cover: rose1,
    gallery: [rose1, rose2, rose3],
    tone: 'tone-ash',
    sortOrder: 20,
  },
  {
    slug: '3sixty-skybar',
    title: '3Sixty Skybar',
    location: 'Stockholm, Sweden',
    completion: '2024',
    description:
      'An international restaurant, skybar, and living room on the 25th floor with a 360 degree panoramic view in an elegant 20s feel.',
    website: 'https://www.3sixtyskybar.se/',
    photo: 'Anja Callius',
    credits: [
      { label: 'Interior design concept', value: 'TOREKULL' },
      { label: 'Head interior architect', value: 'Maja-Li Torekull' },
      { label: 'Assistant interior architect', value: 'Lisa Hallfors' },
      { label: 'Props & Styling', value: 'Stil & Kansla' },
      { label: 'Graphic design', value: 'Stylt' },
      { label: 'Turn key solution supplier', value: 'Panea AB' },
    ],
    cover: skybar1,
    gallery: [skybar1, skybar2],
    tone: 'tone-sand',
    sortOrder: 30,
  },
  {
    slug: 'moyagi-london',
    title: 'MOYAGI - London',
    location: 'London, UK',
    completion: '2024',
    description:
      "Moyagi's Hidden Bar blends a traditional cocktail bar with the vibes of a Tokyo-inspired boutique nightclub.",
    website: 'https://moyagi.com/london',
    photo: 'Abraham Engelmark',
    credits: [
      { label: 'Interior design concept', value: 'TOREKULL' },
      { label: 'Lighting design', value: 'Abreu Design Studio' },
      { label: 'Props & Styling', value: 'Stil & Kansla' },
      { label: 'Technical integration', value: 'Integration Design' },
    ],
    cover: moyagi1,
    gallery: [moyagi1, moyagi2],
    tone: 'tone-ink',
    sortOrder: 40,
  },
  {
    slug: 'hallwylska-bar',
    title: 'Hallwylska Bar',
    location: 'Stockholm, Sweden',
    completion: '2015',
    description:
      "Millimeter Arkitekter project, head interior architect and designer Maja-Li Torekull. New bar, restaurant, and garden in the Hallwylska Museum's inner courtyard.",
    website: 'https://www.hallwylskarestaurang.com',
    photo: 'Lasse Olsson',
    via: 'Millimeter Arkitekter',
    credits: [],
    cover: hallwylska1,
    gallery: [hallwylska1, hallwylska2, hallwylska3],
    tone: 'tone-stone',
    sortOrder: 50,
  },
]

export const defaultAwards = [
  {
    src: awardEu2021_1,
    label: 'European Property Awards - Interior Design',
    year: '2021-2022',
  },
  {
    src: awardEu2021_2,
    label: 'European Property Awards - Interior Design',
    year: '2021-2022',
  },
  {
    src: awardEu2022_1,
    label: 'European Property Awards - Interior Design',
    year: '2022-2023',
  },
  {
    src: awardEu2022_2,
    label: 'European Property Awards - Interior Design',
    year: '2022-2023',
  },
]

export const defaultPressItems = [
  { title: 'Modern Interior nr 4, 2024', image: pressModernInterior2024_4, sortOrder: 10 },
  { title: 'IPA 2022', image: pressIpa2022p114, sortOrder: 20 },
  { title: "World's Best 2022-2023", image: pressWorldsBest2022_2023, sortOrder: 30 },
  { title: 'Modern Interior nr 3, 2024', image: pressModernInterior2024_3, sortOrder: 40 },
  { title: 'The World of Hospitality', image: pressHospitality2024p1, sortOrder: 50 },
  { title: 'The World of Hospitality p.28', image: pressHospitality2024p2, sortOrder: 60 },
  { title: "World's Best 2021-2022 IPA", image: pressWorldsBest2021_2022Ipa, sortOrder: 70 },
  { title: "World's Best 2021-2022", image: pressWorldsBest2021_2022, sortOrder: 80 },
  { title: 'Property & Travel no 3', image: pressPropertyTravel3, sortOrder: 90 },
  { title: 'Modern Interior 2022', image: pressModernInterior2022, sortOrder: 100 },
  { title: 'Aftonbladet', image: pressAftonbladet2022, sortOrder: 110 },
  { title: 'International Property & Travel 2', image: pressPropertyTravel2, sortOrder: 120 },
  { title: 'International Property & Travel 1', image: pressPropertyTravel1, sortOrder: 130 },
  { title: 'Nojesguiden 2022', image: pressNojesguiden2022, sortOrder: 140 },
  { title: 'Nojesguiden', image: pressNojesguiden, sortOrder: 150 },
]

export const navLinks = [
  { href: '#projects', label: 'Selected Projects' },
  { href: '#press', label: 'Press' },
  { href: '#studio', label: 'Studio' },
  { href: '#contact', label: 'Contact' },
]

export const footerNav = [
  { href: '#projects', label: 'Selected Projects' },
  { href: '#contact', label: 'Contact' },
  { href: '#press', label: 'Press' },
  {
    href: 'https://www.instagram.com/torekullinteriorarchitecture/',
    label: 'Instagram',
    external: true,
  },
]
