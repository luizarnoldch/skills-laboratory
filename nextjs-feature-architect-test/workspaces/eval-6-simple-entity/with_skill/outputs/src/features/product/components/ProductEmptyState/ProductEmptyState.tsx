import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

interface ProductEmptyStateProps {
  className?: string
  onCreateClick?: () => void
}

export function ProductEmptyState({ className, onCreateClick }: ProductEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg ${className ?? ""}`}>
      <Package className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
      <div>
        <p className="text-lg font-medium text-foreground">No products found</p>
        <p className="text-sm mt-1">Get started by creating your first product.</p>
      </div>
      <Button onClick={onCreateClick} size="default">
        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
        Create Product
      </Button>
    </div>
  )
}