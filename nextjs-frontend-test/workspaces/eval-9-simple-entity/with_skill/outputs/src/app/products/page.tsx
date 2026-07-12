import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductsView from "@/features/product/views/ProductsView"

const ProductsPage = () => {
  return (
    <HydrateProducts>
      <ProductsView />
    </HydrateProducts>
  )
}

export default ProductsPage
