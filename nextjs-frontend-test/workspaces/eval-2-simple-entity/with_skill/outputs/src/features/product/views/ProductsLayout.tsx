import type { ReactNode } from "react"

type ProductsLayoutProps = {
  children: ReactNode
}

const ProductsLayout = ({ children }: ProductsLayoutProps) => {
  return <div className="flex flex-col gap-6 p-6">{children}</div>
}

export default ProductsLayout
