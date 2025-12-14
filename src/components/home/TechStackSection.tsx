import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import EmptyState from '../EmptyState';
import type { TechStack } from '../../types';

interface TechStackSectionProps {
  techStacks: TechStack[];
  loading: boolean;
}

export default function TechStackSection({ techStacks, loading }: TechStackSectionProps) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-paper border-line">
            <CardHeader>
              <div className="h-5 w-32 bg-line/30 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-full bg-line/30 rounded animate-pulse" />
              <div className="h-4 w-full bg-line/30 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-line/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (techStacks.length === 0) {
    return <EmptyState type="general" message="No tech stack added yet." />;
  }

  const getLevelValue = (level: string) => {
    switch (level) {
      case 'expert': return 5;
      case 'advanced': return 4;
      case 'intermediate': return 3;
      case 'beginner': return 2;
      default: return 3;
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {['frontend', 'backend', 'tools', 'database', 'devops', 'other'].map((category) => {
        const categoryTechs = techStacks.filter(
          (tech) => tech.category.toLowerCase() === category
        );
        if (categoryTechs.length === 0) return null;
        
        return (
          <Card key={category} className="bg-paper border-line">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif font-semibold text-ink capitalize">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTechs.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tech.icon && (
                        <span className="text-lg">{tech.icon}</span>
                      )}
                      <span className="text-sm font-serif font-medium text-ink/80">
                        {tech.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= getLevelValue(tech.level)
                              ? 'fill-ink/40 text-ink/40'
                              : 'text-line'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

