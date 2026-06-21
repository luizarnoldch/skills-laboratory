"use client"

import { useState } from "react"
import type { Product } from "../schemas/product.schema"
import useSuspenseListProducts from "../hooks/useSuspenseListProducts"
import ProductTable from "./ProductTable"
import ProductCard from "./ProductCard"
import ProductEmptyState from "./ProductEmptyState"
import ProductForm from "./ProductForm"
import ProductDeleteDialog from "./ProductDeleteDialog"

type ProductViewMode = "table" | "cards"

const ProductList = () => {
  const { products } = useSuspenseListProducts()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  if (products.length === 0) {
    return <ProductEmptyState onCreate={() => setIsCreateOpen(true)} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 active:translate-y-px"
        >
          Add product
        </button>
      </div>

      <div className="hidden lg:block">
        <ProductTable
          products={products}
          onEdit={setEditingProduct}
          onDelete={setDeletingProduct}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={setEditingProduct}
            onDelete={setDeletingProduct}
          />
        ))}
      </div>

      <ProductForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <ProductForm
        product={editingProduct}
        open={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null)
        }}
      />

      <ProductDeleteDialog
        product={deletingProduct}
        open={deletingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null)
        }}
      />
    </div>
  )
}

export default ProductList
