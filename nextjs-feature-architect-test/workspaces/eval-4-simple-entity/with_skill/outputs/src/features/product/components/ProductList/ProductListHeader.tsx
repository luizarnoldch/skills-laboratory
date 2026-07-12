import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

type ProductListHeaderProps = {
  onCreate: () => void
}

const ProductListHeader = ({ onCreate }: ProductListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">All Products</h2>
        <p className="text-sm text-muted-foreground">
          Manage your product catalog
        </p>
      </div>
      <Button onClick={onCreate} size="sm">
        <PlusIcon className="size-4" />
        New Product
      </Button>
    </div>
  )
}

export default ProductListHeader
