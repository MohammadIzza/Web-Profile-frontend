import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import EmptyState from '../EmptyState';
import HorizontalScrollSection from './HorizontalScrollSection';
import type { Experience } from '../../types';

interface ExperienceSectionProps {
  experiences: Experience[];
  loading: boolean;
}

export default function ExperienceSection({ experiences, loading }: ExperienceSectionProps) {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-4 sm:gap-6 min-w-max pb-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-paper border-line flex-shrink-0 w-[400px] sm:w-[500px] lg:w-[600px]">
              <CardContent className="pt-4 sm:pt-6">
                <div className="h-6 w-48 bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-5 w-64 bg-line/30 rounded animate-pulse mb-4" />
                <div className="h-4 w-full bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-line/30 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return <EmptyState type="general" message="No work experience added yet." />;
  }

  const ExperienceCard = ({ exp, index }: { exp: Experience; index: number }) => (
    <Card className="bg-paper border-line hover:brightness-95 transition duration-200 flex-shrink-0 w-[400px] sm:w-[500px] lg:w-[600px]">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0 mt-1.5 sm:mt-0"></div>
                <h4 className="text-lg sm:text-xl font-serif font-semibold text-ink">{exp.position}</h4>
              </div>
              {exp.current && (
                <Badge variant="default" className="text-sm bg-ink text-paper w-fit">Current</Badge>
              )}
            </div>
            <div className="ml-4 sm:ml-5">
              <p className="text-base font-serif font-medium text-ink/80 mb-1 break-words">
                {exp.company}
                {exp.location && (
                  <span className="text-ink/50"> • {exp.location}</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm font-serif text-ink/50 mb-3 flex-wrap">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' - '}
                  {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-base font-serif text-ink/70 leading-relaxed whitespace-pre-line break-words">
                {exp.description}
              </p>
            </div>
          </div>
        </div>
        {index < experiences.length - 1 && (
          <div className="mt-4 sm:mt-6 ml-4 sm:ml-5">
            <div className="w-0.5 h-6 bg-line"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Desktop: GSAP Horizontal Scroll */}
      <div className="hidden lg:block">
        <HorizontalScrollSection enabled={true}>
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </HorizontalScrollSection>
      </div>
      
      {/* Mobile/Tablet: Native Horizontal Scroll */}
      <div className="lg:hidden">
        <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide touch-pan-x">
          <div className="flex gap-4 sm:gap-6 min-w-max pb-4 px-2 sm:px-4">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

