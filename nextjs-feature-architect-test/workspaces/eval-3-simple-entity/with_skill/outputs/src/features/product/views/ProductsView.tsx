import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductsLayout from "./ProductsLayout"
import ProductList from "../components/ProductList"
import ProductListError from "../components/errors/ProductListError"
import ProductListLoader from "../components/loaders/ProductListLoader"

const ProductsView = () => {
  return (
    <HydrateProducts>
      <ProductsLayout>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <ErrorBoundary fallback={<ProductListError />}>
          <Suspense fallback={<ProductListLoader />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </ProductsLayout>
    </HydrateProducts>
  )
}

export default ProductsView
