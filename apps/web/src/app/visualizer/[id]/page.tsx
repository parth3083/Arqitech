'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { generate3DView as generate3dView } from '@/lib/ai.actions';
import { Button } from '@repo/ui/components/ui/button';
import { Progress } from '@repo/ui/components/ui/progress';
import {
  ImageIcon,
  Layers3Icon,
  RefreshCwIcon,
  DownloadIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  SparklesIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                   */
/* ------------------------------------------------------------------ */

type ProjectState = {
  initialImage?: string;
  initialRendered?: string;
  name?: string;
};

type RenderStatus = 'idle' | 'generating' | 'done' | 'error';

const STATUS_MESSAGES = [
  'Analyzing floor plan geometry…',
  'Detecting rooms and walls…',
  'Mapping furniture placement…',
  'Generating 3D materials…',
  'Applying realistic lighting…',
  'Rendering final output…',
];

function getProjectFromStorage(id: string): ProjectState | null {
  try {
    const stored = sessionStorage.getItem(`project-${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Loader component                                                  */
/* ------------------------------------------------------------------ */

function RenderLoader({ progress }: { progress: number }) {
  const msgIndex = Math.min(
    Math.floor((progress / 100) * STATUS_MESSAGES.length),
    STATUS_MESSAGES.length - 1
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
      {/* Animated glow ring */}
      <div className="relative flex items-center justify-center">
        <span className="absolute size-28 rounded-full bg-primary/20 animate-ping" />
        <span className="absolute size-24 rounded-full bg-primary/10 animate-pulse" />
        <div className="relative z-10 size-20 rounded-full bg-primary/15 backdrop-blur-sm flex items-center justify-center border border-primary/30">
          <SparklesIcon className="size-8 text-primary animate-pulse" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{STATUS_MESSAGES[msgIndex]}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Skeleton preview */}
      <div className="w-full max-w-md aspect-video rounded-xl border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-3">
          <Layers3Icon className="size-10 text-primary/40 animate-bounce" />
          <p className="text-sm text-muted-foreground">Generating 3D render…</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Image panel                                                       */
/* ------------------------------------------------------------------ */

function ImagePanel({
  label,
  icon: Icon,
  src,
  alt,
}: {
  label: string;
  icon: React.ElementType;
  src: string;
  alt: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          {label}
        </h2>
      </div>
      <div className="relative w-full aspect-video rounded-xl border bg-card shadow-md overflow-hidden group">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

const VisualizerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectState | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<RenderStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* ---------- hydrate from session storage ---------- */
  useEffect(() => {
    const data = getProjectFromStorage(id);
    if (data) {
      setProject(data);
      if (data.initialRendered) {
        setRenderedImage(data.initialRendered);
        setStatus('done');
        setProgress(100);
      }
    }
  }, [id]);

  /* ---------- generate 3D render ---------- */
  const handleGenerate = useCallback(async () => {
    if (!project?.initialImage) return;

    setStatus('generating');
    setError(null);
    setProgress(0);
    setRenderedImage(null);

    // Simulated progress ticker — advances smoothly until the real result arrives
    const tick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) {
          clearInterval(tick);
          return 92;
        }
        // ease-out: slower as it approaches 92
        return prev + (92 - prev) * 0.06;
      });
    }, 400);

    try {
      const result = await generate3dView({
        sourceImage: project.initialImage,
      });

      clearInterval(tick);

      if (result.renderedImage) {
        setRenderedImage(result.renderedImage);
        setProgress(100);
        setStatus('done');

        // Persist to session storage so refreshes keep the render
        const updated: ProjectState = {
          ...project,
          initialRendered: result.renderedImage,
        };
        sessionStorage.setItem(`project-${id}`, JSON.stringify(updated));
        setProject(updated);
      } else {
        throw new Error('No rendered image was returned');
      }
    } catch (err) {
      clearInterval(tick);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, [project, id]);

  /* ---------- auto-generate on first load if no render exists ---------- */
  useEffect(() => {
    if (
      project?.initialImage &&
      !project.initialRendered &&
      status === 'idle'
    ) {
      handleGenerate();
    }
  }, [project, status, handleGenerate]);

  /* ---------- download helper ---------- */
  const handleDownload = () => {
    if (!renderedImage) return;
    const a = document.createElement('a');
    a.href = renderedImage;
    a.download = `${project?.name ?? 'render'}-3d.png`;
    a.click();
  };

  /* ---------- nothing in storage ---------- */
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading project…</p>
        </div>
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-8 md:px-8">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {project.name ?? `Project ${id}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered 3D architectural visualization
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {status === 'done' && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <DownloadIcon />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                <RefreshCwIcon />
                Re-generate
              </Button>
            </>
          )}
          {status === 'error' && (
            <Button variant="default" size="sm" onClick={handleGenerate}>
              <RefreshCwIcon />
              Retry
            </Button>
          )}
          {status === 'idle' && project.initialImage && (
            <Button variant="default" size="sm" onClick={handleGenerate}>
              <SparklesIcon />
              Generate 3D View
            </Button>
          )}
        </div>
      </div>

      {/* Status banner */}
      {status === 'done' && (
        <div className="w-full max-w-6xl mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2Icon className="size-4 shrink-0" />
          Render completed successfully
        </div>
      )}
      {status === 'error' && (
        <div className="w-full max-w-6xl mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          <AlertCircleIcon className="size-4 shrink-0" />
          {error ?? 'An error occurred during rendering'}
        </div>
      )}

      {/* Content area */}
      <div className="w-full max-w-6xl flex flex-col gap-6 md:flex-row">
        {/* Source panel — always visible */}
        {project.initialImage && (
          <ImagePanel
            label="Source"
            icon={ImageIcon}
            src={project.initialImage}
            alt="Source floor plan"
          />
        )}

        {/* Rendered panel / loader / placeholder */}
        {status === 'generating' ? (
          <RenderLoader progress={progress} />
        ) : renderedImage ? (
          <ImagePanel
            label="3D Render"
            icon={Layers3Icon}
            src={renderedImage}
            alt="Rendered 3D design"
          />
        ) : (
          status !== 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 py-16">
              <Layers3Icon className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Click{' '}
                <span className="font-medium text-primary">
                  Generate 3D View
                </span>{' '}
                to create a render
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VisualizerPage;
