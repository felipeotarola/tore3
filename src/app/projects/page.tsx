import { Metadata } from 'next';

import { ProjectsShowcase } from '@/components/projects/projects-showcase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllProjectsWithLogos } from '@/lib/projects';
import { PROJECT_FILTERS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Projects',
};

export default async function ProjectsPage() {
  const allProjects = await getAllProjectsWithLogos();

  return (
    <div className="hero-padding container flex flex-col gap-10 lg:gap-12">
      <header className="max-w-3xl space-y-3">
        <p className="nav-caps text-xs text-muted-foreground">Selected work</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl">Projects</h1>
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          Interior architecture and design across hospitality, bars, and workplace—each
          engagement shaped by place, brief, and craft.
        </p>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <ScrollArea className="pb-2" orientation="horizontal">
          <TabsList>
            {PROJECT_FILTERS.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {PROJECT_FILTERS.map((category) => {
          const filteredProjects =
            category.value === 'all'
              ? allProjects
              : allProjects.filter(
                  (project) => project.category === category.value,
                );

          return (
            <TabsContent key={category.value} value={category.value} className="outline-none">
              <ProjectsShowcase projects={filteredProjects} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
