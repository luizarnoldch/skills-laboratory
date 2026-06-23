"use client"

import type { ReactNode } from "react"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { CreateProductInput, UpdateProductInput } from "../../schemas/product.schema"
import { createProductSchema, updateProductSchema } from "../../schemas/product.schema"

type ProductFormProps = {
  mode: "create" | "update"
  defaultValues: CreateProductInput | UpdateProductInput
  onSubmit: (value: any) => Promise<void>
  children?: ReactNode
}

function ProductForm({ mode, defaultValues, onSubmit, children }: ProductFormProps) {
  const schema = mode === "create" ? createProductSchema : updateProductSchema

  const form = useForm({
    defaultValues: defaultValues as any,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      if (mode === "create") {
        form.reset()
      }
    },
  })

  return (
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors?.length ? (
              <p className="text-xs text-destructive">
                {field.state.meta.errors[0]?.message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value || null)}
            />
            {field.state.meta.errors?.length ? (
              <p className="text-xs text-destructive">
                {field.state.meta.errors[0]?.message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="price">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Price</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.errors?.length ? (
              <p className="text-xs text-destructive">
                {field.state.meta.errors[0]?.message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="stock">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Stock</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="1"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.errors?.length ? (
              <p className="text-xs text-destructive">
                {field.state.meta.errors[0]?.message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {children}
    </form>
  )
}

export { ProductForm }
