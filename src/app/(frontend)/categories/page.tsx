import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag01Icon,
  Search01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { SearchBar } from '@/components/ui/search-bar'

export default async function CategoriesPage() {
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
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
        <div className="mb-10 lg:mb-12">
          <Button
            variant="ghost"
            asChild
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary hover:translate-x-[-4px] transition-all"
          >
            <Link href="/">
              <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Kembali ke Beranda
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border/50 pb-6">
            <div>
              <Badge
                variant="outline"
                className="mb-3 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider text-xs font-bold px-3 py-1"
              >
                Koleksi Lengkap
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  Semua Kategori
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground font-medium">
              {categories.totalDocs} kategori tersedia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.docs.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-video border border-border bg-muted/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {category.title}
                </h3>
                <span className="inline-flex items-center text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  Lihat Produk
                  <Icon
                    icon={ArrowRight01Icon}
                    className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>

              {/* Decorative elements */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
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
