import React from "react"

const ProductFilterBarError = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-4 text-red-500 border border-red-200 rounded-lg">
      <span>Failed to load filters</span>
    </div>
  )
}

export default ProductFilterBarError