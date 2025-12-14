import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface HorizontalScrollSectionProps {
  children: ReactNode;
  className?: string;
  enabled?: boolean; // Only enable on desktop (lg breakpoint)
}

export default function HorizontalScrollSection({ 
  children, 
  className = '',
  enabled = true 
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<any>(null);
  const animationRef = useRef<any>(null);
  const modulesRef = useRef<{
    gsap: typeof import('gsap');
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  } | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Check if we're on desktop (lg breakpoint)
    const checkDesktop = () => window.innerWidth >= 1024;
    
    if (!checkDesktop()) {
      // On mobile, use native scroll - don't initialize GSAP
      return;
    }

    // Lazy load GSAP only on desktop
    let isMounted = true;
    let resizeHandler: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const initGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerImport = await import('gsap/ScrollTrigger');
        const scrollTriggerModule = scrollTriggerImport.ScrollTrigger;
        
        if (!isMounted || !gsapModule || !scrollTriggerModule) return;

        // GSAP is exported as default, so we need to access it correctly
        const gsap = (gsapModule as any).default || gsapModule;

        // Store modules in ref for cleanup
        modulesRef.current = { 
          gsap: gsap as any, 
          ScrollTrigger: scrollTriggerModule 
        };

        // Register plugin
        gsap.registerPlugin(scrollTriggerModule);

        // Calculate the distance to scroll
        const getScrollDistance = () => {
          if (!content) return 0;
          return content.scrollWidth - container.offsetWidth;
        };

        // Only create animation if there's content to scroll
        const scrollDistance = getScrollDistance();
        if (scrollDistance <= 0) return;

        // Create GSAP animation
        const animation = gsap.to(content, {
          x: () => {
            const distance = getScrollDistance();
            return distance > 0 ? -distance : 0;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => {
              const distance = getScrollDistance();
              return distance > 0 ? `+=${distance}` : '+=100';
            },
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false, // Set to true for debugging
            pinSpacing: true,
          },
        });

        if (isMounted) {
          animationRef.current = animation;
          scrollTriggerRef.current = animation.scrollTrigger;
        } else {
          animation.kill();
          return;
        }

        // Handle resize
        resizeHandler = () => {
          if (!checkDesktop()) {
            // Kill ScrollTrigger on mobile
            if (scrollTriggerRef.current) {
              scrollTriggerRef.current.kill();
              scrollTriggerRef.current = null;
            }
            if (animationRef.current) {
              animationRef.current.kill();
              animationRef.current = null;
            }
            // Reset transform
            if (modulesRef.current && content) {
              (modulesRef.current.gsap as any).set(content, { x: 0, clearProps: 'transform' });
            }
          } else {
            // Refresh on desktop
            if (modulesRef.current) {
              modulesRef.current.ScrollTrigger.refresh();
            }
          }
        };

        window.addEventListener('resize', resizeHandler);
        
        // Refresh on content changes
        resizeObserver = new ResizeObserver(() => {
          if (checkDesktop() && isMounted && modulesRef.current) {
            modulesRef.current.ScrollTrigger.refresh();
          }
        });
        
        resizeObserver.observe(content);
      } catch (error) {
        console.warn('Failed to load GSAP:', error);
      }
    };

    initGSAP();

    return () => {
      isMounted = false;
      
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      
      modulesRef.current = null;
    };
  }, [enabled, children]);

  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-hidden ${className}`}
    >
      <div 
        ref={contentRef}
        className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max pb-4"
      >
        {children}
      </div>
    </div>
  );
}
