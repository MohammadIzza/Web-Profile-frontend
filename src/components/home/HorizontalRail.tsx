import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { SVGProps } from 'react';

interface RailItem {
  id: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  content: ReactNode;
  loading?: boolean;
}

interface HorizontalRailProps {
  items: RailItem[];
  activeSection?: string | null;
  onSectionChange?: (sectionId: string | null) => void;
}

export default function HorizontalRail({ 
  items, 
  activeSection: controlledActiveSection,
  onSectionChange 
}: HorizontalRailProps) {
  const [internalActiveSection, setInternalActiveSection] = useState<string | null>(null);
  
  // Use controlled state if provided, otherwise use internal state
  const activeSection = controlledActiveSection !== undefined ? controlledActiveSection : internalActiveSection;
  const setActiveSection = onSectionChange || setInternalActiveSection;
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Handle wheel scroll - convert vertical to horizontal
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events when cursor is over the rail area
      const rect = container.getBoundingClientRect();
      const isOverRail = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right &&
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isOverRail) {
        e.preventDefault();
        e.stopPropagation();
        // Convert vertical scroll to horizontal
        container.scrollLeft += e.deltaY * 0.5; // 0.5 untuk smooth scroll
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Auto scroll to active section when opened
  useEffect(() => {
    if (activeSection && containerRef.current) {
      const itemElement = itemRefs.current.get(activeSection);
      if (itemElement) {
        // Delay untuk memastikan DOM sudah ready dan panel sudah terbuka
        setTimeout(() => {
          if (itemElement && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const itemRect = itemElement.getBoundingClientRect();
            const scrollLeft = containerRef.current.scrollLeft;
            const itemLeft = itemRect.left - containerRect.left + scrollLeft;
            const itemWidth = itemRect.width;
            const containerWidth = containerRef.current.offsetWidth;
            
            // Center the item in the container
            const targetScroll = itemLeft - (containerWidth / 2) + (itemWidth / 2);
            
            containerRef.current.scrollTo({
              left: targetScroll,
              behavior: 'smooth',
            });
          }
        }, 150);
      }
    }
  }, [activeSection]);

  const handleItemClick = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const setItemRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return (
    <>
      {/* Desktop: Horizontal Rail */}
      <div className="hidden lg:block">
        <div 
          ref={containerRef}
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div 
            ref={railRef}
            className="flex gap-0 min-w-max"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div
                  key={item.id}
                  ref={(el) => setItemRef(item.id, el)}
                  className="flex-shrink-0 border-r border-line last:border-r-0"
                >
                  {/* Rail Tab */}
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-40 px-4 py-6 flex flex-col items-center justify-center gap-2
                      border-b-2 transition-all duration-200
                      ${isActive 
                        ? 'border-b-ink bg-paper' 
                        : 'border-b-transparent bg-paper/50 hover:bg-paper/80'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink/40'
                    }`} />
                    <div className="text-center">
                      <h3 className={`text-xs font-serif font-semibold transition-colors duration-200 ${
                        isActive ? 'text-ink' : 'text-ink/60'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-[10px] mt-0.5 font-serif transition-colors duration-200 ${
                        isActive ? 'text-ink/60' : 'text-ink/40'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </button>

                  {/* Content Panel */}
                  {isActive && (
                    <div className="w-[800px] max-w-full border-t border-line bg-paper">
                      <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                        {item.loading ? (
                          <div className="py-8">
                            <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-line rounded w-3/4"></div>
                              <div className="h-4 bg-line rounded w-1/2"></div>
                            </div>
                          </div>
                        ) : (
                          item.content
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Vertical Accordion */}
      <div className="lg:hidden">
        <div className="space-y-0">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <div
                key={item.id}
                className="border-b border-line last:border-b-0"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full px-4 py-4 flex items-center justify-between gap-3
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-paper' 
                      : 'bg-paper/50 hover:bg-paper/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink/40'
                    }`} />
                    <div className="text-left">
                      <h3 className={`text-sm font-serif font-semibold transition-colors duration-200 ${
                        isActive ? 'text-ink' : 'text-ink/60'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs mt-0.5 font-serif transition-colors duration-200 ${
                        isActive ? 'text-ink/60' : 'text-ink/40'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 flex items-center justify-center transition-transform duration-200 ${
                    isActive ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-4 h-4 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Content Panel */}
                {isActive && (
                  <div className="border-t border-line bg-paper">
                    <div className="p-4 sm:p-6">
                      {item.loading ? (
                        <div className="py-8">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-line rounded w-3/4"></div>
                            <div className="h-4 bg-line rounded w-1/2"></div>
                          </div>
                        </div>
                      ) : (
                        item.content
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

