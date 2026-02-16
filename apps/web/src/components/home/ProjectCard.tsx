import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { ProjectCardProps } from '@/types/project-card.types';
import Image from 'next/image';

const ProjectCard = ({ name, time, createdBy, imageUrl }: ProjectCardProps) => {
  return (
    <Card className="size-80 p-0! overflow-hidden flex flex-col gap-0! items-center group">
      <CardContent className="w-full h-[80%] p-0 m-0 relative">
        <Badge
          variant={'secondary'}
          className="absolute top-2 left-2 text-base uppercase rounded-xl!"
        >
          Community
        </Badge>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} preview`}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </CardContent>
      <CardFooter className="w-full h-[25%] p-3 flex items-center justify-between">
        <div className="flex flex-col gap-2 items-start">
          <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {name}
          </h4>
          <p className="text-sm text-neutral-500 flex items-center space-x-4 uppercase font-mono">
            <ClockIcon className="size-4" />
            <span>{time}</span>
            <span className="font-medium">by {createdBy}</span>
          </p>
        </div>
        <div className="p-2 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-background transition-colors cursor-pointer">
          <ArrowRightIcon className="size-5 -rotate-45" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
