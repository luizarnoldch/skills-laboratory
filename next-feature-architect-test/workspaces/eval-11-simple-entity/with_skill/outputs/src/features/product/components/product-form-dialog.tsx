"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useCreateProduct from "@/features/product/hooks/useCreateProduct"
import useUpdateProduct from "@/features/product/hooks/useUpdateProduct"
import type { Product } from "@/features/product/schemas/product.schema"
import { useField, useForm } from "@tanstack/react-form"
import { createProductSchema, updateProductSchema } from "@/features/product/schemas/product.schema"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

export const ProductFormDialog = ({ open, onOpenChange, product }: ProductFormDialogProps) => {
  const isEdit = !!product

  const onSuccess = () => onOpenChange(false)

  const create = useCreateProduct({ onSuccess })
  const update = useUpdateProduct({ product: product!, onSuccess })

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? null,
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      ...(isEdit ? { id: product.id } : {}),
    },
    validators: {
      onChange: isEdit ? updateProductSchema : createProductSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await update.mutateAsync(value as any)
      } else {
        await create.mutateAsync(value as any)
      }
    },
  })

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the product details below." : "Fill in the details to create a new product."}
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
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Product name"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || null)}
                  placeholder="Product description (optional)"
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Price</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="stock">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Stock</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
