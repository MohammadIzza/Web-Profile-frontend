import { Helmet } from 'react-helmet-async';

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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && tags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
