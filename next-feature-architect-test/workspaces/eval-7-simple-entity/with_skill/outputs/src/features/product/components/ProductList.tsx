"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import { Trash2, Pencil } from "lucide-react"
import useListProducts from "../hooks/useListProducts"
import useDeleteProduct from "../hooks/useDeleteProduct"
import type { Product } from "../schemas/product.schema"

type ProductListProps = {
  onEdit?: (product: Product) => void
}

const ProductList = ({ onEdit }: ProductListProps) => {
  const { products, isLoading, error } = useListProducts()

  if (error) throw error

  if (isLoading) return <ProductListSkeleton />

  if (products.length === 0) return <Empty message="No products found" />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  )
}

type ProductRowProps = {
  product: Product
  onEdit?: (product: Product) => void
}

const ProductRow = ({ product, onEdit }: ProductRowProps) => {
  const deleteMutation = useDeleteProduct({ productId: product.id })

  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="text-muted-foreground">{product.description ?? "—"}</TableCell>
      <TableCell>${product.price.toFixed(2)}</TableCell>
      <TableCell>
        <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(product)} aria-label="Edit product">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            aria-label="Delete product"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const ProductListSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
)

export default ProductList
