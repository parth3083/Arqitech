import React from 'react';
import MaxWidth from '@/components/MaxWidth';
import ProjectCard from '@/components/home/ProjectCard';
const ProjectSection = () => {
  return (
    <MaxWidth className="flex w-full flex-col items-center gap-10 mt-24">
      <div className="w-full text-left">
        <h1 className="text-4xl md:text-6xl font-medium">Projects</h1>
        <p className="text-base text-neutral-500 mt-3 font-mono uppercase">
          Your latest work and shared community projects, all in one place.
        </p>
      </div>
      <div className="w-full mb-20! z-100 px-0 sm:px-6 lg:px-10 flex flex-col items-center gap-10 sm:flex-row sm:flex-wrap">
        <ProjectCard
          name="Project Title"
          time="15/02/2026"
          createdBy="John Doe"
        />
      </div>
    </MaxWidth>
  );
};

export default ProjectSection;
