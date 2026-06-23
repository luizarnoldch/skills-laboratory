import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductList from "../components/ProductList"
import ProductListError from "../components/error/ProductListError"
import ProductListLoader from "../components/loaders/ProductListLoader"

const ProductsView = () => {
  return (
    <HydrateProducts>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <ErrorBoundary fallback={<ProductListError />}>
            <Suspense fallback={<ProductListLoader />}>
              <ProductList />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateProducts>
  )
}

export default ProductsView
