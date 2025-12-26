import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WhatsappIcon, ArrowLeft01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'

// Helper Rupiah
const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
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

  return (
    <div className="min-h-screen bg-white py-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Tombol Kembali */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
        >
          <Link href="/">
            <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Kembali ke Katalog
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* --- KOLOM KIRI: GALERI FOTO --- */}
          <div className="space-y-4">
            {/* Foto Utama Besar */}
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 shadow-sm">
              {images[0]?.image?.url ? (
                <Image
                  src={images[0].image.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-300">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnail Grid (Kalau foto lebih dari 1) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: any, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border hover:border-primary"
                  >
                    <Image src={img.image.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- KOLOM KANAN: INFO PRODUK --- */}
          <div className="flex flex-col justify-center">
            {/* Kategori & Status */}
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
                {product.category?.title || 'Kebaya'}
              </Badge>
              {product.stockStatus === 'ready' && (
                <span className="flex items-center text-xs font-medium text-green-600">
                  <Icon icon={CheckmarkCircle01Icon} className="mr-1 h-4 w-4" /> Ready Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">{product.name}</h1>

            <p className="text-2xl font-semibold text-primary mb-6">
              {formatRupiah(product.price)}
            </p>

            <Separator className="mb-6" />

            {/* Deskripsi */}
            <div className="prose prose-zinc mb-8 text-zinc-600">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-2">
                Deskripsi Produk
              </h3>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* Pilihan (Static Display dulu) */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-2">Bahan</h3>
                <div className="p-3 border rounded-lg text-sm text-zinc-600 bg-zinc-50">
                  {/* Mapping label bahan manual atau tampilkan raw value dulu */}
                  {product.material === 'brokat_semi' ? 'Brokat Semi Prancis' : product.material}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-2">Ukuran Tersedia</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((s: string) => (
                    <div
                      key={s}
                      className="border px-3 py-1 rounded-md text-sm font-medium uppercase min-w-[40px] text-center"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="w-full text-lg font-bold bg-green-600 hover:bg-green-700 h-14 shadow-lg shadow-green-600/20"
              >
                <Link
                  href={`https://wa.me/6281234567890?text=Halo Admin, saya tertarik dengan produk *${product.name}* yang harganya ${formatRupiah(product.price)}. Apakah stoknya masih ada?`}
                  target="_blank"
                >
                  <Icon icon={WhatsappIcon} className="mr-2 h-6 w-6" />
                  Beli Sekarang via WhatsApp
                </Link>
              </Button>
              <p className="text-center text-xs text-zinc-400">
                *Transaksi aman langsung terhubung ke owner via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
