"use client"
import { Field } from "@tanstack/react-form"
import useUpdateProduct from "../../hooks/useUpdateProduct"
import type { Product } from "../../schemas/product.schema"

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
        <input type="hidden" {...form.getFieldProps("id")} />
        <Field name="name" children={(field) => (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Name *</label>
            <input
              {...field.getInputProps()}
              className="rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Product name"
            />
            {field.meta.errors.length > 0 && (
              <p className="text-xs text-red-600">{field.meta.errors[0]}</p>
            )}
          </div>
        )} />
        <Field name="description" children={(field) => (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...field.getInputProps()}
              className="rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Product description"
              rows={3}
            />
            {field.meta.errors.length > 0 && (
              <p className="text-xs text-red-600">{field.meta.errors[0]}</p>
            )}
          </div>
        )} />
        <Field name="price" children={(field) => (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...field.getInputProps()}
              className="rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
            {field.meta.errors.length > 0 && (
              <p className="text-xs text-red-600">{field.meta.errors[0]}</p>
            )}
          </div>
        )} />
        <Field name="stock" children={(field) => (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Stock</label>
            <input
              type="number"
              min="0"
              {...field.getInputProps()}
              className="rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
            />
            {field.meta.errors.length > 0 && (
              <p className="text-xs text-red-600">{field.meta.errors[0]}</p>
            )}
          </div>
        )} />
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
