import { Process } from './process';

const processSteps = [
  {
    title: 'Discovery',
    description:
      'We start by understanding your business, audience, and goals. This foundation ensures every design decision connects to your story.',
    image: '/images/process/discovery.webp',
  },
  {
    title: 'Research & Strategy',
    description:
      'We explore your industry, competitors, and trends to define a creative direction that sets your brand apart.',
    image: '/images/process/research.webp',
  },
  {
    title: 'Concept Design',
    description:
      'Our team creates multiple design directions — from logos to icon systems — each shaped to fit your needs and brand personality.',
    image: '/images/process/concept.webp',
  },
  {
    title: 'Refinement',
    description:
      "We collaborate with you to refine the chosen concept, polishing details like color, typography, and balance until it's perfect.",
    image: '/images/process/refinement.webp',
  },
  {
    title: 'Delivery',
    description:
      'You receive all final assets — logos, icons, guidelines, or identity kits — packaged in professional formats ready for web, print, and beyond.',
    image: '/images/process/delivery.webp',
  },
];

export const OurProcess = () => {
  return <Process title="Our process" steps={processSteps} />;
};
