// useDeleteProduct.tsx
"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteProductSchema } from "../schemas/product.schema"

type UseDeleteProductProps = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const useDeleteProduct = ({ onSuccess, onError }: UseDeleteProductProps = {}) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (productId: string) => trpc.product.delete.mutate(deleteProductSchema.parse({ id: productId })),
    onSuccess: async (_, productId) => {
      await queryClient.invalidateQueries(trpc.product.list.queryOptions())
      await queryClient.invalidateQueries(trpc.product.get.queryOptions({ id: productId }))
      toast.success("Product deleted successfully")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Failed to delete product")
      onError?.(error)
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    ...mutation,
  }
}

export default useDeleteProduct
