"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useUpdateProduct from "../../hooks/useUpdateProduct"
import type { Product } from "../../schemas/product.schema"

type ProductUpdateDialogProps = {
  product: Product
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ProductUpdateDialog = ({ product, open, onOpenChange }: ProductUpdateDialogProps) => {
  const { form, isPending } = useUpdateProduct({
    product,
    onSuccess: () => onOpenChange?.(false),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm">Name</label>
              <form.Field name="name">
                {(field) => (
                  <input
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full border p-2"
                  />
                )}
              </form.Field>
            </div>
            <div>
              <label className="text-sm">Description</label>
              <form.Field name="description">
                {(field) => (
                  <input
                    name={field.name}
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full border p-2"
                  />
                )}
              </form.Field>
            </div>
            <div>
              <label className="text-sm">Price</label>
              <form.Field name="price">
                {(field) => (
                  <input
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full border p-2"
                  />
                )}
              </form.Field>
            </div>
            <div>
              <label className="text-sm">Stock</label>
              <form.Field name="stock">
                {(field) => (
                  <input
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full border p-2"
                  />
                )}
              </form.Field>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductUpdateDialog