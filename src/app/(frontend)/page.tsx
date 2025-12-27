import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

// Import Shadcn UI
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { AspectRatio } from '@/components/ui/aspect-ratio' // Removed
// import { Card, ... } // Removed
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

  // Fetch Categories
  const categories = await payload.find({
    collection: 'categories',
    limit: 4,
    sort: 'title',
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
            <Icon icon={Search01Icon} className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cari kebaya brokat, selendang..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>

          <Link href="/admin">
            <Button size="sm" className="font-semibold shadow-md hover:shadow-lg transition-all">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-accent/5 to-secondary/10 py-12 md:py-20 lg:py-28">
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
              Koleksi Terbaru 2025
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-4 lg:mb-6 leading-tight">
              Anggun & Bercahaya dengan <br className="hidden sm:block" />
              <span className=" bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
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

        {/* --- CATEGORIES SECTION --- */}
        <section className="py-12 lg:py-16 container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Kategori Pilihan</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold text-sm"
            >
              Lihat Semua
              <Icon icon={ArrowRight01Icon} className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {categories.docs.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-12/4 border border-border bg-muted/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10 ">
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      Lihat Koleksi &rarr;
                    </p>
                  </div>
                </div>
                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* --- FILTER BAR --- */}
        <section className="py-6 lg:py-4 border-b border-border sticky top-16 lg:top-20 z-40 backdrop-blur-sm bg-card/95">
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
            {products.docs.map((product: any) => {
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

                      {/* Dark gradient overlay on hover for better text readability if needed */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    {/* Floating Badges - Top Left */}
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

                    {/* Floating Action Button - Bottom Center (Apps on Hover) */}
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

                  {/* Product Details - Minimal & Elegant */}
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

                    {/* Optional: Material or Subtitle */}
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
