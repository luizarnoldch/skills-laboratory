"use client"
import useUpdateProduct from "../../hooks/useUpdateProduct"
import type { Product } from "../../schemas/product.schema"
import { form } from "@tanstack/react-form"
import { Field } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ProductFormUpdateProps = { product: Product; onClose: () => void }

const ProductFormUpdate = ({ product, onClose }: ProductFormUpdateProps) => {
  const { form, isPending } = useUpdateProduct({ product, onSuccess: onClose })

  return (
    <div className="rounded border bg-gray-50 p-4">
      <h3 className="mb-3 font-semibold">Edit Product</h3>
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="grid gap-3"
      >
        <Field
          name="id"
          children={(field) => (
            <input type="hidden" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
          )}
        />
        <Field
          name="name"
          children={(field) => (
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Product name"
              />
            </div>
          )}
        />
        <Field
          name="description"
          children={(field) => (
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Product description"
              />
            </div>
          )}
        />
        <Field
          name="price"
          children={(field) => (
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          )}
        />
        <Field
          name="stock"
          children={(field) => (
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                step="1"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          )}
        />
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductFormUpdate