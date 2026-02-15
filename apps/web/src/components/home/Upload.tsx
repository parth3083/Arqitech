'use client';

import { useAuth } from '@/context/AuthProvider';
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  REDIRECT_DELAY_MS,
} from '@/lib/constants';
import { Progress } from '@repo/ui/components/ui/progress';
import { UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type UploadProps = {
  onComplete?: (base64Data: string) => void;
};

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { isSignedIn } = useAuth();
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const readFileAsBase64 = (nextFile: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(nextFile);
    });

  const processFile = async (nextFile: File) => {
    if (!isSignedIn) {
      return;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setFile(nextFile);
    setProgress(0);

    const base64Promise = readFileAsBase64(nextFile);

    intervalRef.current = window.setInterval(() => {
      setProgress(current => {
        const nextValue = Math.min(current + PROGRESS_STEP, 100);
        if (nextValue === 100) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }
          base64Promise
            .then(base64Data => {
              timeoutRef.current = window.setTimeout(() => {
                onComplete?.(base64Data);
              }, REDIRECT_DELAY_MS);
            })
            .catch(() => null);
        }
        return nextValue;
      });
    }, PROGRESS_INTERVAL_MS);
    const uniqueId = Date.now().toString();
    router.push(`/visualizer/${uniqueId}`);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      return;
    }
    const nextFile = event.target.files?.[0];
    if (nextFile) {
      processFile(nextFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) {
      processFile(nextFile);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(false);
  };

  return (
    <div className="w-48 h-40">
      {!file ? (
        <label
          className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-neutral-300'
          } ${isSignedIn ? 'cursor-pointer' : 'opacity-60'}`}
          htmlFor="file-upload"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            disabled={!isSignedIn}
            onChange={handleFileChange}
          />
          <UploadIcon className="size-4 text-neutral-500" />
          <p className="text-sm text-neutral-500">Drag & drop your file here</p>
          <p className="text-xs text-neutral-500">Files upto 50MB</p>
        </label>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div className="w-full">
            <p className="text-xs text-neutral-500 truncate">{file.name}</p>
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-neutral-500">Uploading {progress}%</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
