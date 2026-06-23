import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "../ProductActions/ProductActions"
import type { Product } from "@/features/product/schemas/product.schema"

interface ProductTableProps {
  products?: Product[]
  isLoading?: boolean
  className?: string
}

export function ProductTable({ products = [], isLoading = false, className }: ProductTableProps) {
  if (isLoading) {
    return (
      <div className={`overflow-x-auto ${className ?? ""}`}>
        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[120px]">Price</TableHead>
                <TableHead className="w-[100px]">Stock</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-4 bg-muted rounded w-3/4" /></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/2" /></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded w-1/3" /></TableCell>
                  <TableCell><div className="h-8 bg-muted rounded w-[160px]" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[120px]">Price</TableHead>
              <TableHead className="w-[100px]">Stock</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 10 ? "default" : "secondary"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProductActions productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}