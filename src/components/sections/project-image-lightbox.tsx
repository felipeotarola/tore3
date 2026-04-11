'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { ProjectImage } from '@/lib/types';
import { cn } from '@/lib/utils';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {
      /* no-op subscription */
    },
    () => true,
    () => false,
  );
}

type ProjectLightboxContextValue = {
  openAt: (index: number) => void;
};

const ProjectLightboxContext =
  createContext<ProjectLightboxContextValue | null>(null);

export function useProjectLightbox(): ProjectLightboxContextValue | null {
  return useContext(ProjectLightboxContext);
}

/** Wraps project imagery; when inside `ProjectLightboxProvider`, opens the shared gallery at `imageIndex`. */
export function ProjectImageClickable({
  imageIndex,
  children,
  className,
}: {
  imageIndex: number;
  children: React.ReactNode;
  className?: string;
}) {
  const lightbox = useProjectLightbox();
  if (!lightbox) {
    return <div className={className}>{children}</div>;
  }

  const activate = () => lightbox.openAt(imageIndex);

  return (
    <div
      className={cn(
        className,
        'cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
      aria-label={`View image ${imageIndex + 1} full screen`}
    >
      {children}
    </div>
  );
}

type ProjectLightboxProviderProps = {
  images: ProjectImage[];
  children: React.ReactNode;
};

/**
 * Fullscreen image viewer for project pages — uses CMS `ProjectImage[]` (cover + gallery order).
 * Uses existing Embla-based `Carousel` (shadcn-style). Wrap project detail + gallery with this provider.
 */
export function ProjectLightboxProvider({
  images,
  children,
}: ProjectLightboxProviderProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const safe = Math.max(0, Math.min(index, images.length - 1));
      setActiveIndex(safe);
      setOpen(true);
    },
    [images.length],
  );

  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openAt }), [openAt]);

  return (
    <ProjectLightboxContext.Provider value={value}>
      {children}
      {open && images.length > 0 ? (
        <ProjectLightboxOverlay
          images={images}
          initialIndex={activeIndex}
          onClose={close}
        />
      ) : null}
    </ProjectLightboxContext.Provider>
  );
}

type ProjectLightboxOverlayProps = {
  images: ProjectImage[];
  initialIndex: number;
  onClose: () => void;
};

function ProjectLightboxOverlay({
  images,
  initialIndex,
  onClose,
}: ProjectLightboxOverlayProps) {
  const titleId = useId();
  const isClient = useIsClient();
  const [api, setApi] = useState<CarouselApi>();
  const [caption, setCaption] = useState(
    () => images[initialIndex]?.alt ?? 'Project image',
  );

  useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex, true);
  }, [api, initialIndex]);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      const i = api.selectedScrollSnap();
      setCaption(images[i]?.alt ?? 'Project image');
    };
    sync();
    api.on('select', sync);
    return () => {
      api.off('select', sync);
    };
  }, [api, images]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const node = (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
        <p
          id={titleId}
          className="line-clamp-2 pr-4 text-sm font-medium text-white/90"
        >
          {caption}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="relative min-h-0 flex-1 px-2 pb-6 sm:px-6">
        <Carousel
          setApi={setApi}
          opts={{
            loop: images.length > 1,
            startIndex: initialIndex,
          }}
          className="relative h-full min-h-[50vh]"
        >
          <CarouselContent className="!-ml-0 h-[calc(100vh-8rem)]">
            {images.map((image, index) => (
              <CarouselItem
                key={`${image.src}-${index}`}
                className="basis-full !pl-0"
              >
                <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                  <div className="relative h-full w-full max-w-[min(100%,96rem)]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={index === initialIndex}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 ? (
            <>
              <CarouselPrevious className="left-2 border-white/20 bg-black/50 text-white hover:bg-black/70 sm:left-4" />
              <CarouselNext className="right-2 border-white/20 bg-black/50 text-white hover:bg-black/70 sm:right-4" />
            </>
          ) : null}
        </Carousel>
      </div>
    </div>
  );

  if (!isClient) {
    return null;
  }

  return createPortal(node, document.body);
}
