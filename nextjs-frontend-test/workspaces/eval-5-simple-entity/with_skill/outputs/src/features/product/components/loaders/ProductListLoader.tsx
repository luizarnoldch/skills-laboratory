import { Skeleton } from "@/components/ui/skeleton"

export function ProductListLoader({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 w-full ${className ?? ''}`}>
      <Skeleton className="h-10 w-full animate-pulse" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full animate-pulse" />
      ))}
    </div>
  )
}
