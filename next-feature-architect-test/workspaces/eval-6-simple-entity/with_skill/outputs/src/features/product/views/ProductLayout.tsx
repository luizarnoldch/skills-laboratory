import React from "react"

interface ProductLayoutProps {
  children: React.ReactNode
}

const ProductLayout = ({ children }: ProductLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {children}
    </div>
  )
}

export default ProductLayout