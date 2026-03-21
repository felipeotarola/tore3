import { CATEGORY_LABELS } from '@/lib/torekull';
import { ProjectFrontmatter } from '@/lib/types';

interface ProjectOverviewProps {
  title: string;
  description?: string;
  project: ProjectFrontmatter;
}

const getCategoryName = (category: string) => {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
};

export function ProjectOverview({
  title,
  description,
  project,
}: ProjectOverviewProps) {
  return (
    <section className="section-padding container">
      <div className="grid gap-10 md:grid-cols-2">
        <h2 className="text-4xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-lg">{description}</p>
        )}
      </div>

      <div className="mt-10 grid justify-between gap-6 sm:mt-20 sm:grid-cols-4 lg:mt-26 xl:mt-36">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-lg">Client</p>
          <p className="text-lg">{project.name}</p>
        </div>

        {project.date && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Date</p>
            <p className="text-lg">{project.date}</p>
          </div>
        )}

        {project.industry && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Industry</p>
            <p className="text-lg">{project.industry}</p>
          </div>
        )}

        {project.location && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Location</p>
            <p className="text-lg">{project.location}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-lg">Services</p>
          <p className="text-lg">{getCategoryName(project.category)}</p>
        </div>
      </div>

      {project.collaborators && project.collaborators.length > 0 && (
        <div className="mt-12 space-y-3">
          <p className="text-muted-foreground text-lg">Collaborators</p>
          <ul className="space-y-2 text-lg">
            {project.collaborators.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
