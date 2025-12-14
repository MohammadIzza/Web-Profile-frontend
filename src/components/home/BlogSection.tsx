import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import EmptyState from '../EmptyState';
import type { Blog } from '../../types';

interface BlogSectionProps {
  blogs: Blog[];
  loading: boolean;
}

export default function BlogSection({ blogs, loading }: BlogSectionProps) {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-2 sm:gap-4 lg:gap-6 min-w-max pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-paper border-line flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]">
              <div className="h-32 sm:h-40 lg:h-48 bg-line/30 animate-pulse" />
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="h-4 sm:h-5 w-3/4 bg-line/30 rounded animate-pulse mb-2" />
                <div className="h-3 sm:h-4 w-1/2 bg-line/30 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="h-12 sm:h-16 w-full bg-line/30 rounded animate-pulse mb-2 sm:mb-4" />
                <div className="h-6 sm:h-7 w-20 sm:w-24 bg-line/30 rounded animate-pulse" />
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
    <Card key={blog.id} className="bg-paper border-line hover:brightness-95 transition duration-200 group flex flex-col overflow-hidden flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]">
      {blog.image && (
        <div className="h-32 sm:h-40 lg:h-48 overflow-hidden flex-shrink-0">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 flex-shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-serif text-ink/50 mb-1 sm:mb-2">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="truncate">{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <CardTitle className="text-sm sm:text-base lg:text-lg font-serif font-semibold text-ink line-clamp-2 group-hover:text-ink/80 transition-colors mb-2">
          {blog.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Description dengan max-height */}
        {blog.excerpt && (
          <div className="flex-1 min-h-0 mb-2 sm:mb-3">
            <CardDescription className="text-xs sm:text-sm font-serif text-ink/60 line-clamp-3 max-h-[60px] sm:max-h-[72px] lg:max-h-[84px] overflow-hidden">
              {blog.excerpt}
            </CardDescription>
          </div>
        )}
        
        {/* Footer section - selalu di bawah */}
        <div className="mt-auto flex-shrink-0">
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
            {blog.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-[10px] sm:text-xs lg:text-sm h-4 sm:h-5 px-1.5 sm:px-2 bg-ink/5 text-ink/60 border-line">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="mb-2 sm:mb-3 bg-line" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 sm:h-8 text-xs sm:text-sm w-full hover:bg-ink/5"
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
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <div className="flex gap-2 sm:gap-4 lg:gap-6 min-w-max pb-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

