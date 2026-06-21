import type { ReactNode } from "react"

const ProductsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {children}
    </div>
  )
}

export default ProductsLayout
