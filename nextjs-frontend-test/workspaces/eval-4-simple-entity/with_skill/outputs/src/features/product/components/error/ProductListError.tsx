import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "lucide-react"

type ProductListErrorProps = {
  onRetry?: () => void
}

const ProductListError = ({ onRetry }: ProductListErrorProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
        <AlertCircleIcon className="size-8 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-destructive">Failed to load products</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while fetching the product catalog.
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductListError
