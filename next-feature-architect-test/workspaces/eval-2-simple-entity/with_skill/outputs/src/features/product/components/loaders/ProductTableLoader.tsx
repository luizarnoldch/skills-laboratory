import { Skeleton } from "@/components/ui/skeleton"

const ProductTableLoader = () => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export default ProductTableLoader
