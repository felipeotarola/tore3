'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [activeRect, setActiveRect] = React.useState<{
    width: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const updateActiveRect = () => {
      if (!listRef.current) return;

      const activeTab = listRef.current.querySelector(
        '[data-state="active"]',
      ) as HTMLElement;
      if (activeTab) {
        const listRect = listRef.current.getBoundingClientRect();
        const activeTabRect = activeTab.getBoundingClientRect();

        setActiveRect({
          width: activeTabRect.width,
          left: activeTabRect.left - listRect.left,
        });
      }
    };

    // Small delay to ensure DOM measurements are accurate
    const timeoutId = setTimeout(() => {
      updateActiveRect();
    }, 0);

    // Create a MutationObserver to watch for state changes
    const observer = new MutationObserver(() => {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(updateActiveRect);
    });
    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state'],
      });
    }

    // Add window resize listener
    const handleResize = () => {
      requestAnimationFrame(updateActiveRect);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground relative inline-flex h-9 w-fit items-center justify-center rounded-sm p-[3px]',
        className,
      )}
      {...props}
    >
      {/* Sliding gradient background */}
      {mounted && activeRect && (
        <div
          className="bg-background absolute z-0 h-[calc(100%-6px)] rounded-xs transition-all duration-200 ease-out"
          style={{
            width: activeRect.width,
            left: activeRect.left,
          }}
        ></div>
      )}
      {props.children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xs border border-transparent px-4 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
