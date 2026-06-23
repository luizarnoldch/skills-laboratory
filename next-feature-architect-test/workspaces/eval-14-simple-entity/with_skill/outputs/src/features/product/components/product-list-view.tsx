"use client"

import { useState } from "react"
import Link from "next/link"
import useListProducts from "../hooks/useListProducts"
import useDeleteProduct from "../hooks/useDeleteProduct"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { PackagePlusIcon, PackageIcon } from "lucide-react"
import ProductTable from "./product-table"
import ProductDeleteDialog from "./product-delete-dialog"
import type { Product } from "../schemas/product.schema"

const ProductListView = () => {
  const { products, isLoading } = useListProducts()
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const deleteProduct = useDeleteProduct({
    productId: productToDelete?.id ?? "",
    onSuccess: () => setProductToDelete(null),
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>No products yet</EmptyTitle>
          <EmptyDescription>
            Get started by creating your first product.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/products/new">
              <PackagePlusIcon />
              Create Product
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-xl font-medium">Products</h1>
        <Button asChild>
          <Link href="/products/new">
            <PackagePlusIcon />
            New Product
          </Link>
        </Button>
      </div>

      <ProductTable
        products={products}
        onEdit={(product) => {
          window.location.href = `/products/${product.id}/edit`
        }}
        onDelete={setProductToDelete}
      />

      <ProductDeleteDialog
        product={productToDelete}
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null)
        }}
        onConfirm={() => deleteProduct.mutate()}
        isPending={deleteProduct.isPending}
      />
    </div>
  )
}

export default ProductListView
