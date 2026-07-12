"use client"

import { PenIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "../base/data-table"
import useListProducts from "../../hooks/useListProducts"
import type { Product } from "../../schemas/product.schema"

type ProductListProps = {
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onCreate: () => void
}

const columns: Column<Product>[] = [
  { header: "Name", accessor: (p) => p.name },
  { header: "Description", accessor: (p) => p.description ?? "—" },
  {
    header: "Price",
    accessor: (p) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(p.price),
  },
  { header: "Stock", accessor: (p) => <Badge variant="secondary">{p.stock}</Badge> },
  {
    header: "Actions",
    accessor: (p) => (
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(p)
          }}
        >
          <PenIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(p)
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    ),
    className: "w-[100px]",
  },
]

function ProductList({ onEdit, onDelete, onCreate }: ProductListProps) {
  const { products, isLoading, error } = useListProducts()

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading products...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center py-12 text-sm text-destructive">Failed to load products</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products ({products.length})</h2>
        <Button onClick={onCreate}>
          <PlusIcon />
          Add Product
        </Button>
      </div>
      <DataTable
        data={products}
        columns={columns}
        keyExtractor={(p) => p.id}
        emptyTitle="No products yet"
        emptyDescription="Get started by creating your first product."
      />
    </div>
  )
}

export { ProductList }
