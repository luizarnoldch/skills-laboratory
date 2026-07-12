"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "lucide-react"

const ProductListError = ({ error, resetErrorBoundary }: {
  error?: Error
  resetErrorBoundary?: () => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <AlertTriangleIcon className="size-12 text-destructive" />
      <div className="text-center">
        <p className="text-lg font-medium">Failed to load products</p>
        <p className="text-sm text-muted-foreground">
          Something went wrong while fetching the product list.
        </p>
      </div>
      {resetErrorBoundary && (
        <Button variant="outline" onClick={resetErrorBoundary}>
          Try again
        </Button>
      )}
    </div>
  )
}

export default ProductListError
