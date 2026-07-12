"use client"

import { PlusIcon, Trash2Icon, PencilIcon, PackageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import useListProducts from "@/features/product/hooks/useListProducts"
import useDeleteProduct from "@/features/product/hooks/useDeleteProduct"
import { ProductFormDialog } from "./product-form-dialog"
import { useState } from "react"
import type { Product } from "@/features/product/schemas/product.schema"

const ProductListView = () => {
  const { products, isLoading } = useListProducts()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  if (isLoading) {
    return <ProductListSkeleton />
  }

  if (products.length === 0) {
    return (
      <>
        <ProductHeader onCreateClick={() => setCreateOpen(true)} />
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
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon />
            Create Product
          </Button>
        </Empty>
        <ProductFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      </>
    )
  }

  return (
    <>
      <ProductHeader onCreateClick={() => setCreateOpen(true)} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={() => setEditingProduct(product)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ProductFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProductFormDialog
        key={editingProduct?.id ?? "edit"}
        product={editingProduct ?? undefined}
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null)
        }}
      />
    </>
  )
}

const ProductHeader = ({ onCreateClick }: { onCreateClick: () => void }) => (
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your product catalog</CardDescription>
      </div>
      <Button onClick={onCreateClick}>
        <PlusIcon />
        Create Product
      </Button>
    </div>
  </CardHeader>
)

type ProductRowProps = {
  product: Product
  onEdit: () => void
}

const ProductRow = ({ product, onEdit }: ProductRowProps) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    productId: product.id,
  })

  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {product.description ?? "—"}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          ${product.price.toFixed(2)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={product.stock <= 0 ? "destructive" : "outline"}>
          {product.stock} units
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isDeleting}
            onClick={() => deleteProduct()}
          >
            <Trash2Icon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const ProductListSkeleton = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full" />
  </div>
)

export default ProductListView
