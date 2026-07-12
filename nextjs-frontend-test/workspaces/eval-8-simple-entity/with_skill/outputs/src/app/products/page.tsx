"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "@/features/product/components/views/product-list"
import { CreateProductDialog } from "@/features/product/components/views/create-product-dialog"
import { EditProductDialog } from "@/features/product/components/views/edit-product-dialog"
import { DeleteProductDialog } from "@/features/product/components/views/delete-product-dialog"
import type { Product } from "@/features/product/schemas/product.schema"

export default function ProductsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList
            onCreate={() => setCreateOpen(true)}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(product) => setDeletingProduct(product)}
          />
        </CardContent>
      </Card>

      <CreateProductDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditProductDialog
        product={editingProduct}
        open={!!editingProduct}
        onOpenChange={(open) => { if (!open) setEditingProduct(null) }}
      />
      <DeleteProductDialog
        product={deletingProduct}
        open={!!deletingProduct}
        onOpenChange={(open) => { if (!open) setDeletingProduct(null) }}
      />
    </div>
  )
}
