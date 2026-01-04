import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag01Icon,
  ArrowLeft01Icon,
  WhatsappIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { SearchBar } from '@/components/ui/search-bar'

export default function HowToOrderPage() {
  const steps = [
    {
      title: 'Pilih Produk',
      description: 'Jelajahi katalog kami dan pilih kebaya atau kain yang Anda inginkan.',
    },
    {
      title: 'Hubungi Kami',
      description: 'Klik tombol "Order via WhatsApp" pada produk yang Anda pilih.',
    },
    {
      title: 'Konfirmasi Pesanan',
      description: 'Admin kami akan mengkonfirmasi ketersediaan stok dan total pembayaran.',
    },
    {
      title: 'Pembayaran & Pengiriman',
      description: 'Lakukan pembayaran dan pesanan Anda akan segera dikirim.',
    },
  ]

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

      <main className="container mx-auto px-4 lg:px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          asChild
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary hover:translate-x-[-4px] transition-all"
        >
          <Link href="/">
            <Icon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" /> Kembali ke Beranda
          </Link>
        </Button>

        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Cara Pemesanan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berbelanja di Griya Kebaya Bali sangat mudah. Ikuti langkah-langkah berikut untuk
              mendapatkan kebaya impian Anda.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-muted/30 rounded-2xl border border-border/50"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Lebih Lanjut?</h2>
            <p className="text-muted-foreground mb-8">
              Jangan ragu untuk menghubungi admin kami jika Anda memiliki pertanyaan lain.
            </p>
            <Button size="lg" className="rounded-xl px-8" asChild>
              <Link href="https://wa.me/6281234567890" target="_blank">
                <Icon icon={WhatsappIcon} className="mr-2 h-5 w-5" />
                Hubungi Admin
              </Link>
            </Button>
          </div>
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
