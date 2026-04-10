import { CaseStudiesClient } from '@/components/sections/case-studies-client';
import { getAllProjects } from '@/lib/projects';

export const CaseStudies = async () => {
  const allProjects = await getAllProjects();

  return <CaseStudiesClient allProjects={allProjects} />;
};
