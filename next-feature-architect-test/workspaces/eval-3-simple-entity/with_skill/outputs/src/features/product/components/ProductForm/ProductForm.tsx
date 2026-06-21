"use client"

import useCreateProduct from "../../hooks/useCreateProduct"
import useUpdateProduct from "../../hooks/useUpdateProduct"
import type { Product } from "../../schemas/product.schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ProductFormFields from "./ProductFormFields"
import ProductFormActions from "./ProductFormActions"

type ProductFormProps = {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProductForm = ({ product, open, onOpenChange }: ProductFormProps) => {
  const isEditing = product !== undefined && product !== null

  const createForm = useCreateProduct({
    onSuccess: () => onOpenChange(false),
  })

  const updateForm = useUpdateProduct({
    product: product!,
    onSuccess: () => onOpenChange(false),
  })

  const activeForm = isEditing ? updateForm : createForm
  const { form } = activeForm

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit product" : "Create product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-4">
            <ProductFormFields form={form} />
          </div>

          <ProductFormActions
            isPending={activeForm.isPending}
            isEditing={isEditing}
            onCancel={handleCancel}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductForm
