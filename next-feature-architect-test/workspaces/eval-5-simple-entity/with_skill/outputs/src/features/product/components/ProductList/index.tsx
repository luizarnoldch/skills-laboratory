import { ProductListHeader } from "./ProductListHeader"
import { ProductListTable } from "./ProductListTable"
import type { Product } from "../../schemas/product.schema"

interface ProductListProps {
  products?: Product[]
  isLoading?: boolean
  error?: Error | null
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  className?: string
}

export function ProductList({
  products,
  isLoading,
  error,
  onEdit,
  onDelete,
  className,
}: ProductListProps) {
  return (
    <div className={`flex flex-col gap-4 w-full ${className ?? ''}`}>
      <ProductListHeader />
      <ProductListTable
        products={products}
        isLoading={isLoading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
