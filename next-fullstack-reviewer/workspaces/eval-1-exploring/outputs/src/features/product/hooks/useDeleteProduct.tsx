// useDeleteProduct.tsx
"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type UseDeleteProductProps = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const useDeleteProduct = ({ onSuccess, onError }: UseDeleteProductProps = {}) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.product.delete.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.product.list.queryOptions())
      toast.success("Product deleted successfully")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Failed to delete product")
      onError?.(error)
    },
  })

  return {
    ...mutation,
  }
}

export default useDeleteProduct
