'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type ProjectState = {
  initialImage?: string;
  initialRendered?: string;
  name?: string;
};

function getProjectFromStorage(id: string): ProjectState | null {
  try {
    const stored = sessionStorage.getItem(`project-${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const VisualizerPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectState = getProjectFromStorage(id);

  if (!projectState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-medium mb-6">
        {projectState.name ?? `Project ${id}`}
      </h1>
      <div className="w-full max-w-5xl flex flex-col gap-6 md:flex-row">
        {projectState.initialImage && (
          <div className="flex-1 flex flex-col items-center gap-2">
            <h2 className="text-lg font-medium">Source</h2>
            <div className="relative w-full aspect-video">
              <Image
                src={projectState.initialImage}
                alt="Source floor plan"
                fill
                unoptimized
                className="rounded-xl border object-contain"
              />
            </div>
          </div>
        )}
        {projectState.initialRendered && (
          <div className="flex-1 flex flex-col items-center gap-2">
            <h2 className="text-lg font-medium">Rendered</h2>
            <div className="relative w-full aspect-video">
              <Image
                src={projectState.initialRendered}
                alt="Rendered design"
                fill
                unoptimized
                className="rounded-xl border object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizerPage;
