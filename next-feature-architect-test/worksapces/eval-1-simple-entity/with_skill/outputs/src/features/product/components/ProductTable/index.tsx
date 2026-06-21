"use client"

import { useState } from "react"
import useSuspenseListProducts from "@/features/product/hooks/useSuspenseListProducts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import ProductTableHeader from "./ProductTableHeader"
import ProductEmptyState from "../ProductEmptyState"
import ProductCreateDialog from "../ProductCreateDialog"
import ProductUpdateDialog from "../ProductUpdateDialog"
import ProductDeleteDialog from "../ProductDeleteDialog"
import type { Product } from "@/features/product/schemas/product.schema"

const ProductTable = () => {
  const { products } = useSuspenseListProducts()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-medium">Products</h2>
        <Button onClick={() => setCreateOpen(true)}>Add Product</Button>
      </div>

      {products.length === 0 ? (
        <ProductEmptyState onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <Table>
          <ProductTableHeader />
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description ?? "—"}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setEditingProduct(product)}
                    >
                      <PencilIcon />
                      <span className="sr-only">Edit {product.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeletingProductId(product.id)}
                    >
                      <Trash2Icon />
                      <span className="sr-only">Delete {product.name}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProductCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <ProductUpdateDialog
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      <ProductDeleteDialog
        productId={deletingProductId}
        onClose={() => setDeletingProductId(null)}
      />
    </>
  )
}

export default ProductTable
