import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductView from "@/features/product/views/ProductView"

const ProductsPage = () => (
  <HydrateProducts>
    <ProductView />
  </HydrateProducts>
)

export default ProductsPage
