import { ProductTable } from "./ProductTable"
import { ProductEmptyState } from "./ProductEmptyState"
import type { Product } from "@/features/product/schemas/product.schema"

interface ProductListProps {
  products?: Product[]
  isLoading?: boolean
  onCreateClick?: () => void
  className?: string
}

export function ProductList({ products = [], isLoading = false, onCreateClick, className }: ProductListProps) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <ProductTable products={products} isLoading={isLoading} />
      <ProductEmptyState onCreateClick={onCreateClick} />
    </div>
  )
}