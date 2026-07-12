interface ProductActionsProps {
  className?: string
}

export function ProductActions({ className }: ProductActionsProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="border-2 border-dashed border-gray-400 rounded h-8 w-8 flex items-center justify-center text-xs text-gray-400 font-mono">
        [Edit]
      </div>
      <div className="border-2 border-dashed border-gray-400 rounded h-8 w-8 flex items-center justify-center text-xs text-gray-400 font-mono">
        [Delete]
      </div>
    </div>
  )
}