"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useForm } from "@tanstack/react-form"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.schema"

type ProductFormProps = {
  form: ReturnType<typeof useForm<CreateProductInput>> | ReturnType<typeof useForm<UpdateProductInput>>
  isPending: boolean
  submitLabel: string
}

const ProductForm = ({ form, isPending, submitLabel }: ProductFormProps) => {
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
          <Field>
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
            )}
          </Field>
        )}
      />

      <form.Field
        name="description"
        children={(field: any) => (
          <Field>
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value || null)}
            />
          </Field>
        )}
      />

      <form.Field
        name="price"
        children={(field) => (
          <Field>
            <Label htmlFor={field.name}>Price</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
            )}
          </Field>
        )}
      />

      <form.Field
        name="stock"
        children={(field) => (
          <Field>
            <Label htmlFor={field.name}>Stock</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="1"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
            )}
          </Field>
        )}
      />

      <Button type="submit" disabled={isPending}>
        {isPending && <Spinner />}
        {submitLabel}
      </Button>
    </form>
  )
}

export default ProductForm
