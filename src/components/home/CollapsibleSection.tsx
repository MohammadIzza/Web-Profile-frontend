import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SVGProps } from 'react';

interface CollapsibleSectionProps {
  id: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  loading?: boolean;
}

export default function CollapsibleSection({
  id,
  icon: Icon,
  title,
  description,
  isExpanded,
  onToggle,
  children,
  loading = false,
}: CollapsibleSectionProps) {
  return (
    <section id={id} className="border-b border-line">
      <button
        onClick={onToggle}
        className="w-full py-4 hover:brightness-95 transition duration-200 group"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-ink" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-ink font-serif">{title}</h3>
              <p className="text-xs text-ink/60">{description}</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-ink/40 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
          {loading ? (
            <div className="py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-line rounded w-3/4"></div>
                <div className="h-4 bg-line rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  );
}

