"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import useDeleteProduct from "../../hooks/useDeleteProduct"
import type { Product } from "../../schemas/product.schema"

type DeleteProductDialogProps = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const { mutate, isPending } = useDeleteProduct({
    productId: product?.id ?? "",
    onSuccess: () => onOpenChange(false),
  })

  if (!product) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              mutate()
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteProductDialog }
