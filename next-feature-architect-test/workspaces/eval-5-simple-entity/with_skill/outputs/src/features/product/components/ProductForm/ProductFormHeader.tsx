interface ProductFormHeaderProps {
  title?: string
  description?: string
  className?: string
}

export function ProductFormHeader({ title = "Product", description, className }: ProductFormHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
