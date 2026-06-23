"use client"
import useDeleteProduct from "../../hooks/useDeleteProduct"
import type { Product } from "../../schemas/product.schema"

type ProductDeleteDialogProps = { product: Product; onClose: () => void }

const ProductDeleteDialog = ({ product, onClose }: ProductDeleteDialogProps) => {
  const { mutate, isPending } = useDeleteProduct({ productId: product.id })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">Delete Product</h3>
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => mutate(undefined, { onSuccess: onClose })}
            disabled={isPending}
            className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDeleteDialog
