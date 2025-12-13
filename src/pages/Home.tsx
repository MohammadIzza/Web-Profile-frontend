import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileApi, portfolioApi, blogApi, experienceApi, techStackApi } from '../services/api';
import type { Profile, Portfolio, Blog, Experience, TechStack } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Calendar, Briefcase, Code2, Star } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, portfolioRes, blogRes, experienceRes, techStackRes] = await Promise.all([
        profileApi.getAll(),
        portfolioApi.getAll(),
        blogApi.getAll(),
        experienceApi.getAll(),
        techStackApi.getAll(),
      ]);
      
      if (profileRes.data.length > 0) {
        setProfile(profileRes.data[0]);
      }
      setPortfolios(portfolioRes.data.slice(0, 3));
      setBlogs(blogRes.data.filter((b: Blog) => b.published).slice(0, 3));
      setExperiences(experienceRes.data.slice(0, 4));
      setTechStacks(techStackRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={profile?.name || 'Portfolio Website'}
        description={profile?.bio || 'Welcome to my portfolio website'}
        image={profile?.avatar}
      />
      <TooltipProvider>
        <div className="min-h-screen bg-white">
        {/* Header/Navigation */}
        <header className="border-b border-gray-200 sticky top-0 bg-white z-10 backdrop-blur-sm bg-white/90">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <h1 className="text-lg font-semibold text-black">
                {loading ? <Skeleton className="h-5 w-24" /> : profile?.name || 'Portfolio'}
              </h1>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="#projects" className="text-gray-700 hover:text-black transition">Projects</a>
              <a href="#experience" className="text-gray-700 hover:text-black transition">Experience</a>
              <a href="#techstack" className="text-gray-700 hover:text-black transition">Tech Stack</a>
              <a href="#blog" className="text-gray-700 hover:text-black transition">Blog</a>
              <a href="#contact" className="text-gray-700 hover:text-black transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="border-b py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-64 mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-20 w-full max-w-2xl mx-auto" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ) : profile ? (
              <div className="text-center">
                {profile.avatar && (
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl">{profile.name?.charAt(0) || 'P'}</AvatarFallback>
                  </Avatar>
                )}
                <h2 className="text-4xl font-bold text-black mb-2">{profile.name}</h2>
                <p className="text-lg text-gray-600 mb-3">{profile.title}</p>
                <Separator className="my-4 max-w-xs mx-auto" />
                <p className="text-sm text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">{profile.bio}</p>
                
                <div className="flex items-center justify-center gap-6 mb-6 text-xs text-gray-600">
                  {profile.email && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-black transition">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send me an email</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {profile.location && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Location</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                  {profile.github && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" asChild>
                          <a href={profile.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>GitHub Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {profile.linkedin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" asChild>
                          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>LinkedIn Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {profile.twitter && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0" asChild>
                          <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Twitter Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="projects" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-black mb-2">Featured Projects</h3>
              <p className="text-sm text-gray-600">Check out some of my recent work</p>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white">
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-7 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : portfolios.length === 0 ? (
              <EmptyState type="portfolio" />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 group">
                    {portfolio.image && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={portfolio.image} 
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-black">{portfolio.title}</CardTitle>
                      {portfolio.description && (
                        <CardDescription className="text-xs text-gray-600 line-clamp-2">
                          {portfolio.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {portfolio.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs h-6 px-2">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Separator className="mb-4" />
                      <div className="flex gap-2">
                        {portfolio.link && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
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
                              <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
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
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-semibold text-black">Work Experience</h3>
              </div>
              <p className="text-sm text-gray-600">My professional journey</p>
            </div>
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-5 w-64 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : experiences.length === 0 ? (
              <EmptyState type="general" message="No work experience added yet." />
            ) : (
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Card key={exp.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-black"></div>
                            <h4 className="text-lg font-semibold text-black">{exp.position}</h4>
                            {exp.current && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <div className="ml-5">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {exp.company}
                              {exp.location && (
                                <span className="text-gray-500"> • {exp.location}</span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                {' - '}
                                {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < experiences.length - 1 && (
                        <div className="mt-6 ml-5">
                          <div className="w-0.5 h-6 bg-gray-200"></div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="techstack" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-semibold text-black">Tech Stack</h3>
              </div>
              <p className="text-sm text-gray-600">Technologies I work with</p>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white">
                    <CardHeader>
                      <Skeleton className="h-5 w-32 mb-4" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : techStacks.length === 0 ? (
              <EmptyState type="general" message="No tech stack added yet." />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {['frontend', 'backend', 'tools', 'database', 'devops', 'other'].map((category) => {
                  const categoryTechs = techStacks.filter(
                    (tech) => tech.category.toLowerCase() === category
                  );
                  if (categoryTechs.length === 0) return null;
                  
                  return (
                    <Card key={category} className="bg-white border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-black capitalize">
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
                                <span className="text-sm font-medium text-gray-800">
                                  {tech.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= (tech.level === 'expert' ? 5 : tech.level === 'advanced' ? 4 : tech.level === 'intermediate' ? 3 : 2)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
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
            )}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-black mb-2">Latest Blog Posts</h3>
              <p className="text-sm text-gray-600">Thoughts, tutorials, and insights</p>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white">
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-7 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState type="blog" />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 group">
                    {blog.image && (
                      <div className="h-40 overflow-hidden rounded-t-lg">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-base font-semibold text-black line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </CardTitle>
                      {blog.excerpt && (
                        <CardDescription className="text-xs text-gray-600 line-clamp-3 mt-2">
                          {blog.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs h-6 px-2">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Separator className="mb-4" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs w-full group-hover:bg-gray-100"
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
            )}
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="border-t border-gray-200 py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-black mb-2">Get In Touch</h3>
              <p className="text-sm text-gray-600">Feel free to reach out for collaborations or just a friendly hello</p>
            </div>
            
            <Separator className="mb-8" />
            
            {profile && (
              <div className="flex justify-center gap-4 mb-8">
                {profile.github && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" asChild>
                        <a href={profile.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {profile.linkedin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" asChild>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {profile.twitter && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" asChild>
                        <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {profile.email && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" asChild>
                        <a href={`mailto:${profile.email}`}>
                          <Mail className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
            
            <div className="text-center">
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} {profile?.name || 'Portfolio'}. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
    </>
  );
}