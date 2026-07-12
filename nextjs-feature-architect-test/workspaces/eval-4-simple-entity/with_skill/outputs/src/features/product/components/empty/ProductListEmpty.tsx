import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PackageOpenIcon } from "lucide-react"

type ProductListEmptyProps = {
  onCreate: () => void
}

const ProductListEmpty = ({ onCreate }: ProductListEmptyProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
        <PackageOpenIcon className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-foreground">No products yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first product.
          </p>
        </div>
        <Button size="sm" onClick={onCreate}>
          Create Product
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProductListEmpty
