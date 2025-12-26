import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// UI Components (Copy dari Homepage biar konsisten)
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { WhatsappIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
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
    <div className="min-h-screen bg-zinc-50 font-sans py-10">
      <div className="container mx-auto px-4">
        {/* Header Kategori */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 pl-0 text-zinc-500 hover:text-primary">
            <Link href="/">
              <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Semua Produk
            </Link>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">
            Kategori: <span className="text-primary">{category.title}</span>
          </h1>
          <p className="text-zinc-500 mt-2">Menampilkan {products.totalDocs} produk pilihan.</p>
        </div>

        {/* Grid Produk (Sama persis dengan Homepage) */}
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.docs.map((product: any) => {
              const mainImage = product.images?.[0]?.image
              const imageUrl = typeof mainImage === 'object' ? mainImage?.url : '/placeholder.jpg'

              return (
                <Card
                  key={product.id}
                  className="group border-zinc-200 overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/products/${product.slug}`}>
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

                  <CardFooter className="p-5 pt-0">
                    <Button
                      asChild
                      className="w-full font-bold bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Link
                        href={`https://wa.me/6281234567890?text=Halo, saya mau pesan ${product.name}`}
                        target="_blank"
                      >
                        <Icon icon={WhatsappIcon} className="mr-2 h-5 w-5" /> Pesan
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Tampilan jika Kategori Kosong */
          <div className="text-center py-20 bg-white rounded-lg border border-dashed">
            <p className="text-zinc-400">Belum ada produk di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
