'use client';
import Hero from '@/components/home/Hero';
import ProjectSection from '@/components/home/ProjectSection';

import { GridPattern } from '@repo/ui/components/ui/grid-pattern';

const page = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col ">
      <GridPattern className="z-0" />
      <Hero />
      <ProjectSection />
    </div>
  );
};

export default page;
