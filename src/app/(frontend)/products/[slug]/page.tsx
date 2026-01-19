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
  CheckmarkCircle01Icon,
  Share01Icon,
  Shield01Icon,
  DeliveryBox01Icon,
  ShoppingBag01Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { MagicImageViewer } from '@/components/magic-image-viewer'

// Helper Rupiah
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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // 1. Cari Produk berdasarkan Slug
  const result = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  // Kalau tidak ketemu, lempar ke 404
  if (!result.docs[0]) return notFound()

  const product: any = result.docs[0]
  const images = product.images || []

  // Extract main image URL safely (similar to product card)
  const getMainImageUrl = (imgData: any) => {
    const imgObj = imgData?.image
    if (!imgObj) return '/placeholder.jpg'

    // Priority: Cloudinary URL -> Card Size -> Main URL
    if (imgObj.cloudinary_url) return imgObj.cloudinary_url
    if (imgObj.sizes?.card?.url) return imgObj.sizes.card.url
    return imgObj.url || '/placeholder.jpg'
  }

  const mainImageUrl = getMainImageUrl(images[0])
  const isPreOrder = product.stockStatus === 'po'

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
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

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon icon={Share01Icon} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Back Button - Restored */}
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="pl-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground hover:translate-x-[-4px] duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <Icon icon={ArrowLeft01Icon} className="h-5 w-5" />
              <span className="font-medium">Kembali ke Katalog</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          {/* --- KOLOM KIRI: GALERI (Sticky on Desktop) --- */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24 h-fit">
            {/* Main Image */}
            {/* Main Image with Magic Viewer */}
            <div className="w-full">
              <MagicImageViewer originalUrl={mainImageUrl} productName={product.name} />

              {/* Floating Badges (Outside Viewer if needed, or integrated?) 
                  The user prompt asked for the viewer to handle variants. 
                  But the original code had Category and PreOrder badges. 
                  I should probably keep them or let the user decide. 
                  However, the MagicImageViewer has its own container. 
                  I'll place the badges absolutely positioned *over* the viewer wrapper in the page 
                  OR inside the viewer. 
                  
                  Given the MagicImageViewer is a self-contained component for "viewing", 
                  and the badges are product *metadata*, it might be better to overlay them 
                  here in the parent or pass them in. 
                  
                  BUT, looking at the MagicImageViewer code I just wrote, it has relative positioning.
                  If I wrap it here, I can overlay the original labels.
              */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                <Badge className="bg-white/90 backdrop-blur-md text-foreground border-0 shadow-sm uppercase tracking-wider text-xs px-3 py-1 font-bold">
                  {product.category?.title || 'Kebaya'}
                </Badge>
                {isPreOrder && (
                  <Badge className="bg-black/80 backdrop-blur-md text-white border-0 shadow-sm uppercase tracking-wider text-xs px-3 py-1 font-bold w-fit">
                    Pre-Order
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails (Jika lebih dari 1) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img: any, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-3/4 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-primary/50 transition-all"
                  >
                    <Image
                      src={getMainImageUrl(img)}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30">
                <Icon icon={CheckmarkCircle01Icon} className="h-6 w-6 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">Original 100%</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30">
                <Icon icon={Shield01Icon} className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-medium text-muted-foreground">Transaksi Aman</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30">
                <Icon icon={DeliveryBox01Icon} className="h-6 w-6 text-orange-600" />
                <span className="text-xs font-medium text-muted-foreground">Siap Kirim</span>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: INFO PRODUK (Scrollable) --- */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-3xl lg:text-4xl font-bold text-primary">
                {formatRupiah(product.price)}
              </p>
              {product.stockStatus === 'ready' && (
                <Badge
                  variant="outline"
                  className="border-green-600/30 text-green-700 bg-green-50 px-3 py-1"
                >
                  Ready Stock
                </Badge>
              )}
            </div>

            {/* Separator Halus */}
            <div className="h-px w-full bg-linear-to-r from-border to-transparent mb-8" />

            {/* Product Variants / Details */}
            <div className="space-y-6 mb-10">
              {/* Material */}
              {product.material && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Bahan / Material
                  </h3>
                  <div className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary/20 text-secondary-foreground font-medium text-sm border border-secondary/10">
                    {product.material === 'brokat_semi'
                      ? 'Brokat Semi Prancis'
                      : product.material.replace(/_/g, ' ')}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Ukuran Tersedia
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s: string) => (
                      <div
                        key={s}
                        className="h-10 min-w-12 px-3 flex items-center justify-center rounded-lg border border-border bg-card hover:border-primary hover:text-primary cursor-default text-sm font-medium transition-all"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description Accordion */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">Detail Produk</h3>
              <div className="prose prose-zinc prose-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* Sticky Bottom Action on Mobile / Regular on Desktop */}
            <div className="mt-auto lg:sticky lg:bottom-4 z-20">
              <div className="flex flex-col gap-3 p-4 lg:p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-lg">
                <Button
                  asChild
                  size="lg"
                  className="w-full text-base lg:text-lg font-bold h-12 lg:h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                >
                  <Link
                    href={`https://wa.me/6281234567890?text=Halo Admin, saya tertarik dengan produk *${product.name}* yang harganya ${formatRupiah(product.price)}. Apakah stoknya masih ada?`}
                    target="_blank"
                  >
                    <Icon icon={WhatsappIcon} className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                    Pesan via WhatsApp
                  </Link>
                </Button>
                <p className="text-center text-[10px] lg:text-xs text-muted-foreground">
                  *Admin akan membalas pesan Anda secepatnya pada jam kerja
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
