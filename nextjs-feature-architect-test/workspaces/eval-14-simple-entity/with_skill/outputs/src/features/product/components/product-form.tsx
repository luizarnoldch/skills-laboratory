"use client"

import type { ReactFormApi } from "@tanstack/react-form"
import { useForm } from "@tanstack/react-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { CreateProductInput, UpdateProductInput, Product } from "../schemas/product.schema"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"

type ProductFormProps = {
  product?: Product
  onSubmit: (value: CreateProductInput | UpdateProductInput) => Promise<void>
  isPending: boolean
}

const ProductForm = ({ product, onSubmit, isPending }: ProductFormProps) => {
  const isEdit = !!product

  const form = useForm({
    defaultValues: {
      id: product?.id ?? "",
      name: product?.name ?? "",
      description: product?.description ?? null,
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
    } as CreateProductInput | UpdateProductInput,
    validators: {
      onChange: isEdit ? updateProductSchema : createProductSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Product name"
            />
          </div>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value || null)}
              placeholder="Product description (optional)"
            />
          </div>
        )}
      />

      <form.Field
        name="price"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Price</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          </div>
        )}
      />

      <form.Field
        name="stock"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Stock</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="1"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          </div>
        )}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Spinner />}
        {isEdit ? "Update Product" : "Create Product"}
      </Button>
    </form>
  )
}

export default ProductForm
