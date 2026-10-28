import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="py-8 space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/70">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full md:w-80 rounded-lg" />
      </div>

      {/* Category pills skeleton */}
      <div className="flex items-center gap-2 overflow-hidden pb-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
        ))}
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-16 rounded mt-4" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-3 w-32 rounded" />
            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
