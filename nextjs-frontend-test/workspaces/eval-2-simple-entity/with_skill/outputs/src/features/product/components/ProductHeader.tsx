import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import ProductCreateDialog from "./dialogs/ProductCreateDialog"

const ProductHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Products
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your product catalog
        </p>
      </div>
      <ProductCreateDialog>
        <Button>
          <PlusIcon className="size-4" />
          Add Product
        </Button>
      </ProductCreateDialog>
    </div>
  )
}

export default ProductHeader
