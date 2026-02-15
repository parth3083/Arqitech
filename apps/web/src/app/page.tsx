'use client';
import { Button } from '@repo/ui/components/ui/button';

const page = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center font-medium text-xl flex-col gap-2">
      Welcome to ArqiTech
      <Button onClick={() => alert('Button clicked')}>Click Here</Button>
    </div>
  );
};

export default page;
