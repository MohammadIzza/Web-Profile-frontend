import { useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeLayoutProps {
  children: ReactNode;
  onSectionChange?: (sectionId: string | null) => void;
}

export default function HomeLayout({ children, onSectionChange }: HomeLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { href: '#projects', label: 'Projects', sectionId: 'projects' },
    { href: '#experience', label: 'Experience', sectionId: 'experience' },
    { href: '#techstack', label: 'Tech Stack', sectionId: 'techstack' },
    { href: '#blog', label: 'Blog', sectionId: 'blog' },
    { href: '#contact', label: 'Contact', sectionId: null },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string | null) => {
    e.preventDefault();
    
    if (!isHomePage) {
      // If not on Home page, navigate to Home with sectionId
      if (sectionId) {
        navigate(`/?section=${sectionId}`);
      } else {
        // For contact, navigate to home with hash
        navigate('/#contact');
        // After navigation, scroll to contact
        setTimeout(() => {
          const element = document.querySelector('#contact');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      return;
    }
    
    // If on Home page, handle section opening
    if (sectionId && onSectionChange) {
      // Open the section
      onSectionChange(sectionId);
      
      // Scroll to the section
      setTimeout(() => {
        const element = document.querySelector('#projects');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (sectionId === null) {
      // For contact, just scroll
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex">
        {/* Sidebar Left - Desktop */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 border-r border-line bg-paper z-30">
          <nav className="flex flex-col items-center justify-center gap-8 w-full py-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                className="writing-vertical text-sm font-serif font-medium text-ink/60 hover:text-ink transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-20">
          {/* Mobile Header */}
          <header className="lg:hidden border-b border-line sticky top-0 bg-paper z-20 backdrop-blur-sm bg-paper/90">
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="text-base font-serif font-semibold text-ink">
                Portfolio
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-8 w-8 p-0"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 bg-ink/10 z-30 lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <nav className="absolute top-full left-0 right-0 lg:hidden border-t border-line bg-paper z-40 shadow-sm">
                  <div className="px-4 py-3 flex flex-col gap-1">
                    {navItems.map((item) => (
                      <a 
                        key={item.href}
                        href={item.href} 
                        onClick={(e) => {
                          handleNavClick(e, item.sectionId);
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-serif text-ink/60 hover:text-ink hover:bg-ink/5 px-3 py-2.5 rounded-md transition duration-200 font-medium"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </nav>
              </>
            )}
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

