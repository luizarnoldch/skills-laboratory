"use client"

import { useRouter } from "next/navigation"
import useCreateProduct from "../hooks/useCreateProduct"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "./product-form"

const ProductCreateView = () => {
  const router = useRouter()
  const { form, isPending } = useCreateProduct({
    onSuccess: () => router.push("/products"),
  })

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Add a new product to your catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm
          onSubmit={(value) => form.handleSubmit()}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  )
}

export default ProductCreateView
