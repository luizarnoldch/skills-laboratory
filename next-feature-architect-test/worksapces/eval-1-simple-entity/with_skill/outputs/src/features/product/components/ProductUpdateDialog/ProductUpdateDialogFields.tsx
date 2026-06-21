"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ProductUpdateDialogFieldsProps = {
  form: any
}

const ProductUpdateDialogFields = ({ form }: ProductUpdateDialogFieldsProps) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="update-product-name">Name</Label>
        <Input
          id="update-product-name"
          placeholder="Product name"
          value={form.state.values.name ?? ""}
          onChange={(e) => form.setFieldValue("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="update-product-description">Description</Label>
        <Textarea
          id="update-product-description"
          placeholder="Product description (optional)"
          value={form.state.values.description ?? ""}
          onChange={(e) =>
            form.setFieldValue(
              "description",
              e.target.value === "" ? null : e.target.value
            )
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="update-product-price">Price</Label>
        <Input
          id="update-product-price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.state.values.price ?? 0}
          onChange={(e) =>
            form.setFieldValue("price", parseFloat(e.target.value) || 0)
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="update-product-stock">Stock</Label>
        <Input
          id="update-product-stock"
          type="number"
          step="1"
          placeholder="0"
          value={form.state.values.stock ?? 0}
          onChange={(e) =>
            form.setFieldValue("stock", parseInt(e.target.value, 10) || 0)
          }
        />
      </div>
    </>
  )
}

export default ProductUpdateDialogFields
