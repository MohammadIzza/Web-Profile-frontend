import { Separator } from '@/components/ui/separator';
import { Mail, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile | null;
  loading: boolean;
}

export default function HeroSection({ profile, loading }: HeroSectionProps) {
  if (loading) {
    return (
      <section className="border-b border-line py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-64 mx-auto bg-line/30" />
            <Skeleton className="h-5 w-32 mx-auto bg-line/30" />
            <Skeleton className="h-4 w-48 mx-auto bg-line/30" />
            <Skeleton className="h-16 w-full max-w-xl mx-auto bg-line/30" />
          </div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="border-b border-line py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          {/* Name */}
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-ink mb-2">
            {profile.name}
          </h1>
          
          {/* Title */}
          {profile.title && (
            <p className="text-sm md:text-base text-ink/70 mb-4 font-serif">
              {profile.title}
            </p>
          )}
          
          {/* Separator */}
          <Separator className="my-4 max-w-xs mx-auto bg-line" />
          
          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-ink/80 max-w-xl mx-auto mb-6 leading-relaxed font-serif">
              {profile.bio}
            </p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-ink/60 font-serif">
            {profile.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span className="break-all text-center">{profile.email}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

