import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductsLayout from "./ProductsLayout"
import ProductTable from "../components/ProductTable"
import ProductTableError from "../components/errors/ProductTableError"
import ProductTableLoader from "../components/loaders/ProductTableLoader"

const ProductsView = () => {
  return (
    <HydrateProducts>
      <ProductsLayout>
        <ErrorBoundary fallback={<ProductTableError />}>
          <Suspense fallback={<ProductTableLoader />}>
            <ProductTable />
          </Suspense>
        </ErrorBoundary>
      </ProductsLayout>
    </HydrateProducts>
  )
}

export default ProductsView
