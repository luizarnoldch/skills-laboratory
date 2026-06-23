"use client"

import useUpdateProduct from "@/features/product/hooks/useUpdateProduct"
import type { Product } from "@/features/product/schemas/product.schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

type ProductUpdateFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

const ProductUpdateForm = ({
  open,
  onOpenChange,
  product,
}: ProductUpdateFormProps) => {
  if (!product) return null

  return <ProductUpdateFormInner open={open} onOpenChange={onOpenChange} product={product} />
}

const ProductUpdateFormInner = ({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}) => {
  const { form, isPending } = useUpdateProduct({
    product,
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="name">
            {(field) => (
              <Field orientation="vertical">
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <FieldContent>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Product name"
                    disabled={isPending}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </FieldContent>
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Field orientation="vertical">
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ""}
                    onChange={(e) =>
                      field.handleChange(e.target.value || null)
                    }
                    onBlur={field.handleBlur}
                    placeholder="Product description (optional)"
                    disabled={isPending}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </FieldContent>
              </Field>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <Field orientation="vertical">
                  <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseFloat(e.target.value) || 0)
                      }
                      onBlur={field.handleBlur}
                      placeholder="0.00"
                      disabled={isPending}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <form.Field name="stock">
              {(field) => (
                <Field orientation="vertical">
                  <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      type="number"
                      step="1"
                      min="0"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value, 10) || 0)
                      }
                      onBlur={field.handleBlur}
                      placeholder="0"
                      disabled={isPending}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </FieldContent>
                </Field>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductUpdateForm
