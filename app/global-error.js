'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold">System Error</h1>
            <p className="text-sm text-muted-foreground">
              A critical error occurred while rendering the application.
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={() => reset()} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
