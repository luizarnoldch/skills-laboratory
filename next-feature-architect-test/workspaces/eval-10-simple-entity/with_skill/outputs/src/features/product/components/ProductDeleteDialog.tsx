"use client"

import useDeleteProduct from "../hooks/useDeleteProduct"

type ProductDeleteDialogProps = {
  productId: string
}

const ProductDeleteDialog = ({ productId }: ProductDeleteDialogProps) => {
  const { mutate, isPending } = useDeleteProduct({ productId })

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}

export default ProductDeleteDialog
