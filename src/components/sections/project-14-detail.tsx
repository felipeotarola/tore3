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
      <span className="bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-border/70">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="tk-meta-label mb-1">
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

  const factRows: Array<{
    key: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
    content: ReactNode;
  }> = [
    location
      ? {
          key: 'location',
          icon: MapPin,
          label: 'Location',
          content: location,
        }
      : null,
    website
      ? {
          key: 'website',
          icon: Globe,
          label: 'Website',
          content: (
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
          ),
        }
      : null,
    photo
      ? {
          key: 'photo',
          icon: Camera,
          label: 'Photography',
          content: photo,
        }
      : null,
    via
      ? {
          key: 'via',
          icon: Link2,
          label: 'Via',
          content: via,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
    content: ReactNode;
  }>;

  return (
    <div
      className={cn(
        'space-y-0',
        afterDescription
          ? 'border-border/60 mt-7 border-t pt-7'
          : 'mt-0',
      )}
    >
      {hasFacts ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {factRows.map((fact) => (
            <div
              key={fact.key}
              className={cn(
                'min-w-0',
                fact.key === 'location' &&
                  website &&
                  'sm:border-border/60 sm:border-r sm:pr-4 md:pr-6',
                fact.key === 'website' && location && 'sm:pl-4 md:pl-6',
                (fact.key === 'photo' || fact.key === 'via') &&
                  'border-border/60 sm:col-span-2 sm:mt-2 sm:border-t sm:pt-5',
              )}
            >
              <CreditRow icon={fact.icon} label={fact.label}>
                {fact.content}
              </CreditRow>
            </div>
          ))}
        </div>
      ) : null}

      {hasCollab ? (
        <div
          className={cn(
            'border-border/60 flex gap-3 border-t pt-6',
            hasFacts ? 'mt-6' : '',
          )}
        >
          <span className="bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center self-start rounded-md border border-border/70">
            <Users className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="tk-meta-label mb-2">
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
        <div
          className={cn(
            'border-border/60 flex gap-3 border-t pt-6',
            hasFacts || hasCollab ? 'mt-6' : '',
          )}
        >
          <span className="bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center self-start rounded-md border border-border/70">
            <Award className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="tk-meta-label mb-2">
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
  heightClass = 'aspect-[4/3]',
}: {
  image: ProjectImage;
  imageIndex: number;
  priority?: boolean;
  reduceMotion: boolean;
  heightClass?: string;
}) {
  return (
    <motion.div
      className="tk-image-frame relative"
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
      className="tk-image-frame relative mb-4"
    >
      <ProjectImageClickable imageIndex={imageIndex} className="block w-full">
        <motion.div
          className="relative aspect-[16/10] w-full"
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
      ? 'grid-cols-1 sm:grid-cols-3'
      : metaColumnCount === 2
        ? 'grid-cols-1 sm:grid-cols-2 sm:max-w-md sm:mx-auto'
        : 'grid-cols-1 sm:max-w-xs sm:mx-auto';

  const transition = { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <section className={cn('tk-section-tight', className)}>
      <div className="container">
        <motion.div
          className="mb-8 text-center md:mb-10"
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={transition}
        >
          <p className="tk-eyebrow mb-3">
            {eyebrow}
          </p>
          <h1 className="tk-page-title mx-auto max-w-5xl">
            {title}
          </h1>
        </motion.div>

        {i0 && i1 ? (
          <motion.div
            className="mb-10 grid gap-4 md:mb-12 md:grid-cols-2 md:gap-5"
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
            className="mb-10 md:mb-12"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={transition}
          >
            <div className="tk-image-frame relative mx-auto max-w-5xl">
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
          className="mb-8 text-center md:mb-10"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className={cn(
              'tk-surface mb-6 grid justify-items-stretch gap-y-5 p-4 text-left sm:divide-x md:mb-8 md:p-5',
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
              className="min-w-0 px-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 md:px-6"
            >
              <p className="tk-meta-label mb-1">
                Category
              </p>
              <p className="text-sm font-medium leading-snug md:text-base">
                {categoryLabel}
              </p>
            </motion.div>
            {yearLabel ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="min-w-0 px-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 md:px-6"
              >
                <p className="tk-meta-label mb-1">
                  Year
                </p>
                <p className="text-sm font-medium leading-snug md:text-base">
                  {yearLabel}
                </p>
              </motion.div>
            ) : null}
            {brandLabel ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="min-w-0 px-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 md:px-6"
              >
                <p className="tk-meta-label mb-1">
                  Brand
                </p>
                <p className="text-sm font-medium leading-snug md:text-base">
                  {brandLabel}
                </p>
              </motion.div>
            ) : null}
          </motion.div>
          {description ||
          (project && projectHasSupplementFields(project)) ? (
            <motion.div
              className={cn(
                'mx-auto text-left',
                description && project && projectHasSupplementFields(project)
                  ? 'grid max-w-7xl gap-7 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] md:gap-10 lg:gap-12'
                  : 'max-w-3xl',
              )}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={transition}
            >
              {description ? (
                <p className="tk-body">{description}</p>
              ) : null}
              {project && projectHasSupplementFields(project) ? (
                <div
                  className={cn(
                    description &&
                      'border-border/60 md:border-l md:pl-8 lg:pl-10',
                  )}
                >
                  <ProjectCredits
                    project={project}
                    afterDescription={!description}
                  />
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </motion.div>

        {i2 ? (
          <LargeImage image={i2} imageIndex={2} reduceMotion={reduceMotion} />
        ) : null}

        {i3 && i4 ? (
          <motion.div
            className="grid gap-4 md:grid-cols-2 md:gap-5"
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
            <div className="tk-image-frame relative">
              <ProjectImageClickable imageIndex={3} className="block w-full">
                <div className="relative aspect-[4/3] w-full">
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
