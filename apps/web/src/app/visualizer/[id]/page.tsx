'use client';

import { useAuth } from '@/context/AuthProvider';
import { generate3DView as generate3dView } from '@/lib/ai.actions';
import { createProject, getProjectById } from '@/lib/puter.action';
import { DesignItem } from '@/types/puter.types';
import { Button } from '@repo/ui/components/ui/button';
import { Progress } from '@repo/ui/components/ui/progress';
import {
  Download,
  GripVertical,
  ImageIcon,
  Layers3Icon,
  RefreshCcw,
  SparklesIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';

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
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

const VisualizerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();

  const hasInitialGenerated = useRef(false);

  const [project, setProject] = useState<ProjectState | null>(null);
  const [designItem, setDesignItem] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [status, setStatus] = useState<RenderStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  /* ---------- download helper ---------- */
  const handleExport = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `arqitech-${id || 'design'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ---------- generate 3D render ---------- */
  const handleGenerate = useCallback(async () => {
    const sourceImage = project?.initialImage;
    if (!id || !sourceImage) return;

    setStatus('generating');
    setError(null);
    setProgress(0);
    setCurrentImage(null);

    // Simulated progress ticker
    const tick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) {
          clearInterval(tick);
          return 92;
        }
        return prev + (92 - prev) * 0.06;
      });
    }, 400);

    try {
      const result = await generate3dView({ sourceImage });
      clearInterval(tick);

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);
        setProgress(100);
        setStatus('done');

        // Persist to session storage
        const updated: ProjectState = {
          ...project,
          initialRendered: result.renderedImage,
        };
        sessionStorage.setItem(`project-${id}`, JSON.stringify(updated));
        setProject(updated);

        // Also try saving via puter
        const item: DesignItem = {
          id,
          name: project?.name ?? `Project ${id}`,
          sourceImage,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: userId ?? null,
          isPublic: false,
        };

        const saved = await createProject({
          item,
          visibility: 'private',
        });

        if (saved) {
          setDesignItem(saved);
          setCurrentImage(saved.renderedImage || result.renderedImage);
        }
      } else {
        throw new Error('No rendered image was returned');
      }
    } catch (err) {
      clearInterval(tick);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, [project, id, userId]);

  /* ---------- hydrate from session storage + puter ---------- */
  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      // Try session storage first
      const stored = getProjectFromStorage(id);
      if (stored) {
        if (isMounted) {
          setProject(stored);
          if (stored.initialRendered) {
            setCurrentImage(stored.initialRendered);
            setStatus('done');
            setProgress(100);
          }
        }
      }

      // Also fetch from puter
      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      if (fetchedProject) {
        setDesignItem(fetchedProject);
        setCurrentImage(fetchedProject.renderedImage || null);

        // Sync to local state
        const projectState: ProjectState = {
          initialImage: fetchedProject.sourceImage,
          initialRendered: fetchedProject.renderedImage ?? undefined,
          name: fetchedProject.name ?? undefined,
        };
        setProject(projectState);

        if (fetchedProject.renderedImage) {
          setStatus('done');
          setProgress(100);
          hasInitialGenerated.current = true;
        }
      }

      setIsProjectLoading(false);
      // Only reset if we don't already have a rendered image
      if (!hasInitialGenerated.current) {
        hasInitialGenerated.current = false;
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ---------- auto-generate on first load ---------- */
  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.initialImage
    )
      return;

    if (project.initialRendered) {
      setCurrentImage(project.initialRendered);
      setStatus('done');
      setProgress(100);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void handleGenerate();
  }, [project, isProjectLoading, handleGenerate]);

  /* ---------- progress message ---------- */
  const msgIndex = Math.min(
    Math.floor((progress / 100) * STATUS_MESSAGES.length),
    STATUS_MESSAGES.length - 1
  );

  const sourceImage = project?.initialImage;
  const projectName = project?.name || designItem?.name || `Project ${id}`;
  const isProcessing = status === 'generating';

  /* ---------- loading state ---------- */
  if (!project && isProjectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading project…</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* ===== Content Area ===== */}
      <section className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 lg:gap-0">
        {/* ---------- Main Render Panel ---------- */}
        <div className="flex flex-col p-4 md:p-6 lg:border-r border-border">
          {/* Panel header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Project
              </p>
              <h2 className="text-xl font-semibold tracking-tight">
                {projectName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Created by You
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Export — always visible when there's a rendered image */}
              {currentImage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExport}
                  className="gap-1.5 cursor-pointer"
                >
                  <Download className="size-3.5" /> Export
                </Button>
              )}
            </div>
          </div>

          {/* Render area */}
          <div className="relative flex-1 min-h-[320px] md:min-h-[480px] rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Show rendered image or source fallback */}
            {currentImage ? (
              <Image
                src={currentImage}
                alt="AI Render"
                fill
                unoptimized
                className="object-contain transition-transform duration-500"
              />
            ) : sourceImage ? (
              <Image
                src={sourceImage}
                alt="Original"
                fill
                unoptimized
                className="object-contain opacity-50"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Layers3Icon className="size-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Click{' '}
                  <span className="font-medium text-primary">
                    Generate 3D View
                  </span>{' '}
                  to create a render
                </p>
              </div>
            )}

            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div className="flex flex-col items-center gap-5 p-8 rounded-2xl bg-card/90 border border-border shadow-xl">
                  {/* Animated glow ring */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute size-20 rounded-full bg-primary/15 animate-ping" />
                    <span className="absolute size-16 rounded-full bg-primary/10 animate-pulse" />
                    <div className="relative z-10 size-14 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/25">
                      <RefreshCcw className="size-6 text-primary animate-spin" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-base font-semibold tracking-tight">
                      Rendering…
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Generating your 3D visualization
                    </span>
                  </div>
                  <div className="w-56 flex flex-col gap-1.5">
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{STATUS_MESSAGES[msgIndex]}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---------- Comparison Panel ---------- */}
        <div className="flex flex-col p-4 md:p-6 bg-muted/30">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Comparison
              </p>
              <h3 className="text-base font-semibold tracking-tight">
                Before & After
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/60 px-2.5 py-1 rounded-full border border-border/50">
              <GripVertical className="size-3" />
              Drag to compare
            </div>
          </div>

          {/* Compare stage */}
          <div className="flex-1 min-h-[280px] md:min-h-[400px] rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {sourceImage && currentImage ? (
              <ReactCompareSlider
                style={{
                  width: '100%',
                  height: '100%',
                }}
                itemOne={
                  <ReactCompareSliderImage
                    src={sourceImage}
                    alt="Before"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage}
                    alt="After"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8">
                {sourceImage ? (
                  <>
                    <div className="relative w-full max-w-[280px] aspect-video rounded-lg overflow-hidden border border-border/50">
                      <Image
                        src={sourceImage}
                        alt="Before"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Comparison will be available after rendering
                    </p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="size-10 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground text-center">
                      Upload a floor plan to get started
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick stats */}
          {status === 'done' && sourceImage && currentImage && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background/60 border border-border/50">
                <ImageIcon className="size-4 text-muted-foreground" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Original
                </span>
                <span className="text-xs font-semibold text-foreground">
                  2D Floor Plan
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Layers3Icon className="size-4 text-primary" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70">
                  Generated
                </span>
                <span className="text-xs font-semibold text-foreground">
                  3D Render
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VisualizerPage;
