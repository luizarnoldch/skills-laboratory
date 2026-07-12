import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import ProductList from "../components/ProductList"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"

const ProductView = () => {
  return (
    <HydrateProducts>
      <div className="container mx-auto p-6">
        <ErrorBoundary fallback={<div>Error loading products</div>}>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateProducts>
  )
}

export default ProductView