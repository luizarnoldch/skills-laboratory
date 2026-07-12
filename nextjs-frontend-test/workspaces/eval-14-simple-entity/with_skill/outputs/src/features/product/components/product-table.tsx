"use client"

import type { Product } from "../schemas/product.schema"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, TrashIcon } from "lucide-react"

type ProductTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <Badge variant="outline">
                ${product.price.toFixed(2)}
              </Badge>
            </TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(product)}
                >
                  <PencilIcon />
                  <span className="sr-only">Edit {product.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(product)}
                >
                  <TrashIcon />
                  <span className="sr-only">Delete {product.name}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProductTable
