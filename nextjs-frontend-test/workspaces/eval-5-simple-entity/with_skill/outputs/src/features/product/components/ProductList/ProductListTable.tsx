import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "../../schemas/product.schema"

interface ProductListTableProps {
  products?: Product[]
  isLoading?: boolean
  error?: Error | null
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  className?: string
}

export function ProductListTable({ products, isLoading, error, onEdit, onDelete, className }: ProductListTableProps) {
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ''}`}>
        <p className="text-sm text-destructive">Failed to load products</p>
        <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-3 ${className ?? ''}`}>
        <Skeleton className="h-10 w-full animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full animate-pulse" />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ''}`}>
        <p className="text-sm text-muted-foreground">No products found</p>
        <p className="text-xs text-muted-foreground mt-1">Create your first product to get started.</p>
      </div>
    )
  }

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="text-xs text-destructive hover:text-destructive/80 underline-offset-2 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
