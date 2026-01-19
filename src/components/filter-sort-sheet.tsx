'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FilterHorizontalIcon, Cancel01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  title: string
  slug: string
}

interface FilterSortSheetProps {
  categories: Category[]
}

export function FilterSortSheet({ categories }: FilterSortSheetProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Local state for filters
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category'),
  )
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  })

  // Sync with URL when opening
  useEffect(() => {
    if (isOpen) {
      setSort(searchParams.get('sort') || '-createdAt')
      setSelectedCategory(searchParams.get('category'))
      setPriceRange({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || '',
      })
    }
  }, [isOpen, searchParams])

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update Sort
    if (sort) params.set('sort', sort)
    else params.delete('sort')

    // Update Category
    if (selectedCategory) params.set('category', selectedCategory)
    else params.delete('category')

    // Update Price
    if (priceRange.min) params.set('minPrice', priceRange.min)
    else params.delete('minPrice')

    if (priceRange.max) params.set('maxPrice', priceRange.max)
    else params.delete('maxPrice')

    // Reset pagination if implementation exists (usually page=1)
    params.delete('page')

    router.push(`/products?${params.toString()}`)
    setIsOpen(false)
  }

  const handleReset = () => {
    setSort('-createdAt')
    setSelectedCategory(null)
    setPriceRange({ min: '', max: '' })
  }

  const activeFilterCount = (selectedCategory ? 1 : 0) + (priceRange.min || priceRange.max ? 1 : 0)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto border-border relative"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon={FilterHorizontalIcon} className="mr-2 h-4 w-4" />
        Filter & Urutkan
        {activeFilterCount > 0 && (
          <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px]">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet Content */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Filter & Urutkan</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <Icon icon={Cancel01Icon} className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Sort Section */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Urutkan Berdasarkan
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Terbaru', value: '-createdAt' },
                { label: 'Harga Terendah', value: 'price' },
                { label: 'Harga Tertinggi', value: '-price' },
                { label: 'Nama (A-Z)', value: 'name' },
              ].map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50',
                    sort === option.value ? 'border-primary bg-primary/5' : 'border-border bg-card',
                  )}
                  onClick={() => setSort(option.value)}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  {sort === option.value && (
                    <Icon icon={Tick01Icon} className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Category Section */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Kategori
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => setSelectedCategory(null)}
              >
                Semua
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)
                  }
                >
                  {cat.title}
                </Badge>
              ))}
            </div>
          </section>

          {/* Price Range Section */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Rentang Harga
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Terapkan Filter
          </Button>
        </div>
      </div>
    </>
  )
}
