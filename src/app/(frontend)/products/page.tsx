import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag01Icon,
  Search01Icon,
  FilterHorizontalIcon,
  WhatsappIcon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { SearchBar } from '@/components/ui/search-bar'

// Helper Format Rupiah
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const searchParamsValue = await searchParams
  const query = searchParamsValue?.search as string | undefined
  const sort = (searchParamsValue?.sort as string) || '-createdAt'

  const payload = await getPayload({ config })

  // Build where query
  const where: any = {}
  if (query) {
    where.or = [
      {
        name: {
          like: query,
        },
      },
      {
        description: {
          like: query,
        },
      },
    ]
  }

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 24,
    where,
    sort,
  })

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 lg:gap-3 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Icon icon={ShoppingBag01Icon} className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <span className="text-lg lg:text-2xl font-bold tracking-tight text-foreground">
              Griya<span className="text-primary">Kebaya</span>
            </span>
          </Link>

          {/* Search Bar */}
          <SearchBar />

          <Link href="/admin">
            <Button size="sm" className="font-semibold shadow-md hover:shadow-lg transition-all">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 pl-0 hover:bg-transparent hover:text-primary hover:translate-x-[-4px] transition-all"
          >
            <Link href="/">
              <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Kembali ke Beranda
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border/50 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
                {query ? `Hasil Pencarian: "${query}"` : 'Katalog Produk'}
              </h1>
              <p className="text-muted-foreground">
                {products.totalDocs} produk ditemukan {query ? 'untuk pencarian Anda' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.docs.map((product: any) => {
              // Image Handling (Copy from page.tsx logic)
              const mainImage = product.images?.[0]?.image
              let imageUrl = '/placeholder.jpg'

              if (typeof mainImage === 'object' && mainImage !== null) {
                const imageObj = mainImage as any
                if (imageObj.cloudinary_url) {
                  imageUrl = imageObj.cloudinary_url
                } else if (imageObj.sizes?.card?.url) {
                  imageUrl = imageObj.sizes.card.url
                } else if (imageObj.url) {
                  imageUrl = imageObj.url
                }
              }

              const isPreOrder = product.stockStatus === 'po'

              return (
                <div key={product.id} className="group relative">
                  {/* Image Container */}
                  <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-muted">
                    <Link href={`/products/${product.slug}`} className="block h-full w-full">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                      {typeof product.category === 'object' && product.category?.slug ? (
                        <Link
                          href={`/categories/${product.category.slug}`}
                          className="pointer-events-auto"
                        >
                          <Badge className="bg-white/80 backdrop-blur-md text-foreground hover:bg-white/90 hover:text-primary border-0 shadow-xs uppercase tracking-wider text-[10px] font-bold px-2 py-1 transition-colors">
                            {product.category.title}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge className="bg-white/80 backdrop-blur-md text-foreground border-0 shadow-xs uppercase tracking-wider text-[10px] font-bold px-2 py-1">
                          {typeof product.category === 'object' && product.category?.title
                            ? product.category.title
                            : 'Kebaya'}
                        </Badge>
                      )}
                      {isPreOrder && (
                        <Badge className="bg-black/80 backdrop-blur-md text-white border-0 shadow-xs uppercase tracking-wider text-[10px] font-bold px-2 py-1 w-fit">
                          Pre-Order
                        </Badge>
                      )}
                    </div>

                    {/* WhatsApp Button */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-white/95 hover:bg-white text-black font-semibold shadow-lg backdrop-blur-sm border-0 rounded-lg h-10 tracking-wide"
                      >
                        <Link
                          href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan ${product.name}, apakah masih tersedia?`}
                          target="_blank"
                        >
                          <Icon icon={WhatsappIcon} className="mr-2 h-4 w-4 text-green-600" />
                          Order via WhatsApp
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-1.5 px-1">
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block group-hover:text-primary transition-colors duration-300"
                      >
                        <h3 className="font-medium text-foreground text-base leading-snug tracking-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="font-bold text-primary shrink-0 text-base">
                        {formatRupiah(product.price)}
                      </span>
                    </div>
                    {product.material && (
                      <p className="text-xs text-muted-foreground capitalize font-medium tracking-wide">
                        {product.material.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
            <div className="p-4 bg-muted mb-4 rounded-full">
              <Icon icon={Search01Icon} className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian Anda via "{query}
              ".
            </p>
            <Button asChild variant="default">
              <Link href="/products">Lihat Semua Produk</Link>
            </Button>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border py-12 text-center mt-20">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Griya Kebaya Bali. Dibuat dengan bangga untuk UMKM Indonesia.
          </p>
        </div>
      </footer>
    </div>
  )
}
