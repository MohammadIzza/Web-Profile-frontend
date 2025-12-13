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
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </div>
  );
}
