import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductsLayout from "./ProductsLayout"
import ProductHeader from "../components/ProductHeader"
import ProductTable from "../components/ProductTable"
import ProductTableLoader from "../components/loaders/ProductTableLoader"
import ProductTableError from "../components/errors/ProductTableError"

const ProductsView = () => {
  return (
    <HydrateProducts>
      <ProductsLayout>
        <ProductHeader />
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
