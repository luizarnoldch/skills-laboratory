import React from "react"

const ProductListError = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-red-500 border border-red-200 rounded-lg">
      <span>Failed to load products</span>
    </div>
  )
}

export default ProductListError