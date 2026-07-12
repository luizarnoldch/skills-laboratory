"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ArrowUpDown } from "lucide-react"

interface ProductFilterBarProps {
  className?: string
  defaultSearch?: string
  defaultSort?: "name" | "price" | "stock" | "createdAt"
}

export function ProductFilterBar({
  className,
  defaultSearch = "",
  defaultSort = "name",
}: ProductFilterBarProps) {
  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${className ?? ""}`}>
      <div className="relative w-full">
        <Label htmlFor="search" className="sr-only">
          Search products
        </Label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search products..."
          defaultValue={defaultSearch}
          className="pl-9"
          aria-label="Search products"
        />
      </div>
      <div className="w-full md:w-48">
        <Label htmlFor="sort" className="sr-only">
          Sort by
        </Label>
        <Select defaultValue={defaultSort} aria-label="Sort products">
          <SelectTrigger id="sort" className="w-full">
            <SelectValue placeholder="Sort by" />
            <ArrowUpDown className="ml-auto h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
            <SelectItem value="createdAt">Date Added</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}