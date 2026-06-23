"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductForm } from "../base/product-form"
import useCreateProduct from "../../hooks/useCreateProduct"

type CreateProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const { form: _form, ...mutation } = useCreateProduct({
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Add a new product to your catalog.</DialogDescription>
        </DialogHeader>
        <ProductForm
          mode="create"
          defaultValues={{ name: "", description: null, price: 0, stock: 0 }}
          onSubmit={async (value) => {
            await mutation.mutateAsync(value)
          }}
        >
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </ProductForm>
      </DialogContent>
    </Dialog>
  )
}

export { CreateProductDialog }
