import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  WhatsappIcon,
  ArrowLeft01Icon,
  ShoppingBag01Icon,
  Search01Icon,
  FilterHorizontalIcon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // 1. Cari Kategori dulu (untuk dapatkan ID & Nama Kategori)
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
  })

  if (!categoryResult.docs[0]) return notFound()

  const category = categoryResult.docs[0]

  // 2. Cari Produk yang punya kategori ini
  const products = await payload.find({
    collection: 'products',
    where: {
      category: { equals: category.id }, // Filter by ID Kategori
    },
    depth: 2,
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      {/* --- STANDARD NAVBAR --- */}
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

          <Link href="/admin">
            <Button size="sm" className="font-semibold shadow-md hover:shadow-lg transition-all">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header Kategori */}
        <div className="mb-10 lg:mb-12">
          <Button
            variant="ghost"
            asChild
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary hover:translate-x-[-4px] transition-all"
          >
            <Link href="/">
              <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Kembali ke Semua Koleksi
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border/50 pb-6">
            <div>
              <Badge
                variant="outline"
                className="mb-3 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider text-xs font-bold px-3 py-1"
              >
                Kategori
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {category.title}
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground font-medium">
              {products.totalDocs} produk ditemukan
            </p>
          </div>
        </div>

        {/* Grid Produk */}
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.docs.map((product: any) => {
              // Extract image logic - matching homepage
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
                  {/* Image Container - Full Bleed & Interactive */}
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

                      {/* Dark gradient overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                      {isPreOrder && (
                        <Badge className="bg-black/80 backdrop-blur-md text-white border-0 shadow-xs uppercase tracking-wider text-[10px] font-bold px-2 py-1 w-fit">
                          Pre-Order
                        </Badge>
                      )}
                    </div>

                    {/* Floating Action Button */}
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

                  {/* Product Details */}
                  <div className="mt-4 space-y-1.5 px-1">
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block group-hover:text-primary transition-colors duration-300"
                      >
                        <h3 className="font-medium text-foreground text-base leading-snug tracking-tight line-clamp-2">
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
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
            <div className="p-4 bg-muted mb-4 rounded-full">
              <Icon icon={ShoppingBag01Icon} className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Belum ada produk</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Maaf, belum ada koleksi yang tersedia untuk kategori ini. Silakan cek kategori lain.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Lihat Semua Koleksi</Link>
            </Button>
          </div>
        )}
      </div>

      {/* --- FOOTER SIMPLIFIED --- */}
      <footer className="bg-card border-t border-border py-12 text-center mt-20">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Griya Kebaya Bali. Dibuat dengan bangga untuk UMKM Indonesia.
          </p>
        </div>
      </footer>
    </div>
  )
}
