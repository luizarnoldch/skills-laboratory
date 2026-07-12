interface ProductCardProps {
  className?: string
}

export function ProductCard({ className }: ProductCardProps) {
  return (
    <div className={`flex flex-col gap-3 p-4 border-2 border-dashed border-gray-400 rounded ${className ?? ""}`}>
      {/* [Card Header: Name] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-8 flex items-center text-xs text-gray-400 font-mono">
        [Heading: Product Name]
      </div>
      {/* [Card Body: Description] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-12 flex items-center text-xs text-gray-400 font-mono">
        [Text: Product description...]
      </div>
      {/* [Card Footer: Price & Stock] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-8 flex items-center justify-between text-xs text-gray-400 font-mono md:flex-row md:gap-4">
        <span>[Text: $10.00]</span>
        <span>[Text: Stock: 100]</span>
      </div>
      {/* [Card Actions] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-10 flex items-center justify-end gap-2 text-xs text-gray-400 font-mono">
        [Edit] [Delete]
      </div>
    </div>
  )
}