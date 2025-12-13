import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

export default function SEO({ 
  title = 'Portfolio Website', 
  description = 'Welcome to my portfolio website',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  publishedTime,
  tags = []
}: SEOProps) {
  const fullTitle = title === 'Portfolio Website' ? title : `${title} | Portfolio`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', description);
    setMetaTag('og:type', type, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [fullTitle, description, image, url, type, publishedTime, tags]);

  return null;
}
