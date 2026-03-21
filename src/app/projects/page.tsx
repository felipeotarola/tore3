import { Metadata } from 'next';

import { ProjectCard } from '@/components/project-card';
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
    <div className="hero-padding container flex flex-col gap-10">
      <h1 className="text-4xl">Projects</h1>

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
            <TabsContent key={category.value} value={category.value}>
              <div className="grid gap-x-6 gap-y-12 pt-12 lg:min-h-[966px] lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    className="h-[290px]"
                  />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
