'use client';

import {
  Award,
  Camera,
  ExternalLink,
  Globe,
  Link2,
  MapPin,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';

import { ProjectImageClickable } from '@/components/sections/project-image-lightbox';
import type { ProjectFrontmatter, ProjectImage } from '@/lib/types';
import { cn } from '@/lib/utils';

export type Project14DetailProps = {
  className?: string;
  eyebrow?: string;
  title: string;
  /** CMS image order: cover first, then gallery — slots map to template positions. */
  images: ProjectImage[];
  categoryLabel: string;
  yearLabel?: string;
  /** Third column in the meta row (template “BRAND”); maps to `industry` from CMS. */
  brandLabel?: string;
  description?: string;
  /** Optional CMS record: location, website, credits, collaborators, awards — shown below the story. */
  project?: ProjectFrontmatter;
};

function websiteHostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function CreditRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="bg-muted/80 text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-border/50">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-muted-foreground mb-1 text-[0.65rem] tracking-widest uppercase">
          {label}
        </p>
        <div className="text-foreground text-sm leading-snug">{children}</div>
      </div>
    </div>
  );
}

function projectHasSupplementFields(project: ProjectFrontmatter): boolean {
  return Boolean(
    project.location ||
      project.website ||
      project.photo ||
      project.via ||
      (project.collaborators && project.collaborators.length > 0) ||
      (project.awards && project.awards.length > 0),
  );
}

