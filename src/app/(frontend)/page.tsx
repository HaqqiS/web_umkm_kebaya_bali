import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

// Import Shadcn UI
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Separator } from '@/components/ui/separator'

// Import Hugeicons
import {
  ShoppingBag01Icon,
  WhatsappIcon,
  ArrowRight01Icon,
  Search01Icon,
  FilterHorizontalIcon,
  SparklesIcon,
  StarIcon,
  TruckDeliveryIcon,
  CustomerService02Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Product } from '@/payload-types'

// Helper Format Rupiah
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export default async function Page() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 2, // Ambil URL gambar
    limit: 8, // Tampilkan 8 produk terbaru
    sort: '-createdAt',
  })
  // Instead of using Payload SDK (which transforms URLs), fetch via API
  // This gives us raw data without URL transformation
  // const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // const response = await fetch(`${baseUrl}/api/products?depth=2&limit=8&sort=-createdAt`, {
  //   next: { revalidate: 60 }, // Cache for 60 seconds
  // })

  // const products = await response.json()

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon icon={ShoppingBag01Icon} className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <span className="text-lg lg:text-2xl font-bold tracking-tight text-foreground">
              Griya<span className="text-primary">Kebaya</span>
            </span>
          </div>

          {/* Search Bar (Hidden di Mobile) */}
          <div className="hidden md:flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-xl w-full max-w-md border border-border/50 focus-within:border-primary/50 transition-colors">
            <Icon icon={Search01Icon} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari kebaya brokat, selendang..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>

          <Button size="sm" className="font-semibold shadow-md hover:shadow-lg transition-all">
            Login
          </Button>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 py-12 md:py-20 lg:py-28">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <Badge
              variant="outline"
              className="mb-4 lg:mb-6 border-primary/30 text-primary bg-primary/10 px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm uppercase tracking-wide font-semibold inline-flex items-center gap-2 hover:bg-primary/20 transition-colors"
            >
              <Icon icon={SparklesIcon} className="h-3 w-3 lg:h-4 lg:w-4" />
              Koleksi Terbaru 2024
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-4 lg:mb-6 leading-tight">
              Anggun & Bercahaya dengan <br className="hidden sm:block" />
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Kebaya Bali Asli
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm md:text-base lg:text-lg text-muted-foreground mb-8 lg:mb-10 leading-relaxed px-4">
              Temukan koleksi kebaya premium dengan bahan berkualitas tinggi dan jahitan rapi. Siap
              menemani momen spesial upacara maupun kondangan Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4 px-4">
              <Button
                size="lg"
                className="rounded-xl px-6 lg:px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all group"
              >
                Lihat Katalog
                <Icon
                  icon={ArrowRight01Icon}
                  className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 lg:px-8 border-2 hover:bg-accent/5"
              >
                Cara Pemesanan
              </Button>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="bg-card py-12 lg:py-16 border-y border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors group">
                <div className="p-4 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon={StarIcon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Kualitas Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Bahan pilihan dengan jahitan berkualitas tinggi
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors group">
                <div className="p-4 bg-accent/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon={TruckDeliveryIcon} className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Pengiriman Cepat</h3>
                <p className="text-sm text-muted-foreground">
                  Proses pesanan cepat dengan pengiriman ke seluruh Indonesia
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors group">
                <div className="p-4 bg-secondary/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon={CustomerService02Icon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Layanan Ramah</h3>
                <p className="text-sm text-muted-foreground">
                  Konsultasi gratis dan bantuan pemilihan produk
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* --- FILTER BAR --- */}
        <section className="bg-card py-0 lg:py-8 border-b border-border sticky top-16 lg:top-20 z-40 backdrop-blur-sm bg-card/95">
          <div className="container mx-auto px-4 lg:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-1">Produk Pilihan</h2>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {products.docs.length} produk tersedia
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-border">
              <Icon icon={FilterHorizontalIcon} className="mr-2 h-4 w-4" /> Filter & Urutkan
            </Button>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.docs.map((product: Product) => {
              // Extract image from the nested structure
              const mainImage = product.images?.[0]?.image

              // IMPORTANT: Use cloudinary_url field for direct Cloudinary access
              // Extract URL from the API response structure
              let imageUrl = '/placeholder.jpg'

              if (typeof mainImage === 'object' && mainImage !== null) {
                // Access cloudinary_url directly - TypeScript might not know about this field
                // but it exists in the API response
                const imageObj = mainImage as any

                if (imageObj.cloudinary_url) {
                  imageUrl = imageObj.cloudinary_url
                } else if (imageObj.sizes?.card?.url) {
                  // Fallback to card size if available
                  imageUrl = imageObj.sizes.card.url
                } else if (imageObj.url) {
                  // Last resort - use the main URL
                  imageUrl = imageObj.url
                }
              }

              return (
                <Card
                  key={product.id}
                  className="group border-border overflow-hidden hover:border-primary/40 hover:shadow-2xl transition-all duration-500 relative bg-card rounded-2xl"
                >
                  {/* Link Utama Produk - Wraps entire card for better UX */}
                  <Link href={`/products/${product.slug}`} className="block">
                    {/* Image Section - Larger and more prominent */}

                    <CardHeader className="p-0 relative">
                      <AspectRatio ratio={4 / 5}>
                        <div className="relative h-full w-full bg-muted overflow-hidden">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-95"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                          )}
                          {/* Subtle overlay for better text contrast */}
                          <div className="absolute inset-0 bg-linear-to-t from-foreground/20 via-transparent to-transparent"></div>

                          {/* Badge Kategori - Overlaid on image */}
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer shadow-lg backdrop-blur-md transition-all text-xs px-2.5 py-0.5 font-medium border-0">
                              {typeof product.category === 'object' && product.category?.title
                                ? product.category.title
                                : 'Kebaya'}
                            </Badge>
                          </div>
                        </div>
                      </AspectRatio>
                    </CardHeader>

                    {/* Content Section - Compact and minimal */}
                    <CardContent className="p-3.5 lg:p-4 space-y-2">
                      <h3 className="font-semibold text-sm lg:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-lg lg:text-xl font-bold text-primary">
                        {formatRupiah(product.price)}
                      </p>
                    </CardContent>
                  </Link>

                  {/* Footer dengan Tombol WA - Separated from link */}
                  <CardFooter className="p-3.5 lg:p-4 pt-0">
                    <Button
                      asChild
                      size="sm"
                      className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all group/btn text-xs lg:text-sm"
                    >
                      <Link
                        href={`https://wa.me/6281234567890?text=Halo, saya mau pesan ${product.name}`}
                        target="_blank"
                        // onClick={(e) => e.stopPropagation()}
                      >
                        <Icon
                          icon={WhatsappIcon}
                          className="mr-1.5 h-4 w-4 group-hover/btn:scale-110 transition-transform"
                        />
                        Pesan via WA
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Load More Button */}
          {products.docs.length >= 8 && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 border-2 hover:bg-accent/5"
              >
                Lihat Lebih Banyak
                <Icon icon={ArrowRight01Icon} className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-card border-t border-border py-12 lg:py-16 text-center">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon={ShoppingBag01Icon} className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Griya<span className="text-primary">Kebaya</span>
              </span>
            </div>

            {/* Description */}
            <p className="max-w-md text-sm text-muted-foreground">
              Menyediakan kebaya berkualitas tinggi untuk momen spesial Anda sejak 2020
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Icon icon={WhatsappIcon} className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="my-4 max-w-xs" />

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Griya Kebaya Bali. Dibuat dengan bangga untuk UMKM Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
