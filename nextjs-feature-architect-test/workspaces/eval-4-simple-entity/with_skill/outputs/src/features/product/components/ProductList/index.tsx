"use client"

import { useState } from "react"
import useSuspenseListProducts from "@/features/product/hooks/useSuspenseListProducts"
import useDeleteProduct from "@/features/product/hooks/useDeleteProduct"
import type { Product } from "@/features/product/schemas/product.schema"
import ProductListHeader from "./ProductListHeader"
import ProductTable from "../ProductTable"
import ProductListEmpty from "../empty/ProductListEmpty"
import ProductCreateForm from "../ProductCreateForm"
import ProductUpdateForm from "../ProductUpdateForm"

const ProductList = () => {
  const { products } = useSuspenseListProducts()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteProduct = useDeleteProduct({
    productId: deletingId ?? "",
    onSuccess: () => setDeletingId(null),
    onError: () => setDeletingId(null),
  })

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  return (
    <div className="flex flex-col gap-4">
      <ProductListHeader onCreate={() => setIsCreateOpen(true)} />
      {products.length === 0 ? (
        <ProductListEmpty onCreate={() => setIsCreateOpen(true)} />
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeletingId={deletingId}
          isDeleting={deleteProduct.isPending}
        />
      )}
      <ProductCreateForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <ProductUpdateForm
        open={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null)
        }}
        product={editingProduct!}
      />
    </div>
  )
}

export default ProductList
