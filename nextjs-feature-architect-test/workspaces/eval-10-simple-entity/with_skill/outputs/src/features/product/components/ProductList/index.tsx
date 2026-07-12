"use client"

import { useState } from "react"
import useSuspenseListProducts from "../../hooks/useSuspenseListProducts"
import ProductCreateDialog from "../ProductCreateDialog"
import ProductUpdateDialog from "../ProductUpdateDialog"
import ProductDeleteDialog from "../ProductDeleteDialog"

const ProductList = () => {
  const { products } = useSuspenseListProducts()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div>
      <button onClick={() => setShowCreate(!showCreate)}>
        {showCreate ? "Cancel" : "Create Product"}
      </button>

      {showCreate && <ProductCreateDialog />}

      {products.map((product) => (
        <div key={product.id}>
          <span>{product.id}</span>
          <span>{product.name}</span>
          <span>{product.price}</span>
          <span>{product.stock}</span>

          <button onClick={() => setEditingId(editingId === product.id ? null : product.id)}>
            {editingId === product.id ? "Cancel" : "Edit"}
          </button>

          {editingId === product.id && <ProductUpdateDialog product={product} />}

          <ProductDeleteDialog productId={product.id} />
        </div>
      ))}
    </div>
  )
}

export default ProductList
