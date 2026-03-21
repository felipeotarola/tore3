'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  slug: string;
  title: string;
  image: string;
  shortDescription: string;
  tags: string[];
}

const CIRCLE_SIZE = 80;

export function ServiceCard({
  slug,
  title,
  image,
  shortDescription,
  tags,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values for smooth animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2;
    const offsetY = e.clientY - rect.top - CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2;

    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsHovering(true);

    // Set initial position immediately
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2;
      const offsetY = e.clientY - rect.top - CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2;

      mouseX.set(offsetX);
      mouseY.set(offsetY);
      x.jump(offsetX);
      y.jump(offsetY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Link
      ref={cardRef}
      href={`/services/${slug}`}
      className="group relative flex flex-col items-start gap-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* View cursor follower */}
      <motion.div
        className="pointer-events-none absolute z-10 flex items-center justify-center rounded-full bg-white text-sm font-medium text-black"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          x,
          y,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovering ? 1 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        View
      </motion.div>

      <div className="relative h-[335px] w-full shrink-0 overflow-hidden lg:h-[450px]">
        <Image
          alt={title}
          className="size-full object-cover transition-all duration-500 ease-out group-hover:scale-110"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/3" />
      </div>
      <div className="flex w-full shrink-0 flex-col items-start gap-2">
        <h2 className="text-lg">{title}</h2>
        <p className="text-muted-foreground">{shortDescription}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
