"use client"
import useCreateProduct from "../../hooks/useCreateProduct"

type ProductFormCreateProps = { onClose: () => void }

const ProductFormCreate = ({ onClose }: ProductFormCreateProps) => {
  const { form, isPending } = useCreateProduct({ onSuccess: onClose })

  return (
    <div className="rounded border bg-gray-50 p-4">
      <h3 className="mb-3 font-semibold">Create Product</h3>
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="grid gap-3"
      >
        <form.Field name="name" render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...field} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        )} />
        <form.Field name="description" render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...field} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={3} />
          </div>
        )} />
        <form.Field name="price" render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input {...field} type="number" step="0.01" min="0" className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        )} />
        <form.Field name="stock" render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input {...field} type="number" min="0" className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
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
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductFormCreate
