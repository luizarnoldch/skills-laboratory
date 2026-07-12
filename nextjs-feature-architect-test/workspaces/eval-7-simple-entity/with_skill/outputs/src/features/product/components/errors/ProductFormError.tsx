const ProductFormError = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-destructive font-medium">Something went wrong</p>
      <p className="text-muted-foreground text-sm mt-1">Please refresh and try again.</p>
    </div>
  )
}

export default ProductFormError
