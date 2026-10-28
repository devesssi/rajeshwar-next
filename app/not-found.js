import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 max-w-md mx-auto text-center space-y-6 animate-fade-in">
      <div className="h-20 w-20 rounded-3xl bg-secondary/80 text-muted-foreground flex items-center justify-center mx-auto border border-border">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-foreground">Page Not Found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The hardware item or page you requested does not exist or may have been relocated.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="default" className="gap-2">
            <Home className="h-4 w-4" /> Go to Homepage
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
