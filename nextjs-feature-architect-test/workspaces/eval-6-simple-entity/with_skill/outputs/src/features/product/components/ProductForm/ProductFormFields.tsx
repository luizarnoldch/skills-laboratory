interface ProductFormFieldsProps {
  className?: string
}

export function ProductFormFields({ className }: ProductFormFieldsProps) {
  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {/* [Field: Name] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-2 w-full h-9 flex items-center px-3 text-xs text-gray-400 font-mono">
        [Input: name]
      </div>
      {/* [Field: Description] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-2 w-full h-20 flex items-center px-3 text-xs text-gray-400 font-mono">
        [Textarea: description]
      </div>
      {/* [Field: Price] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-2 w-full h-9 flex items-center px-3 text-xs text-gray-400 font-mono">
        [Input: price]
      </div>
      {/* [Field: Stock] */}
      <div className="border-2 border-dashed border-gray-400 rounded p-2 w-full h-9 flex items-center px-3 text-xs text-gray-400 font-mono">
        [Input: stock]
      </div>
    </div>
  )
}