'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="py-24 max-w-md mx-auto text-center space-y-6 animate-fade-in">
      <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error?.message || 'An unexpected runtime error occurred while processing your request.'}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
