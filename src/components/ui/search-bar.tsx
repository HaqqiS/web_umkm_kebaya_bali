'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-xl w-full max-w-md border border-border/50 focus-within:border-primary/50 transition-colors"
    >
      <Icon icon={Search01Icon} className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        placeholder="Cari kebaya brokat, selendang..."
        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}
