import { FileX, Package, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'portfolio' | 'blog' | 'general';
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const config = {
    portfolio: {
      icon: Package,
      title: 'No Projects Yet',
      description: message || 'No portfolio projects to display at the moment.',
    },
    blog: {
      icon: BookOpen,
      title: 'No Blog Posts',
      description: message || 'No blog posts have been published yet.',
    },
    general: {
      icon: FileX,
      title: 'No Data',
      description: message || 'No data to display.',
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      <div className="bg-gray-100 rounded-full p-3 mb-2">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 text-center max-w-md">{description}</p>
    </div>
  );
}
