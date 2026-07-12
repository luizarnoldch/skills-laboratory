"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import useCreateProduct from "../hooks/useCreateProduct"

type ProductCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProductCreateDialog = ({ open, onOpenChange }: ProductCreateDialogProps) => {
  const { form, isPending } = useCreateProduct({
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your catalog.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Product name"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value || null)}
                  onBlur={field.handleBlur}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Price</Label>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="0.00"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="stock">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Stock</Label>
                  <Input
                    id={field.name}
                    type="number"
                    step="1"
                    min="0"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="0"
                  />
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-1" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductCreateDialog
