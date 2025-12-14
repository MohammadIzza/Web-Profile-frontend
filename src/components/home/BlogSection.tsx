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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-paper border-line">
            <div className="h-40 bg-line/30 animate-pulse" />
            <CardHeader>
              <div className="h-5 w-3/4 bg-line/30 rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-line/30 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-16 w-full bg-line/30 rounded animate-pulse mb-4" />
              <div className="h-7 w-24 bg-line/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return <EmptyState type="blog" />;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {blogs.map((blog) => (
        <Card key={blog.id} className="bg-paper border-line hover:brightness-95 transition duration-200 group">
          {blog.image && (
            <div className="h-40 overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-xs font-serif text-ink/50 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <CardTitle className="text-base font-serif font-semibold text-ink line-clamp-2 group-hover:text-ink/80 transition-colors">
              {blog.title}
            </CardTitle>
            {blog.excerpt && (
              <CardDescription className="text-xs font-serif text-ink/60 line-clamp-3 mt-2">
                {blog.excerpt}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs h-5 px-2 bg-ink/5 text-ink/60 border-line">
                  {tag}
                </Badge>
              ))}
            </div>
            <Separator className="mb-4 bg-line" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs w-full hover:bg-ink/5"
              asChild
            >
              <Link to={`/blog/${blog.slug}`}>
                Read More →
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

