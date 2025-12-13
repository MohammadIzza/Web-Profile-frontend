import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-8">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs text-gray-500 bg-gray-50 p-4 rounded mb-8 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
