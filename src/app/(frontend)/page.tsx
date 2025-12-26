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

// Import Hugeicons (Pastikan nama icon sesuai versi terbaru library)
import {
  ShoppingBag01Icon,
  WhatsappIcon,
  ArrowRight01Icon,
  Search01Icon,
  FilterHorizontalIcon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'

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
  // 1. Fetch Data dari Payload
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 2, // Ambil URL gambar
    limit: 8, // Tampilkan 8 produk terbaru
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon icon={ShoppingBag01Icon} className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-zinc-800">
              Griya<span className="text-primary">Kebaya</span>
            </span>
          </div>

          {/* Search Bar (Hidden di Mobile) */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full w-96">
            <Icon icon={Search01Icon} className="h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari kebaya brokat, selendang..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
            />
          </div>

          <Button size="sm" variant="default" className="font-semibold shadow-md">
            Login
          </Button>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/5 px-4 py-1 text-sm uppercase tracking-wide"
            >
              Koleksi Terbaru 2024
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Anggun & Bercahaya dengan <br />
              <span className="text-primary">Kebaya Bali Asli</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-500 mb-8 leading-relaxed">
              Temukan koleksi kebaya premium dengan bahan berkualitas tinggi dan jahitan rapi. Siap
              menemani momen spesial upacara maupun kondangan Anda.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Lihat Katalog <Icon icon={ArrowRight01Icon} className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Cara Pemesanan
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* --- FILTER BAR --- */}
        <section className="bg-white py-6 border-b">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Produk Pilihan</h2>
            <Button variant="ghost" size="sm" className="text-zinc-500">
              <Icon icon={FilterHorizontalIcon} className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.docs.map((product: any) => {
              // Logic Gambar Aman
              const mainImage = product.images?.[0]?.image
              const imageUrl = typeof mainImage === 'object' ? mainImage?.url : '/placeholder.jpg'

              return (
                <Card
                  key={product.id}
                  className="group border-zinc-200 overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* ^^^ Tambahkan class 'relative' di Card agar absolute positioning badge bekerja */}

                  {/* --- BAGIAN 1: BADGE KATEGORI (Ditaruh DI LUAR Link Produk) --- */}
                  {/* Karena di luar Link utama, kita tidak butuh stopPropagation atau onClick */}
                  <div className="absolute top-3 left-3 z-20">
                    <Link href={`/categories/${product.category?.slug}`}>
                      <Badge className="bg-white/90 text-zinc-800 hover:bg-primary hover:text-white cursor-pointer shadow-sm backdrop-blur-sm transition-colors">
                        {product.category?.title || 'Kebaya'}
                      </Badge>
                    </Link>
                  </div>

                  {/* --- BAGIAN 2: LINK UTAMA PRODUK --- */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <CardHeader className="p-0 border-b border-zinc-100">
                      <AspectRatio ratio={3 / 4}>
                        <div className="relative h-full w-full bg-zinc-100 overflow-hidden">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          )}
                        </div>
                      </AspectRatio>
                    </CardHeader>

                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-zinc-800 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xl font-extrabold text-primary mt-2">
                        {formatRupiah(product.price)}
                      </p>
                    </CardContent>
                  </Link>

                  {/* --- BAGIAN 3: FOOTER (Tombol WA) --- */}
                  {/* Footer juga sebaiknya di luar Link utama agar tombolnya bisa diklik terpisah */}
                  <CardFooter className="p-5 pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full font-bold bg-green-600 hover:bg-green-700 text-white z-20 relative"
                    >
                      <Link
                        href={`https://wa.me/6281234567890?text=Halo, saya mau pesan ${product.name}`}
                        target="_blank"
                      >
                        <Icon icon={WhatsappIcon} className="mr-2 h-5 w-5" /> Pesan via WA
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; 2024 Griya Kebaya Bali. Dibuat dengan bangga untuk UMKM Indonesia.</p>
        </div>
      </footer>
    </div>
  )
}
