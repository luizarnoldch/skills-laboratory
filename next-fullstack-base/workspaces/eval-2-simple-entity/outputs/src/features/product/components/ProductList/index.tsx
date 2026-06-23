"use client"
import { useState } from "react"
import useSuspenseListProducts from "../../hooks/useSuspenseListProducts"
import type { Product } from "../../schemas/product.schema"
import ProductCreateDialog from "../ProductCreateDialog"
import ProductUpdateDialog from "../ProductUpdateDialog"
import ProductDeleteDialog from "../ProductDeleteDialog"

const ProductList = () => {
  const { products } = useSuspenseListProducts()
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{products.length} products</span>
        <button
          onClick={() => { setShowCreate(true); setEditing(null) }}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Create Product
        </button>
      </div>

      {showCreate && <ProductCreateDialog onClose={() => setShowCreate(false)} />}
      {editing && <ProductUpdateDialog product={editing} onClose={() => setEditing(null)} />}
      {deleting && <ProductDeleteDialog product={deleting} onClose={() => setDeleting(null)} />}

      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No products found.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Description</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Price</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Stock</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">ID</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{product.name}</td>
                <td className="max-w-xs truncate px-3 py-2 text-gray-500">{product.description ?? "—"}</td>
                <td className="px-3 py-2 text-right">${product.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{product.stock}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-400">{product.id}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setEditing(product); setShowCreate(false) }}
                      className="text-xs text-blue-600 underline hover:no-underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(product)}
                      className="text-xs text-red-600 underline hover:no-underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProductList
