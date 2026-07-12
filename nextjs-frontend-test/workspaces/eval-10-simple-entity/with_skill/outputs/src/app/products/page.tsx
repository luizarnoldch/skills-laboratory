import ProductView from "@/features/product/views/ProductView"

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  return (
    <ProductView />
  )
}

export default ProductsPage
