import React from 'react';
import MaxWidth from '../MaxWidth';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { ArrowRightIcon, Layers } from 'lucide-react';
import Upload from './Upload';

const Hero = () => {
  return (
    <MaxWidth className="relative z-10 w-full flex flex-col items-center gap-10 pt-20">
      {/* Hero Section  */}

      <div className="w-full flex flex-col items-center gap-3">
        <Badge variant={'outline'} className="flex items-center gap-2">
          <div className="size-2 bg-primary animate-pulse rounded-full" />
          <p className="text-sm!">Introducing ArqiTech 2.0</p>
        </Badge>
        <h1 className="text-4xl md:text-6xl font-medium text-center ">
          Build beautiful spaces with the speed of thought with ArqiTech_
        </h1>
        <p className="text-base text-neutral-500 max-w-2xl text-center mt-3 font-mono uppercase">
          arqitech is ai-first design environment that helps you visualize,
          render and ship archietectureal projects faster than ever.
        </p>
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row sm:gap-12">
          <Button className="flex w-full sm:w-auto group items-center gap-2 cursor-pointer uppercase text-base">
            Start Building
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
          </Button>
          <Button
            className="w-full sm:w-auto cursor-pointer uppercase text-base"
            variant={'outline'}
          >
            Watch Demo
          </Button>
        </div>
        <div className="mt-20 min-h-[22rem] sm:min-h-[26rem] bg-accent rounded-2xl w-full max-w-5xl  flex items-center justify-center px-4">
          <div className="flex w-full max-w-md flex-col items-center bg-white gap-4 p-4 sm:p-6 rounded-2xl">
            <div className="p-2 rounded-full flex items-center bg-primary/50 justify-center">
              <Layers className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl text-center font-medium">
                Upload your floor plan
              </h3>
              <p className="text-base">Supports JPG, PNG, formats upto 10MB</p>
            </div>
            <Upload />
          </div>
        </div>
      </div>
    </MaxWidth>
  );
};

export default Hero;
