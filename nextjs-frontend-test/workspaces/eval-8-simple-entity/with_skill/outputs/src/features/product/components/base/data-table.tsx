"use client"

import type { ComponentProps, ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export type Column<T> = {
  header: string
  accessor: (item: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  emptyTitle?: string
  emptyDescription?: string
  keyExtractor: (item: T) => string
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  emptyTitle = "No items found",
  emptyDescription = "There are no items to display.",
  keyExtractor,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={keyExtractor(item)}
            className={cn(onRowClick && "cursor-pointer")}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((col) => (
              <TableCell key={col.header} className={col.className}>
                {col.accessor(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { DataTable }
