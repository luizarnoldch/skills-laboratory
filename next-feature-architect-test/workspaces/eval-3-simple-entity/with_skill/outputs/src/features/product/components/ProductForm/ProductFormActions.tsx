"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

type ProductFormActionsProps = {
  isPending: boolean
  isEditing: boolean
  onCancel: () => void
}

const ProductFormActions = ({
  isPending,
  isEditing,
  onCancel,
}: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2Icon className="size-4 animate-spin" />}
        {isEditing ? "Update" : "Create"}
      </Button>
    </div>
  )
}

export default ProductFormActions
