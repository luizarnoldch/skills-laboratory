"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type ProductCreateDialogActionsProps = {
  isPending: boolean
}

const ProductCreateDialogActions = ({ isPending }: ProductCreateDialogActionsProps) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending && <Spinner />}
      {isPending ? "Creating..." : "Create Product"}
    </Button>
  )
}

export default ProductCreateDialogActions
