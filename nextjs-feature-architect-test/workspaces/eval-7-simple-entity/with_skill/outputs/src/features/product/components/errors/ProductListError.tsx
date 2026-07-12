const ProductListError = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-destructive font-medium">Failed to load products</p>
      <p className="text-muted-foreground text-sm mt-1">Please try again later.</p>
    </div>
  )
}

export default ProductListError
