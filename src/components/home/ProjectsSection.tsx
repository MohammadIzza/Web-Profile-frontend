import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Github } from 'lucide-react';
import EmptyState from '../EmptyState';
import HorizontalScrollRail from './HorizontalScrollRail';
import type { Portfolio } from '../../types';

interface ProjectsSectionProps {
  portfolios: Portfolio[];
  loading: boolean;
}

export default function ProjectsSection({ portfolios, loading }: ProjectsSectionProps) {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-paper border-line flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[400px]">
              <div className="h-48 sm:h-64 lg:h-80 bg-line/30 animate-pulse" />
              <CardHeader>
                <div className="h-5 w-3/4 bg-line/30 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-line/30 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return <EmptyState type="portfolio" />;
  }

  const ProjectCard = ({ portfolio }: { portfolio: Portfolio }) => (
    <Card className="bg-paper border-line hover:brightness-95 transition duration-200 group flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[400px]">
      {portfolio.image && (
        <div className="h-48 sm:h-64 lg:h-80 overflow-hidden">
          <img 
            src={portfolio.image} 
            alt={portfolio.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif font-semibold text-ink">{portfolio.title}</CardTitle>
        {portfolio.description && (
          <CardDescription className="text-sm font-serif text-ink/60 line-clamp-2 mt-2">
            {portfolio.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {portfolio.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-sm h-5 px-2 bg-ink/5 text-ink/60 border-line">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator className="mb-4 bg-line" />
        <div className="flex flex-col sm:flex-row gap-2">
          {portfolio.link && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm flex-1 border-line hover:bg-ink/5" asChild>
                  <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Demo
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View live demo</p>
              </TooltipContent>
            </Tooltip>
          )}
          {portfolio.github && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm flex-1 border-line hover:bg-ink/5" asChild>
                  <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5 mr-1" />
                    Code
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View source code</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max pb-4">
          {portfolios.map((portfolio) => (
            <ProjectCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

