import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductView from "@/features/product/views/ProductView"

type ProductsPageProps = {
  params: Promise<{ slugId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ProductsPage = async ({ params, searchParams }: ProductsPageProps) => {
  const { slugId } = await params
  const value = (await searchParams).key
  return (
    <HydrateProducts>
      <ProductView />
    </HydrateProducts>
  )
}

export default ProductsPage