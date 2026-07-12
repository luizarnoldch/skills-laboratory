"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ProductCreateDialogFieldsProps = {
  form: any
}

const ProductCreateDialogFields = ({ form }: ProductCreateDialogFieldsProps) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="create-product-name">Name</Label>
        <Input
          id="create-product-name"
          placeholder="Product name"
          value={form.state.values.name ?? ""}
          onChange={(e) => form.setFieldValue("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="create-product-description">Description</Label>
        <Textarea
          id="create-product-description"
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
        <Label htmlFor="create-product-price">Price</Label>
        <Input
          id="create-product-price"
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
        <Label htmlFor="create-product-stock">Stock</Label>
        <Input
          id="create-product-stock"
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

export default ProductCreateDialogFields
