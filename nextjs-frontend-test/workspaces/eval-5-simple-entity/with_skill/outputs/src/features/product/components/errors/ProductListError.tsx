export function ProductListError({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ''}`}>
      <p className="text-sm text-destructive">Failed to load products</p>
      <p className="text-xs text-muted-foreground mt-1">Something went wrong. Please try again later.</p>
    </div>
  )
}
