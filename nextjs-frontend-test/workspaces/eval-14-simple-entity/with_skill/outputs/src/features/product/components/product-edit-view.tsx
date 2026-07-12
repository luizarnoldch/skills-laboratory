"use client"

import { useRouter } from "next/navigation"
import useListProducts from "../hooks/useListProducts"
import useUpdateProduct from "../hooks/useUpdateProduct"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductForm from "./product-form"
import type { Product } from "../schemas/product.schema"

type ProductEditViewProps = {
  productId: string
}

const ProductEditView = ({ productId }: ProductEditViewProps) => {
  const router = useRouter()
  const { products, isLoading } = useListProducts()
  const product = products.find((p) => p.id === productId)

  const { form, isPending } = useUpdateProduct({
    product: product as Product,
    onSuccess: () => router.push("/products"),
  })

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update the details for {product.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm
          product={product}
          onSubmit={(value) => form.handleSubmit()}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  )
}

export default ProductEditView
