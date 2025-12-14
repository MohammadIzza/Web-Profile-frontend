import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import EmptyState from '../EmptyState';
import HorizontalScrollSection from './HorizontalScrollSection';
import type { Blog } from '../../types';

interface BlogSectionProps {
  blogs: Blog[];
  loading: boolean;
}

export default function BlogSection({ blogs, loading }: BlogSectionProps) {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 lg:gap-4 min-w-max pb-4 px-2 sm:px-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-paper border-line flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[320px]">
              <div className="h-24 sm:h-32 lg:h-40 bg-line/30 animate-pulse" />
              <CardHeader className="p-2.5 sm:p-3 lg:p-4">
                <div className="h-3 sm:h-4 w-3/4 bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-2.5 sm:h-3 w-1/2 bg-line/30 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="p-2.5 sm:p-3 lg:p-4">
                <div className="h-10 sm:h-12 w-full bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-line/30 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return <EmptyState type="blog" />;
  }

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <Card key={blog.id} className="bg-paper border-line hover:brightness-95 transition duration-200 group flex flex-col overflow-hidden flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[320px]">
      {blog.image && (
        <div className="h-24 sm:h-32 lg:h-40 overflow-hidden flex-shrink-0">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="p-2.5 sm:p-3 lg:p-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-serif text-ink/50 mb-1">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <CardTitle className="text-xs sm:text-sm lg:text-base font-serif font-semibold text-ink line-clamp-2 group-hover:text-ink/80 transition-colors mb-1.5">
          {blog.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2.5 sm:p-3 lg:p-4 pt-0 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Description dengan max-height */}
        {blog.excerpt && (
          <div className="flex-1 min-h-0 mb-2">
            <CardDescription className="text-[10px] sm:text-xs font-serif text-ink/60 line-clamp-2 sm:line-clamp-3 max-h-[48px] sm:max-h-[60px] lg:max-h-[72px] overflow-hidden">
              {blog.excerpt}
            </CardDescription>
          </div>
        )}
        
        {/* Footer section - selalu di bawah */}
        <div className="mt-auto flex-shrink-0">
          <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2">
            {blog.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-[9px] sm:text-[10px] h-3.5 sm:h-4 px-1.5 sm:px-2 bg-ink/5 text-ink/60 border-line">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="mb-1.5 sm:mb-2 bg-line" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 sm:h-7 text-[10px] sm:text-xs w-full hover:bg-ink/5"
            asChild
          >
            <Link to={`/blog/${blog.slug}`}>
              Read More →
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Desktop: GSAP Horizontal Scroll */}
      <div className="hidden lg:block">
        <HorizontalScrollSection enabled={true}>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </HorizontalScrollSection>
      </div>
      
      {/* Mobile/Tablet: Native Horizontal Scroll */}
      <div className="lg:hidden">
        <div 
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide touch-pan-x"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            overscrollBehaviorX: 'contain'
          }}
        >
          <div className="flex gap-2 sm:gap-3 min-w-max pb-4 px-2 sm:px-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

