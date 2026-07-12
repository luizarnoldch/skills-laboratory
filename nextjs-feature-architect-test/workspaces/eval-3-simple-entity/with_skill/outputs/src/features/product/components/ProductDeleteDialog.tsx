"use client"

import type { Product } from "../schemas/product.schema"
import useDeleteProduct from "../hooks/useDeleteProduct"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

type ProductDeleteDialogProps = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProductDeleteDialog = ({
  product,
  open,
  onOpenChange,
}: ProductDeleteDialogProps) => {
  const { mutateAsync, isPending } = useDeleteProduct({
    productId: product?.id ?? "",
    onSuccess: () => onOpenChange(false),
  })

  const handleDelete = async () => {
    if (!product) return
    await mutateAsync()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{product?.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDeleteDialog
