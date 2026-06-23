import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import ProductList from "../components/ProductList"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductViewLoader from "../components/loaders/ProductViewLoader"
import ProductViewError from "../components/error/ProductViewError"

const ProductView = () => {
  return (
    <HydrateProducts>
      <div className="container mx-auto p-6">
        <ErrorBoundary fallback={<ProductViewError />}>
          <Suspense fallback={<ProductViewLoader />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateProducts>
  )
}

export default ProductView
