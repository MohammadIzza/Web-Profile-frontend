import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi } from '../services/api';
import type { Blog } from '../types';
import SEO from '../components/SEO';
import HomeLayout from '../components/home/HomeLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadBlog(slug);
    }
  }, [slug]);

  const loadBlog = async (slug: string) => {
    try {
      setLoading(true);
      setError(false);
      const response = await blogApi.getAll();
      const foundBlog = response.data.find((b: Blog) => b.slug === slug);
      
      if (foundBlog && foundBlog.published) {
        setBlog(foundBlog);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <HomeLayout>
        <header className="border-b border-line">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Skeleton className="h-8 w-24 bg-line/30" />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4 bg-line/30" />
          <Skeleton className="h-6 w-1/2 mb-8 bg-line/30" />
          <Skeleton className="h-64 w-full mb-8 bg-line/30" />
          <Skeleton className="h-4 w-full mb-2 bg-line/30" />
          <Skeleton className="h-4 w-full mb-2 bg-line/30" />
          <Skeleton className="h-4 w-3/4 bg-line/30" />
        </main>
      </HomeLayout>
    );
  }

  if (error || !blog) {
    return (
      <HomeLayout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-semibold text-ink mb-4">Blog Not Found</h1>
            <p className="text-ink/60 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="border-line hover:bg-ink/5">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt || blog.title}
        image={blog.image || '/og-image.jpg'}
        type="article"
        publishedTime={blog.createdAt}
        tags={blog.tags}
      />
      <HomeLayout>
        {/* Header */}
        <header className="border-b border-line sticky top-0 bg-paper/90 backdrop-blur-sm z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button variant="ghost" asChild className="hover:bg-ink/5">
              <Link to="/#blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Blog Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-ink mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-ink/60 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{estimateReadingTime(blog.content)} min read</span>
              </div>
            </div>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-ink/5 text-ink/60 border-line">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {blog.excerpt && (
              <p className="text-lg text-ink/70 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <Separator className="bg-line" />
          </header>

          {/* Featured Image */}
          {blog.image && (
            <div className="mb-8 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:font-serif prose-headings:text-ink prose-headings:font-semibold
              prose-p:text-ink/80 prose-p:leading-relaxed
              prose-a:text-ink prose-a:underline prose-a:underline-offset-2
              prose-strong:text-ink prose-strong:font-semibold
              prose-code:text-ink/80 prose-code:bg-ink/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-ink/5 prose-pre:border prose-pre:border-line
              prose-blockquote:border-l-ink/20 prose-blockquote:text-ink/70
              prose-ul:text-ink/80 prose-ol:text-ink/80
              prose-li:text-ink/80
              prose-hr:border-line"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>
      </HomeLayout>
    </>
  );
}
