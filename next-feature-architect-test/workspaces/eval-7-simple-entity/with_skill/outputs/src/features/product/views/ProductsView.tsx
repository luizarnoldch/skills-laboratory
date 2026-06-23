import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "../hooks/HydrateProducts"
import ProductList from "../components/ProductList"
import ProductListError from "../components/errors/ProductListError"
import ProductListLoader from "../components/loaders/ProductListLoader"

const ProductsView = () => {
  return (
    <HydrateProducts>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <ErrorBoundary fallback={<ProductListError />}>
          <Suspense fallback={<ProductListLoader />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateProducts>
  )
}

export default ProductsView
