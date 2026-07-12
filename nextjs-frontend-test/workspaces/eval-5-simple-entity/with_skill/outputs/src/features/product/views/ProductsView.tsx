import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import HydrateProducts from "../../hooks/HydrateProducts"
import { ProductList } from "../components/ProductList"
import { ProductListError } from "../components/errors/ProductListError"
import { ProductListLoader } from "../components/loaders/ProductListLoader"

interface ProductsViewProps {
  className?: string
}

export default function ProductsView({ className }: ProductsViewProps) {
  return (
    <HydrateProducts>
      <div className={`flex flex-col gap-6 w-full ${className ?? ''}`}>
        <ErrorBoundary fallback={<ProductListError />}>
          <Suspense fallback={<ProductListLoader />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateProducts>
  )
}
