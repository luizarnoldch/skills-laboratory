"use client"
import { useForm } from "@tanstack/react-form"
import useUpdateProduct from "../hooks/useUpdateProduct"
import type { Product } from "../schemas/product.schema"

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
        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-1">
              <label htmlFor={field.name} className="text-sm font-medium">Name</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded border px-3 py-1.5 text-sm"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <div className="grid gap-1">
              <label htmlFor={field.name} className="text-sm font-medium">Description</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value || null)}
                className="rounded border px-3 py-1.5 text-sm"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />
        <form.Field
          name="price"
          children={(field) => (
            <div className="grid gap-1">
              <label htmlFor={field.name} className="text-sm font-medium">Price</label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="rounded border px-3 py-1.5 text-sm"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />
        <form.Field
          name="stock"
          children={(field) => (
            <div className="grid gap-1">
              <label htmlFor={field.name} className="text-sm font-medium">Stock</label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="rounded border px-3 py-1.5 text-sm"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600">{field.state.meta.errors.join(", ")}</p>
              )}
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
