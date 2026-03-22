import { Marquee } from '@/components/ui/marquee';
import { COLLABORATION_MARQUEE } from '@/lib/torekull';

export const Logos = () => {
  return (
    <section className="section-padding-tight mask-r-from-40% mask-r-to-100% mask-l-from-40% mask-l-to-100% border-y">
      <Marquee pauseOnHover className="[--duration:24s] [--gap:5rem]">
        {COLLABORATION_MARQUEE.map((item) => (
          <span
            key={item}
            className="nav-caps text-muted-foreground whitespace-nowrap text-sm"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  );
};
