import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { ProjectCardProps } from '@/types/project-card.types';
import Image from 'next/image';
import Link from 'next/link';

function formatTimeAgo(time: string | number | Date): string {
  const date = new Date(time);
  if (isNaN(date.getTime())) return String(time);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffMonth < 12)
    return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const ProjectCard = ({
  id,
  name,
  time,
  createdBy,
  imageUrl,
}: ProjectCardProps) => {
  return (
    <Link href={`/visualizer/${id}`} className="block">
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
              <span>{formatTimeAgo(time)}</span>
              <span className="font-medium">by {createdBy}</span>
            </p>
          </div>
          <div className="p-2 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-background transition-colors cursor-pointer">
            <ArrowRightIcon className="size-5 -rotate-45" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
