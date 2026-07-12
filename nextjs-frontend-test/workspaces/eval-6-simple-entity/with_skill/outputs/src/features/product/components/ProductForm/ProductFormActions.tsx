interface ProductFormActionsProps {
  className?: string
}

export function ProductFormActions({ className }: ProductFormActionsProps) {
  return (
    <div className={`flex flex-col gap-2 w-full md:flex-row md:justify-end ${className ?? ""}`}>
      <div className="border-2 border-dashed border-gray-400 rounded h-9 w-full md:w-24 flex items-center justify-center text-xs text-gray-400 font-mono">
        [Cancel]
      </div>
      <div className="border-2 border-dashed border-gray-400 rounded h-9 w-full md:w-24 flex items-center justify-center text-xs text-gray-400 font-mono">
        [Submit]
      </div>
    </div>
  )
}