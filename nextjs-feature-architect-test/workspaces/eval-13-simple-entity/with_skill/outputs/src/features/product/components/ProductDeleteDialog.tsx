"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import useDeleteProduct from "../../hooks/useDeleteProduct"

type ProductDeleteDialogProps = {
  productId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ProductDeleteDialog = ({ productId, open, onOpenChange }: ProductDeleteDialogProps) => {
  const { mutate, isPending } = useDeleteProduct({
    productId,
    onSuccess: () => onOpenChange?.(false),
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProductDeleteDialog