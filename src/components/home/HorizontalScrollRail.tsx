import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollRailProps {
  children: ReactNode;
}

export default function HorizontalScrollRail({ children }: HorizontalScrollRailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const container = containerRef.current;
    const scroll = scrollRef.current;

    const getScrollWidth = () => {
      return scroll.scrollWidth - container.offsetWidth;
    };

    let scrollTrigger: ScrollTrigger | null = null;
    let updateTrigger: ScrollTrigger | null = null;

    // Wait for next frame to ensure layout is ready
    const timeoutId = setTimeout(() => {
      const scrollWidth = getScrollWidth();
      
      if (scrollWidth <= 0) return;

      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      });

      updateTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        onUpdate: (self) => {
          gsap.to(scroll, {
            x: -self.progress * scrollWidth,
            duration: 0.1,
            ease: 'none',
          });
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) scrollTrigger.kill();
      if (updateTrigger) updateTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [children]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div ref={scrollRef} className="flex gap-6 lg:gap-8 will-change-transform">
        {children}
      </div>
    </div>
  );
}

