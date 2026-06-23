import React from "react"

const ProductListLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}

export default ProductListLoader