"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import useDeleteProduct from "../hooks/useDeleteProduct"
import type { Product } from "../schemas/product.schema"

type ProductDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

const ProductDeleteDialog = ({ open, onOpenChange, product }: ProductDeleteDialogProps) => {
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
            Are you sure you want to delete{" "}
            <strong>{product.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending && <Spinner className="mr-1" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProductDeleteDialog
