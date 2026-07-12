interface ProductFormHeaderProps {
  className?: string
}

export function ProductFormHeader({ className }: ProductFormHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-8 flex items-center text-xs text-gray-400 font-mono">
        [Heading: Create Product]
      </div>
      <div className="border-2 border-dashed border-gray-400 rounded p-3 w-full h-6 flex items-center text-xs text-gray-400 font-mono">
        [Text: Fill in the details to add a new product]
      </div>
    </div>
  )
}