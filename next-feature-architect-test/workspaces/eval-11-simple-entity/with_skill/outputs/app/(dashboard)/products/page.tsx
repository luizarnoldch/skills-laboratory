import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductListView from "@/features/product/views/product-list-view"

const ProductsPage = () => {
  return (
    <HydrateProducts>
      <ProductListView />
    </HydrateProducts>
  )
}

export default ProductsPage
