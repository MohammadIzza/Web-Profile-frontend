import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { Profile } from '../../types';

interface FooterSectionProps {
  profile: Profile | null;
}

export default function FooterSection({ profile }: FooterSectionProps) {
  return (
    <footer id="contact" className="border-t border-line py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Links */}
          {profile && (
            <div className="flex justify-center gap-3">
              {profile.github && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-ink/5" asChild>
                      <a href={profile.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-ink/5" asChild>
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-ink/5" asChild>
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-ink/5" asChild>
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4" />
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
          
          {/* Copyright */}
          <div className="text-center sm:text-right">
            <p className="text-sm font-serif text-ink/50">
              © {new Date().getFullYear()} {profile?.name || 'Portfolio'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

