'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { SERVICES } from '@/lib/torekull';
import { cn } from '@/lib/utils';

const IMAGE_WIDTH = 280;
const IMAGE_HEIGHT = 188;
const IMAGE_GAP = 52;

/**
 * Services 19–style table: rows with a cursor-following preview image on hover
 * (see https://www.shadcnblocks.com/block/services19).
 */
export function ServicesHoverTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { damping: 28, stiffness: 180 };
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  const getImageOffset = (e: React.MouseEvent) => {
    if (!containerRef.current || !rowsRef.current) return { x: 0, y: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const rowsRect = rowsRef.current.getBoundingClientRect();

    const mouseXInContainer = e.clientX - containerRect.left;
    const mouseYInContainer = e.clientY - containerRect.top;

    const cursorXInRows = e.clientX - rowsRect.left;
    const isRightHalf = cursorXInRows > rowsRect.width / 2;

    if (isRightHalf) {
      return {
        x: mouseXInContainer - IMAGE_WIDTH / 2,
        y: mouseYInContainer - IMAGE_HEIGHT - IMAGE_GAP,
      };
    } else {
      return {
        x: mouseXInContainer + IMAGE_GAP,
        y: mouseYInContainer - IMAGE_HEIGHT / 2,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const offset = getImageOffset(e);
    mouseX.set(offset.x);
    mouseY.set(offset.y);
  };

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    setActiveIndex(index);
    const offset = getImageOffset(e);
    mouseX.set(offset.x);
    mouseY.set(offset.y);
    x.jump(offset.x);
    y.jump(offset.y);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <section className="section-padding overflow-x-clip">
      <div ref={containerRef} className="relative container">
        <div className="mb-10 max-w-2xl space-y-2 md:mb-14">
          <p className="nav-caps text-xs text-muted-foreground">Capabilities</p>
          <h2 className="text-3xl md:text-4xl">How we work with you</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Hover a row to preview a project reference—each line is a core discipline in
            our studio.
          </p>
        </div>

        <div
          ref={rowsRef}
          className="border-border relative border-t"
          onMouseLeave={handleMouseLeave}
        >
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                'border-border group grid cursor-default grid-cols-1 gap-4 border-b py-10 transition-opacity duration-300 md:grid-cols-12 md:gap-8 md:py-12 lg:gap-10',
                activeIndex !== null &&
                  activeIndex !== index &&
                  'opacity-[0.38]',
              )}
              onMouseEnter={(e) => handleMouseEnter(e, index)}
              onMouseMove={handleMouseMove}
            >
              <div className="nav-caps text-muted-foreground md:col-span-2 lg:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="md:col-span-4 lg:col-span-3">
                <h3 className="text-xl font-medium tracking-[0.02em] md:text-2xl">
                  {service.title}
                </h3>
              </div>
              <p className="text-muted-foreground md:col-span-6 text-base leading-relaxed lg:col-span-8">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-50 overflow-hidden rounded-md border border-border bg-muted shadow-2xl"
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            x,
            y,
          }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{
            scale: activeIndex !== null ? 1 : 0.92,
            opacity: activeIndex !== null ? 1 : 0,
          }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          aria-hidden
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <Image
                src={service.hoverImage}
                alt=""
                fill
                className="object-cover"
                sizes="280px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
