import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { PackageIcon } from "lucide-react"
import ProductCreateDialog from "./dialogs/ProductCreateDialog"

const ProductEmptyState = () => {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <PackageIcon className="size-8" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No products yet</EmptyTitle>
        <EmptyDescription>
          Get started by creating your first product.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ProductCreateDialog>
          <Button>Add Product</Button>
        </ProductCreateDialog>
      </EmptyContent>
    </Empty>
  )
}

export default ProductEmptyState
