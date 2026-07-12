import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { AlertTriangleIcon } from "lucide-react"

const ProductTableError = () => {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <AlertTriangleIcon className="size-8 text-destructive" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Failed to load products</EmptyTitle>
        <EmptyDescription>
          Something went wrong. Please try again later.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default ProductTableError
