
'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="min-h-[70vh] flex items-center justify-center shadow-lg border-primary/10">
          <CardContent className="text-center py-16">
            <AlertCircle className="mx-auto h-16 w-16 text-destructive/60 mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              The chat encountered an unexpected error. Please try again.
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground/60 mb-6 font-mono max-w-md mx-auto truncate">
                {this.state.error.message}
              </p>
            )}
            <Button onClick={this.handleRetry} variant="default" size="lg">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
