'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface ProcessStep {
  title: string;
  description: string;
  image?: string;
}

interface ProcessProps {
  title: string;
  steps: ProcessStep[];
}

const IMAGE_WIDTH = 320;
const IMAGE_HEIGHT = 200;
const IMAGE_GAP = 60;

export const Process = ({ title, steps }: ProcessProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Check if any steps have images
  const hasAnyImages = steps.some((step) => step.image);

  // Motion values for smooth animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const getImageOffset = (e: React.MouseEvent) => {
    if (!containerRef.current || !stepsContainerRef.current)
      return { x: 0, y: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const stepsRect = stepsContainerRef.current.getBoundingClientRect();

    // Mouse position relative to container
    const mouseXInContainer = e.clientX - containerRect.left;
    const mouseYInContainer = e.clientY - containerRect.top;

    // Check if cursor is on left or right half of the steps container
    const cursorXInSteps = e.clientX - stepsRect.left;
    const isRightHalf = cursorXInSteps > stepsRect.width / 2;

    if (isRightHalf) {
      // Right half: image above cursor with gap
      return {
        x: mouseXInContainer - IMAGE_WIDTH / 2,
        y: mouseYInContainer - IMAGE_HEIGHT - IMAGE_GAP,
      };
    } else {
      // Left half: image to the right of cursor with gap
      return {
        x: mouseXInContainer + IMAGE_GAP,
        y: mouseYInContainer - IMAGE_HEIGHT / 2,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    // Only track mouse if current step has an image
    if (!steps[index]?.image) return;

    const offset = getImageOffset(e);
    mouseX.set(offset.x);
    mouseY.set(offset.y);
  };

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    // Only activate if step has an image
    if (!steps[index]?.image) return;

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
    <section className={cn('overflow-x-clip')}>
      <div
        ref={containerRef}
        className="section-padding relative container grid gap-16 md:grid-cols-2"
      >
        <h2 className="top-6 self-start text-4xl md:sticky">{title}</h2>

        <div ref={stepsContainerRef} className="divide-y">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'group flex flex-col gap-3.5 py-6 transition-opacity duration-300',
                index === 0 && 'pt-0',
                index === steps.length - 1 && 'pb-0',
                step.image && 'cursor-pointer',
                activeIndex !== null &&
                  activeIndex !== index &&
                  steps[activeIndex]?.image &&
                  'opacity-40',
              )}
              onMouseEnter={(e) => handleMouseEnter(e, index)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Floating image that follows cursor - only render if any steps have images */}
        {hasAnyImages && (
          <motion.div
            className="pointer-events-none absolute z-50 overflow-hidden rounded-lg shadow-2xl"
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              x,
              y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: activeIndex !== null ? 1 : 0,
              opacity: activeIndex !== null ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {steps.map(
              (step, index) =>
                step.image && (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </motion.div>
                ),
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
