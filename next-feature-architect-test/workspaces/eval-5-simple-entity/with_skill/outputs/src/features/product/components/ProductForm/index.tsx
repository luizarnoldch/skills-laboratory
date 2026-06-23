import { ProductFormHeader } from "./ProductFormHeader"
import { ProductFormFields } from "./ProductFormFields"
import { ProductFormActions } from "./ProductFormActions"

interface ProductFormProps {
  defaultValues?: {
    name?: string
    description?: string | null
    price?: number
    stock?: number
  }
  error?: Record<string, string[]>
  isLoading?: boolean
  isSubmitting?: boolean
  onCancel?: () => void
  className?: string
}

export function ProductForm({
  defaultValues,
  error,
  isLoading,
  isSubmitting,
  onCancel,
  className,
}: ProductFormProps) {
  return (
    <div
      className={`flex flex-col gap-4 w-full ${className ?? ''}`}
      aria-busy={isLoading}
    >
      <ProductFormHeader
        title={defaultValues?.name ? "Edit Product" : "New Product"}
        description={defaultValues?.name ? `Editing "${defaultValues.name}"` : "Create a new product in your catalog"}
      />
      <ProductFormFields
        defaultValues={defaultValues}
        error={error}
        isLoading={isLoading}
      />
      <ProductFormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </div>
  )
}
