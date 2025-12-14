import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHorizontalScrollOptions {
  enabled?: boolean; // Only enable on desktop (lg breakpoint)
  pin?: boolean;
  scrub?: boolean | number;
  start?: string;
  end?: string | (() => string);
}

export function useHorizontalScroll(
  containerRef: React.RefObject<HTMLDivElement>,
  contentRef: React.RefObject<HTMLDivElement>,
  options: UseHorizontalScrollOptions = {}
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const { enabled = true, pin = true, scrub = true, start = 'top top', end } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Check if we're on desktop (lg breakpoint)
    const checkDesktop = () => window.innerWidth >= 1024;
    
    if (!checkDesktop()) {
      // On mobile, use native scroll
      return;
    }

    // Calculate the distance to scroll
    const getScrollDistance = () => {
      if (!content) return 0;
      return content.scrollWidth - container.offsetWidth;
    };

    // Create GSAP animation
    const animation = gsap.to(content, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: start,
        end: end || (() => `+=${getScrollDistance()}`),
        pin: pin,
        scrub: scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Ensure content stays within bounds
          if (self.progress === 1) {
            content.style.transform = `translateX(-${getScrollDistance()}px)`;
          }
        },
      },
    });

    scrollTriggerRef.current = animation.scrollTrigger as ScrollTrigger;

    // Handle resize
    const handleResize = () => {
      if (checkDesktop()) {
        ScrollTrigger.refresh();
      } else {
        // Kill ScrollTrigger on mobile
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
        // Reset transform
        gsap.set(content, { x: 0 });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      animation.kill();
    };
  }, [containerRef, contentRef, enabled, pin, scrub, start, end]);

  return scrollTriggerRef;
}

