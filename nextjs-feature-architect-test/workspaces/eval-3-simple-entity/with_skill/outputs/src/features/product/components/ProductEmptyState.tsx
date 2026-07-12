import { PackageOpenIcon } from "lucide-react"

type ProductEmptyStateProps = {
  onCreate: () => void
}

const ProductEmptyState = ({ onCreate }: ProductEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <PackageOpenIcon className="size-12 text-muted-foreground" />
      <div className="text-center">
        <p className="text-lg font-medium">No products yet</p>
        <p className="text-sm text-muted-foreground">
          Get started by creating your first product.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 active:translate-y-px"
      >
        Create product
      </button>
    </div>
  )
}

export default ProductEmptyState
