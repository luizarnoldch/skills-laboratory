"use client"

import { useState } from "react"

import useSuspenseListProducts from "../../hooks/useSuspenseListProducts"
import ProductCreateDialog from "../ProductCreateDialog"
import ProductUpdateDialog from "../ProductUpdateDialog"
import ProductDeleteDialog from "../ProductDeleteDialog"
import type { Product } from "../../schemas/product.schema"

const ProductList = () => {
  const { products } = useSuspenseListProducts()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setIsCreateOpen(true)}>Create Product</button>
      </div>
      {products.map((product) => (
        <div key={product.id} className="border p-2 mb-2">
          <div>ID: {product.id}</div>
          <div>Name: {product.name}</div>
          <div>Description: {product.description}</div>
          <div>Price: {product.price}</div>
          <div>Stock: {product.stock}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditingProduct(product)}>Edit</button>
            <button onClick={() => setDeletingProductId(product.id)}>Delete</button>
          </div>
        </div>
      ))}
      <ProductCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {editingProduct && (
        <ProductUpdateDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
      {deletingProductId && (
        <ProductDeleteDialog
          productId={deletingProductId}
          open={!!deletingProductId}
          onOpenChange={(open) => !open && setDeletingProductId(null)}
        />
      )}
    </div>
  )
}

export default ProductList