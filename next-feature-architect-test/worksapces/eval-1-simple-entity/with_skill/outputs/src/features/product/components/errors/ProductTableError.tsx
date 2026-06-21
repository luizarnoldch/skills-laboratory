"use client"

import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type ProductTableErrorProps = {
  error?: Error
  resetErrorBoundary?: () => void
}

const ProductTableError = ({ error, resetErrorBoundary }: ProductTableErrorProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon />
        </EmptyMedia>
        <EmptyTitle>Failed to load products</EmptyTitle>
        <EmptyDescription>
          <EmptyContent>
            {error?.message ?? "An unexpected error occurred while loading products."}
          </EmptyContent>
        </EmptyDescription>
      </EmptyHeader>
      {resetErrorBoundary && (
        <Button variant="outline" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      )}
    </Empty>
  )
}

export default ProductTableError
