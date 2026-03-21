'use client';

import { Home } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
} as const;

const blobVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
} as const;

const numberVariants = {
  hidden: { scale: 0.95, opacity: 0, filter: 'blur(4px)' },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
} as const;

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      delay: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
} as const;

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-(--spacing(16)))] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          variants={blobVariants}
          initial="hidden"
          animate="visible"
          className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
        />
        <motion.div
          variants={blobVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-secondary/10 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-8"
      >
        {/* 404 Number with gradient */}
        <div className="relative">
          <motion.h1
            variants={numberVariants}
            className="from-foreground via-foreground/90 to-foreground/70 bg-linear-to-br bg-clip-text font-serif text-[10rem] leading-none font-normal tracking-tight text-transparent md:text-[14rem]"
          >
            404
          </motion.h1>
          {/* Subtle accent line */}
          <motion.div
            variants={lineVariants}
            className="via-primary mx-auto mt-4 h-1 w-24 rounded-full bg-linear-to-r from-transparent to-transparent"
          />
        </div>

        {/* Text content */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg text-lg md:text-xl">
            Looks like you&apos;ve ventured into uncharted territory. The page
            you&apos;re searching for doesn&apos;t exist.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row"
        >
          <Button asChild size="lg" variant="default" className="group">
            <Link href="/">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
