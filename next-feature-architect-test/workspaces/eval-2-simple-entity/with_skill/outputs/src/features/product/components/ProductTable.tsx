"use client"

import useSuspenseListProducts from "../../hooks/useSuspenseListProducts"
import ProductEmptyState from "./ProductEmptyState"
import ProductEditDialog from "./dialogs/ProductEditDialog"
import ProductDeleteDialog from "./dialogs/ProductDeleteDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"

const ProductTable = () => {
  const { products } = useSuspenseListProducts()

  if (products.length === 0) {
    return <ProductEmptyState />
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {product.description ?? "-"}
              </TableCell>
              <TableCell className="text-right">
                ${product.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <ProductEditDialog product={product}>
                    <Button variant="ghost" size="icon-sm">
                      <PencilIcon className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </ProductEditDialog>
                  <ProductDeleteDialog productId={product.id}>
                    <Button variant="ghost" size="icon-sm">
                      <TrashIcon className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </ProductDeleteDialog>
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
