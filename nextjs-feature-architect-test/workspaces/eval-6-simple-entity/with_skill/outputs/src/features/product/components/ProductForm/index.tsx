import { ProductFormHeader } from "./ProductFormHeader"
import { ProductFormFields } from "./ProductFormFields"
import { ProductFormActions } from "./ProductFormActions"

interface ProductFormProps {
  className?: string
}

export function ProductForm({ className }: ProductFormProps) {
  return (
    <div className={`flex flex-col gap-4 w-full max-w-md ${className ?? ""}`}>
      <ProductFormHeader />
      <ProductFormFields />
      <ProductFormActions />
    </div>
  )
}