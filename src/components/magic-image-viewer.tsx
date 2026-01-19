'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getTransformedUrl } from '@/utils/cloudinary'
import { cn } from '@/lib/utils'

// Inline SVG Icons to avoid dependency issues
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('animate-spin', className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const Sparkles = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962l6.135-1.583A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0l1.583 6.135a2 2 0 0 0 1.437 1.437l6.135 1.583a.5.5 0 0 1 0 .962l-6.135 1.583a2 2 0 0 0-1.437 1.437l-1.583 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
)

const RotateCcw = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

type VariantType = 'original' | 'red' | 'blue' | 'no-bg' | 'custom-color'

interface MagicImageViewerProps {
  originalUrl: string
  productName: string
}

export function MagicImageViewer({ originalUrl, productName }: MagicImageViewerProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantType>('original')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(originalUrl)
  const [customColor, setCustomColor] = useState('#000000')
  const colorInputRef = useRef<HTMLInputElement>(null)

  // Map variants to Cloudinary transformations
  const getVariantUrl = (variant: VariantType, color?: string) => {
    switch (variant) {
      case 'red':
        return getTransformedUrl(originalUrl, 'e_gen_recolor:prompt_clothing;to-color_red')
      case 'blue':
        return getTransformedUrl(originalUrl, 'e_gen_recolor:prompt_clothing;to-color_blue')
      case 'no-bg':
        return getTransformedUrl(originalUrl, 'e_background_removal')
      case 'custom-color':
        // Ensure color has no # and handle default
        const targetColor = (color || customColor).replace('#', '')
        return getTransformedUrl(
          originalUrl,
          `e_gen_recolor:prompt_clothing;to-color_${targetColor}`,
        )
      case 'original':
      default:
        return originalUrl
    }
  }

  const handleVariantChange = (variant: VariantType, color?: string) => {
    // Determine the new URL first
    const newUrl = getVariantUrl(variant, color)

    // For custom color, we might re-select the same variant but with different color
    // So we check URL difference instead of only variant match
    if (newUrl !== currentUrl) {
      setIsLoading(true)
      setSelectedVariant(variant)
      setCurrentUrl(newUrl)
    } else if (variant !== selectedVariant) {
      // If URL is same (unlikely edge case unless same color picked) but variant changed logic
      setSelectedVariant(variant)
    }

    if (variant === 'custom-color' && color) {
      setCustomColor(color)
    }
  }

  // Debounce reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)

    // Debounce the API call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      handleVariantChange('custom-color', color)
    }, 500)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-muted shadow-xs group">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300">
            <Loader2 className="h-10 w-10 text-primary" />
            <p className="mt-2 text-sm font-medium text-foreground/80 animate-pulse">
              Magic AI sedang bekerja...
            </p>
          </div>
        )}

        {/* AI Badge */}
        {selectedVariant !== 'original' && (
          <div className="absolute top-4 right-4 z-10 transition-opacity duration-300">
            <Badge className="bg-purple-600/90 hover:bg-purple-600 text-white border-0 shadow-lg backdrop-blur-md flex items-center gap-1.5 px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Generate</span>
            </Badge>
          </div>
        )}

        <Image
          src={currentUrl}
          alt={`${productName} - ${selectedVariant}`}
          fill
          className={cn(
            'object-cover transition-all duration-700',
            isLoading ? 'scale-105 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0',
          )}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            // Fallback to original if transformation fails
            setIsLoading(false)
            if (selectedVariant !== 'original') {
              handleVariantChange('original')
              // Only show alert/toast in a real app, keeping it simple here
            }
          }}
        />
      </div>

      {/* Control Panel */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Magic AI Preview
          </h3>
          {selectedVariant !== 'original' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVariantChange('original')}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <VariantButton
            isActive={selectedVariant === 'original'}
            onClick={() => handleVariantChange('original')}
            label="Asli"
          />
          <VariantButton
            isActive={selectedVariant === 'red'}
            onClick={() => handleVariantChange('red')}
            label="Merah"
            colorDot="bg-red-500"
          />
          <VariantButton
            isActive={selectedVariant === 'blue'}
            onClick={() => handleVariantChange('blue')}
            label="Biru"
            colorDot="bg-blue-500"
          />
          <VariantButton
            isActive={selectedVariant === 'no-bg'}
            onClick={() => handleVariantChange('no-bg')}
            label="Hapus Bg"
            icon={
              <div className="w-3 h-3 border border-current bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-50" />
            }
          />

          {/* Custom Color Picker */}
          <div className="relative flex items-center">
            <input
              ref={colorInputRef}
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
            />
            <VariantButton
              isActive={selectedVariant === 'custom-color'}
              onClick={() => {
                // Trigger color input click
                colorInputRef.current?.click()
              }}
              label="Warna Lain"
              icon={
                <div
                  className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: customColor }}
                />
              }
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/60 italic">
          *Pilih &quot;Warna Lain&quot;, perubahan akan diterapkan otomatis.
        </p>
      </div>
    </div>
  )
}

function VariantButton({
  isActive,
  onClick,
  label,
  colorDot,
  icon,
}: {
  isActive: boolean
  onClick: () => void
  label: string
  colorDot?: string
  icon?: React.ReactNode
}) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={cn(
        'rounded-full text-xs transition-all duration-300',
        isActive ? 'shadow-md scale-105 ring-2 ring-primary/20' : 'hover:bg-secondary/50',
      )}
    >
      {colorDot && (
        <span
          className={cn('w-2 h-2 rounded-full mr-2 shadow-sm border border-white/20', colorDot)}
        />
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  )
}
