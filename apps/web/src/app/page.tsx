'use client';
import Hero from '@/components/home/Hero';
import ProjectSection from '@/components/home/ProjectSection';
import { DesignItem } from '@/types/puter.types';

import { GridPattern } from '@repo/ui/components/ui/grid-pattern';
import { useState } from 'react';

const Page = () => {
  const [projects, setProjects] = useState<DesignItem[]>([]);
  return (
    <div className="relative w-full min-h-screen flex flex-col ">
      <GridPattern className="z-0" />
      <Hero projects={projects} setProjects={setProjects} />
      <ProjectSection projects={projects} setProjects={setProjects} />
    </div>
  );
};

export default Page;
