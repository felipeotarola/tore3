import { ProjectCard } from '@/components/project-card';
import { EnrichedProject } from '@/lib/types';

interface ServiceFeaturedWorkProps {
  items: EnrichedProject[];
}

export const ServiceFeaturedWork = ({ items }: ServiceFeaturedWorkProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="section-padding container space-y-16 md:space-y-18">
      <h2 className="text-4xl">Featured work</h2>

      <div className="grid gap-x-6 gap-y-12 lg:grid-cols-3">
        {items.map((project, index) => (
          <ProjectCard key={index} project={project} className="h-[290px]" />
        ))}
      </div>
    </section>
  );
};
