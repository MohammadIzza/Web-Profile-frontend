import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Code2, FileText } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useHomeData } from '../hooks/useHomeData';
import SEO from '../components/SEO';
import HomeLayout from '../components/home/HomeLayout';
import HeroSection from '../components/home/HeroSection';
import HorizontalRail from '../components/home/HorizontalRail';
import ProjectsSection from '../components/home/ProjectsSection';
import ExperienceSection from '../components/home/ExperienceSection';
import TechStackSection from '../components/home/TechStackSection';
import BlogSection from '../components/home/BlogSection';
import FooterSection from '../components/home/FooterSection';

export default function Home() {
  const { profile, portfolios, blogs, experiences, techStacks, loading } = useHomeData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Check URL parameter for section on mount
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && ['projects', 'experience', 'techstack', 'blog'].includes(sectionParam)) {
      setActiveSection(sectionParam);
      // Remove the parameter from URL after reading
      setSearchParams({}, { replace: true });
      
      // Scroll to section after a delay
      setTimeout(() => {
        const element = document.querySelector('#projects');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchParams, setSearchParams]);

  const railItems = [
    {
      id: 'projects',
      icon: Briefcase,
      title: 'Projects',
      description: 'Recent work',
      content: <ProjectsSection portfolios={portfolios} loading={loading} />,
      loading,
    },
    {
      id: 'experience',
      icon: Briefcase,
      title: 'Experience',
      description: 'Professional journey',
      content: <ExperienceSection experiences={experiences} loading={loading} />,
      loading,
    },
    {
      id: 'techstack',
      icon: Code2,
      title: 'Tech Stack',
      description: 'Technologies',
      content: <TechStackSection techStacks={techStacks} loading={loading} />,
      loading,
    },
    {
      id: 'blog',
      icon: FileText,
      title: 'Blog',
      description: 'Latest posts',
      content: <BlogSection blogs={blogs} loading={loading} />,
      loading,
    },
  ];

  return (
    <>
      <SEO
        title={profile?.name || 'Portfolio Website'}
        description={profile?.bio || 'Welcome to my portfolio website'}
        image={profile?.avatar}
      />
      <TooltipProvider>
        <HomeLayout onSectionChange={setActiveSection}>
          <HeroSection profile={profile} loading={loading} />

          {/* Horizontal Rail Section */}
          <section id="projects" className="border-b border-line">
            <HorizontalRail 
              items={railItems} 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </section>

          <FooterSection profile={profile} />
        </HomeLayout>
      </TooltipProvider>
    </>
  );
}
