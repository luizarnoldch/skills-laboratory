import { PackageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type ProductEmptyStateProps = {
  onCreateClick: () => void
}

const ProductEmptyState = ({ onCreateClick }: ProductEmptyStateProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageIcon />
        </EmptyMedia>
        <EmptyTitle>No products yet</EmptyTitle>
        <EmptyDescription>
          <EmptyContent>
            Get started by adding your first product.
          </EmptyContent>
        </EmptyDescription>
      </EmptyHeader>
      <Button onClick={onCreateClick}>Add Product</Button>
    </Empty>
  )
}

export default ProductEmptyState
