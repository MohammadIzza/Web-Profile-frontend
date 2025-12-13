import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi } from '../services/api';
import type { Blog } from '../types';
import SEO from '../components/SEO';
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
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Skeleton className="h-8 w-24" />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </main>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
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
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
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
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
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
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {blog.excerpt && (
              <p className="text-lg text-gray-600 mb-6">
                {blog.excerpt}
              </p>
            )}

            <Separator />
          </header>

          {/* Featured Image */}
          {blog.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-black prose-code:text-gray-800 prose-pre:bg-gray-50"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <Button asChild variant="outline">
            <Link to="/#blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Link>
          </Button>
        </footer>
      </main>
    </div>
    </>
  );
}
