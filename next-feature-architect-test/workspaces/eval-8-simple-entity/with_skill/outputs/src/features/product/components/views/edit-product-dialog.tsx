"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductForm } from "../base/product-form"
import useUpdateProduct from "../../hooks/useUpdateProduct"
import type { Product } from "../../schemas/product.schema"

type EditProductDialogProps = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const { form: _form, ...mutation } = useUpdateProduct({
    product: product!,
    onSuccess: () => onOpenChange(false),
  })

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the details of {product.name}.</DialogDescription>
        </DialogHeader>
        <ProductForm
          mode="update"
          defaultValues={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
          }}
          onSubmit={async (value) => {
            await mutation.mutateAsync(value)
          }}
        >
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </ProductForm>
      </DialogContent>
    </Dialog>
  )
}

export { EditProductDialog }
