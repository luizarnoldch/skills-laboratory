interface ProductListHeaderProps {
  className?: string
}

export function ProductListHeader({ className }: ProductListHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${className ?? ''}`}>
      <div>
        <h2 className="text-lg font-semibold">Products</h2>
        <p className="text-sm text-muted-foreground">Manage your product catalog</p>
      </div>
    </div>
  )
}
