"use client"

import { useState } from "react"
import { PlusIcon, PackageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import useListProducts from "../hooks/useListProducts"
import ProductTable from "../components/ProductTable"
import ProductCreateDialog from "../components/ProductCreateDialog"
import ProductUpdateDialog from "../components/ProductUpdateDialog"
import ProductDeleteDialog from "../components/ProductDeleteDialog"
import type { Product } from "../schemas/product.schema"

const ProductsView = () => {
  const { products, isLoading } = useListProducts()
  const [createOpen, setCreateOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Products
        </h1>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyContent>
            <EmptyTitle>No products yet</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first product.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <Card>
          <CardContent>
            <ProductTable
              products={products}
              onEdit={setEditProduct}
              onDelete={setDeleteProduct}
            />
          </CardContent>
        </Card>
      )}

      <ProductCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProductUpdateDialog
        open={!!editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(null)
        }}
        product={editProduct}
      />
      <ProductDeleteDialog
        open={!!deleteProduct}
        onOpenChange={(open) => {
          if (!open) setDeleteProduct(null)
        }}
        product={deleteProduct}
      />
    </div>
  )
}

export default ProductsView
