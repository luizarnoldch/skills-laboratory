"use client"

import type { Product } from "../schemas/product.schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PencilIcon, TrashIcon } from "lucide-react"

type ProductCardProps = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>
          {product.description ?? "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Price</span>
          <span className="text-right font-medium">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-muted-foreground">Stock</span>
          <span className="text-right font-medium">{product.stock}</span>
        </div>
      </CardContent>
      <CardContent className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.name}`}
        >
          <PencilIcon />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product)}
          aria-label={`Delete ${product.name}`}
        >
          <TrashIcon />
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProductCard
