"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type ProductUpdateDialogActionsProps = {
  isPending: boolean
}

const ProductUpdateDialogActions = ({ isPending }: ProductUpdateDialogActionsProps) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending && <Spinner />}
      {isPending ? "Saving..." : "Save Changes"}
    </Button>
  )
}

export default ProductUpdateDialogActions
