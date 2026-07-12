import { Skeleton } from "@/components/ui/skeleton"

const ProductFormLoader = () => {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

export default ProductFormLoader
