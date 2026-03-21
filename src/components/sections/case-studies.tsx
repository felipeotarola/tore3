import { CaseStudyCarousel } from '@/components/sections/case-study-carousel';
import { getAllProjects } from '@/lib/projects';
import { HOME_FEATURED_SLUGS } from '@/lib/torekull';

export const CaseStudies = async () => {
  const allProjects = await getAllProjects();
  const caseStudyProjects = allProjects.filter((project) =>
    HOME_FEATURED_SLUGS.includes(
      project.slug as (typeof HOME_FEATURED_SLUGS)[number],
    ),
  );

  return (
    <section className="overflow-hidden">
      {caseStudyProjects.map((project) => (
        <CaseStudyCarousel
          key={project.slug}
          project={project}
          useIcon={false}
        />
      ))}
    </section>
  );
};

