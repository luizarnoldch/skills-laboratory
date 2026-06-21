"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field"
import type { UseFormReturn } from "@tanstack/react-form"
import type { CreateProductInput, UpdateProductInput } from "../../schemas/product.schema"

type ProductFormFieldsProps = {
  form: UseFormReturn<CreateProductInput | UpdateProductInput>
}

const ProductFormFields = ({ form }: ProductFormFieldsProps) => {
  return (
    <form.Field
      name="name"
      // eslint-disable-next-line react/no-children-prop
      children={(field) => (
        <Field>
          <FieldLabel htmlFor={field.name}>
            <FieldTitle>Name</FieldTitle>
          </FieldLabel>
          <FieldContent>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Product name"
            />
            <FieldError errors={field.state.meta.errors} />
          </FieldContent>
        </Field>
      )}
    />
  )
}

export default ProductFormFields
