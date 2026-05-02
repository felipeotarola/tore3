import { Metadata } from 'next';

import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { ProjectsShowcase } from '@/components/projects/projects-showcase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllProjects } from '@/lib/projects';
import { PROJECT_FILTERS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Projects',
};

export default async function ProjectsPage() {
  const allProjects = await getAllProjects();

  return (
    <>
      <DetailPageHeader
        fallbackHref="/"
        eyebrow="Selected work"
        title="Projects"
        description="Interior architecture and design across hospitality, bars, and workplace—each engagement shaped by place, brief, and craft."
      />
      <section className="container pb-12 md:pb-16 lg:pb-20">
        <Tabs defaultValue="all" className="w-full">
          <ScrollArea className="pb-2" orientation="horizontal">
            <TabsList className="gap-2">
              {PROJECT_FILTERS.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="text-xs tracking-[0.14em]"
                >
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
              <TabsContent
                key={category.value}
                value={category.value}
                className="mt-6 outline-none md:mt-7"
              >
                <ProjectsShowcase projects={filteredProjects} />
              </TabsContent>
            );
          })}
        </Tabs>
      </section>
    </>
  );
}
