import ProductEditView from "@/features/product/components/product-edit-view"
import { notFound } from "next/navigation"

type EditProductPageProps = {
  params: Promise<{ id: string }>
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return <ProductEditView productId={id} />
}

export default EditProductPage
