"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useUpdateProduct from "@/features/product/hooks/useUpdateProduct"
import ProductUpdateDialogFields from "./ProductUpdateDialogFields"
import ProductUpdateDialogActions from "./ProductUpdateDialogActions"
import type { Product } from "@/features/product/schemas/product.schema"

type ProductUpdateDialogProps = {
  product: Product | null
  onClose: () => void
}

const ProductUpdateDialog = ({ product, onClose }: ProductUpdateDialogProps) => {
  if (!product) return null

  return <ProductUpdateDialogInner product={product} onClose={onClose} />
}

const ProductUpdateDialogInner = ({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) => {
  const { form, isPending } = useUpdateProduct({
    product,
    onSuccess: () => onClose(),
  })

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details for {product.name}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="flex flex-col gap-4">
            <ProductUpdateDialogFields form={form as any} />
          </div>
          <DialogFooter>
            <ProductUpdateDialogActions isPending={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductUpdateDialog
