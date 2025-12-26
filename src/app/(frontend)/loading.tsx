import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Skeleton Header */}
      <div className="space-y-4 mb-10 text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* Skeleton Filter Bar */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Skeleton Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-zinc-200">
            {/* Gambar */}
            <CardHeader className="p-0">
              <Skeleton className="aspect-3/4 w-full rounded-none" />
            </CardHeader>
            {/* Teks */}
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
            {/* Tombol */}
            <CardFooter className="p-5 pt-0">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
