"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Product } from "@/features/product/schemas/product.schema"

type ProductTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isDeletingId: string | null
  isDeleting: boolean
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  isDeletingId,
  isDeleting,
}: ProductTableProps) => {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="max-w-48 truncate text-muted-foreground">
                {product.description ?? "—"}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.stock > 0 ? "default" : "destructive"}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting && isDeletingId === product.id ? (
                      <Spinner className="size-3" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable
