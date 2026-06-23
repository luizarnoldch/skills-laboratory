import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HydrateProducts from "@/features/product/hooks/HydrateProducts"
import ProductLayout from "./ProductLayout"

import ProductFilterBar from "../components/ProductFilterBar"
import ProductFilterBarError from "../components/errors/ProductFilterBarError"
import ProductFilterBarLoader from "../components/loaders/ProductFilterBarLoader"

import ProductList from "../components/ProductList"
import ProductListError from "../components/errors/ProductListError"
import ProductListLoader from "../components/loaders/ProductListLoader"

const ProductView = () => {
  return (
    <HydrateProducts>
      <ProductLayout>
        <ErrorBoundary fallback={<ProductFilterBarError />}>
          <Suspense fallback={<ProductFilterBarLoader />}>
            <ProductFilterBar />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ProductListError />}>
          <Suspense fallback={<ProductListLoader />}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </ProductLayout>
    </HydrateProducts>
  )
}

export default ProductView