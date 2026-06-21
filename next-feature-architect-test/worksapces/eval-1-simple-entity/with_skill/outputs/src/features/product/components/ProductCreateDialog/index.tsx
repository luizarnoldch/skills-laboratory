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
import useCreateProduct from "@/features/product/hooks/useCreateProduct"
import ProductCreateDialogFields from "./ProductCreateDialogFields"
import ProductCreateDialogActions from "./ProductCreateDialogActions"

type ProductCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProductCreateDialog = ({ open, onOpenChange }: ProductCreateDialogProps) => {
  const { form, isPending } = useCreateProduct({
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below.
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
            <ProductCreateDialogFields form={form as any} />
          </div>
          <DialogFooter>
            <ProductCreateDialogActions isPending={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductCreateDialog
