import { cn } from "@/lib/utils";

export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-secondary/50 rounded-lg", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Shimmer className="aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-5 w-full" />
        <Shimmer className="h-5 w-3/4" />
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <Shimmer className="h-8 w-20" />
          <Shimmer className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <Shimmer className="w-12 h-12 rounded-xl mx-auto mb-3" />
      <Shimmer className="h-4 w-20 mx-auto" />
    </div>
  );
}
