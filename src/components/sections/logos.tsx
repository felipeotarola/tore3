import { EditableText } from '@/components/editing/editable-text';
import { Marquee } from '@/components/ui/marquee';
import { COLLABORATION_MARQUEE } from '@/lib/torekull';

export const Logos = () => {
  return (
    <section className="section-padding-tight mask-r-from-40% mask-r-to-100% mask-l-from-40% mask-l-to-100% border-y">
      <Marquee pauseOnHover className="[--duration:24s] [--gap:5rem]">
        {COLLABORATION_MARQUEE.map((item, index) => (
          <EditableText
            key={item}
            as="span"
            copyKey={`home.logos.${index}`}
            fallback={item}
            className="nav-caps text-foreground/90 whitespace-nowrap text-sm font-medium md:text-base"
          />
        ))}
      </Marquee>
    </section>
  );
};
