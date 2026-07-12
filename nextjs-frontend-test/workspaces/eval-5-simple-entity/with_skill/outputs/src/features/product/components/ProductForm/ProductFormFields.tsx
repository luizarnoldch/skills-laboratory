import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductFormFieldsProps {
  defaultValues?: {
    name?: string
    description?: string | null
    price?: number
    stock?: number
  }
  error?: {
    name?: string[]
    description?: string[]
    price?: string[]
    stock?: string[]
  }
  isLoading?: boolean
  className?: string
}

export function ProductFormFields({ defaultValues, error, isLoading, className }: ProductFormFieldsProps) {
  return (
    <div className={`flex flex-col gap-4 w-full ${className ?? ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Name</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full animate-pulse" />
          ) : (
            <Input
              id="name"
              defaultValue={defaultValues?.name}
              aria-invalid={!!error?.name}
              aria-describedby={error?.name ? 'name-error' : undefined}
              className={error?.name ? 'border-destructive' : ''}
            />
          )}
          {error?.name && (
            <p id="name-error" role="alert" className="text-xs text-destructive">
              {error.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full animate-pulse" />
          ) : (
            <Input
              id="price"
              type="number"
              step="0.01"
              defaultValue={defaultValues?.price}
              aria-invalid={!!error?.price}
              aria-describedby={error?.price ? 'price-error' : undefined}
              className={error?.price ? 'border-destructive' : ''}
            />
          )}
          {error?.price && (
            <p id="price-error" role="alert" className="text-xs text-destructive">
              {error.price[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full animate-pulse" />
          ) : (
            <Input
              id="stock"
              type="number"
              step="1"
              defaultValue={defaultValues?.stock}
              aria-invalid={!!error?.stock}
              aria-describedby={error?.stock ? 'stock-error' : undefined}
              className={error?.stock ? 'border-destructive' : ''}
            />
          )}
          {error?.stock && (
            <p id="stock-error" role="alert" className="text-xs text-destructive">
              {error.stock[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          {isLoading ? (
            <Skeleton className="h-20 w-full animate-pulse" />
          ) : (
            <Textarea
              id="description"
              defaultValue={defaultValues?.description ?? ''}
              aria-invalid={!!error?.description}
              aria-describedby={error?.description ? 'description-error' : undefined}
              className={error?.description ? 'border-destructive' : ''}
              rows={3}
            />
          )}
          {error?.description && (
            <p id="description-error" role="alert" className="text-xs text-destructive">
              {error.description[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