function ProjectCredits({
  project,
  afterDescription,
}: {
  project: ProjectFrontmatter;
  afterDescription: boolean;
}) {
  const { location, website, photo, via, collaborators, awards } = project;
  const hasFacts = Boolean(location || website || photo || via);
  const hasCollab = collaborators && collaborators.length > 0;
  const hasAwards = awards && awards.length > 0;

  if (!hasFacts && !hasCollab && !hasAwards) {
    return null;
  }

  return (
    <div
      className={cn(
        'space-y-8',
        afterDescription
          ? 'border-border/60 mt-10 border-t pt-10'
          : 'mt-8',
      )}
    >
      {hasFacts ? (
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6">
          {location ? (
            <CreditRow icon={MapPin} label="Location">
              {location}
            </CreditRow>
          ) : null}
          {website ? (
            <CreditRow icon={Globe} label="Website">
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-underline inline-flex max-w-full items-center gap-1.5 font-medium break-all"
              >
                <span className="min-w-0">{websiteHostLabel(website)}</span>
                <ExternalLink
                  className="text-muted-foreground size-3.5 shrink-0 opacity-60"
                  aria-hidden
                />
              </Link>
            </CreditRow>
          ) : null}
          {photo ? (
            <CreditRow icon={Camera} label="Photography">
              {photo}
            </CreditRow>
          ) : null}
          {via ? (
            <CreditRow icon={Link2} label="Via">
              {via}
            </CreditRow>
          ) : null}
        </div>
      ) : null}

      {hasCollab ? (
        <div className="flex gap-3">
          <span className="bg-muted/80 text-muted-foreground flex size-9 shrink-0 items-center justify-center self-start rounded-md border border-border/50">
            <Users className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-widest uppercase">
              Collaborators
            </p>
            <ul className="text-foreground space-y-1.5 text-sm leading-relaxed">
              {collaborators!.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {hasAwards ? (
        <div className="flex gap-3">
          <span className="bg-muted/80 text-muted-foreground flex size-9 shrink-0 items-center justify-center self-start rounded-md border border-border/50">
            <Award className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-widest uppercase">
              Awards
            </p>
            <ul className="text-foreground space-y-1.5 text-sm leading-relaxed">
              {awards!.map((award) => (
                <li key={`${award.title}-${award.year || ''}`}>
                  {award.title}
                  {award.year ? ` (${award.year})` : ''}
                  {award.category ? ` — ${award.category}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

function GridImage({
  image,
  imageIndex,
  priority,
  reduceMotion,
  heightClass = 'h-[400px]',
}: {
  image: ProjectImage;
  imageIndex: number;
  priority?: boolean;
  reduceMotion: boolean;
  heightClass?: string;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-md"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <ProjectImageClickable imageIndex={imageIndex} className="block w-full">
        <motion.div
          className={cn('relative w-full', heightClass)}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
          />
        </motion.div>
      </ProjectImageClickable>
    </motion.div>
  );
}

function LargeImage({
  image,
  imageIndex,
  reduceMotion,
}: {
  image: ProjectImage;
  imageIndex: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="relative mb-6 overflow-hidden rounded-lg"
    >
      <ProjectImageClickable imageIndex={imageIndex} className="block w-full">
        <motion.div
          className="relative h-[min(600px,70vh)] w-full md:h-[600px]"
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="100vw"
          />
        </motion.div>
      </ProjectImageClickable>
    </motion.div>
  );
}

/**
 * Shadcnblocks Project 14–style case study layout: headline, image grids, meta strip, story, hero frame, final pair.
 * Uses `motion/react` (not framer-motion). Content is fully driven by CMS props.
 */
export function Project14Detail({
  className,
  eyebrow = 'Selected work',
  title,
  images,
  categoryLabel,
  yearLabel,
  brandLabel,
  description,
  project,
}: Project14DetailProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [i0, i1, i2, i3, i4] = images;

  const metaColumnCount =
    1 + (yearLabel ? 1 : 0) + (brandLabel ? 1 : 0);
  const metaGridClass =
    metaColumnCount >= 3
      ? 'grid-cols-3'
      : metaColumnCount === 2
        ? 'grid-cols-2 max-w-md mx-auto'
        : 'grid-cols-1 max-w-xs mx-auto';

  const transition = { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', className)}>
      <div className="container">
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={transition}
        >
          <p className="text-muted-foreground mb-4 text-sm tracking-widest uppercase">
            {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-wider uppercase md:text-5xl lg:text-7xl">
            {title}
          </h1>
        </motion.div>

        {i0 && i1 ? (
          <motion.div
            className="mb-16 grid gap-6 md:mb-24 md:grid-cols-2"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <GridImage
              image={i0}
              imageIndex={0}
              priority
              reduceMotion={reduceMotion}
            />
            <GridImage image={i1} imageIndex={1} reduceMotion={reduceMotion} />
          </motion.div>
        ) : i0 ? (
          <motion.div
            className="mb-16 md:mb-24"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={transition}
          >
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-md">
              <ProjectImageClickable imageIndex={0} className="block w-full">
                <div className="relative aspect-[4/3] w-full md:aspect-[21/9]">
                  <Image
                    src={i0.src}
                    alt={i0.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              </ProjectImageClickable>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          className="mb-8 text-center md:mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className={cn(
              'mb-6 grid justify-items-center gap-x-3 gap-y-1 sm:mb-8 sm:gap-x-6 md:mb-10',
              metaGridClass,
            )}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="min-w-0 px-1"
            >
              <p className="text-muted-foreground mb-1 text-[0.65rem] tracking-widest uppercase">
                Category
              </p>
              <p className="font-medium tracking-wide uppercase md:text-lg">
                {categoryLabel}
              </p>
            </motion.div>
            {yearLabel ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="min-w-0 px-1"
              >
                <p className="text-muted-foreground mb-1 text-[0.65rem] tracking-widest uppercase">
                  Year
                </p>
                <p className="font-medium tracking-wide uppercase md:text-lg">
                  {yearLabel}
                </p>
              </motion.div>
            ) : null}
            {brandLabel ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="min-w-0 px-1"
              >
                <p className="text-muted-foreground mb-1 text-[0.65rem] tracking-widest uppercase">
                  Brand
                </p>
                <p className="font-medium tracking-wide uppercase md:text-lg">
                  {brandLabel}
                </p>
              </motion.div>
            ) : null}
          </motion.div>
          {description ||
          (project && projectHasSupplementFields(project)) ? (
            <motion.div
              className="mx-auto max-w-4xl text-left"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={transition}
            >
              {description ? (
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              ) : null}
              {project && projectHasSupplementFields(project) ? (
                <ProjectCredits
                  project={project}
                  afterDescription={Boolean(description)}
                />
              ) : null}
            </motion.div>
          ) : null}
        </motion.div>

        {i2 ? (
          <LargeImage image={i2} imageIndex={2} reduceMotion={reduceMotion} />
        ) : null}

        {i3 && i4 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <GridImage image={i3} imageIndex={3} reduceMotion={reduceMotion} />
            <GridImage image={i4} imageIndex={4} reduceMotion={reduceMotion} />
          </motion.div>
        ) : i3 ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={transition}
          >
            <div className="relative overflow-hidden rounded-md">
              <ProjectImageClickable imageIndex={3} className="block w-full">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={i3.src}
                    alt={i3.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </ProjectImageClickable>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
