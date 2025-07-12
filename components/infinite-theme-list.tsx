'use client'

import { cn } from '@/lib/utils'
import {
  SupabaseQueryHandler,
  useInfiniteQuery,
} from '@/lib/hooks/use-infinite-query'
import * as React from 'react'
import { ThemeCard } from './theme-card'
import type { Theme } from '@/lib/db/schema'

interface InfiniteThemeListProps {
  tableName: 'themes'
  columns?: string
  pageSize?: number
  trailingQuery?: SupabaseQueryHandler<'themes'>
  className?: string
  renderNoResults?: () => React.ReactNode
  renderEndMessage?: () => React.ReactNode
  renderSkeleton?: (count: number) => React.ReactNode
  userId?: string | null
  isAuthenticated?: boolean
}

const DefaultNoResults = () => (
  <div className="col-span-full text-center py-12">
    <p className="text-muted-foreground">No themes found.</p>
  </div>
)

const DefaultEndMessage = () => (
  <div className="col-span-full text-center text-muted-foreground py-4 text-sm">
    You've reached the end of all themes.
  </div>
)

const defaultSkeleton = (count: number) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-card border rounded-lg p-6 space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
        <div className="h-20 bg-muted animate-pulse rounded" />
        <div className="flex justify-between">
          <div className="h-4 bg-muted animate-pulse rounded w-16" />
          <div className="h-4 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    ))}
  </>
)

export function InfiniteThemeList({
  tableName,
  columns = '*',
  pageSize = 12,
  trailingQuery,
  className,
  renderNoResults = DefaultNoResults,
  renderEndMessage = DefaultEndMessage,
  renderSkeleton = defaultSkeleton,
  userId,
  isAuthenticated,
}: InfiniteThemeListProps) {
  const { data, isFetching, hasMore, fetchNextPage, isSuccess, isLoading } = useInfiniteQuery<Theme, 'themes'>({
    tableName,
    columns,
    pageSize,
    trailingQuery,
  })

  // Ref for the scrolling container
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Intersection observer logic - target the last rendered *item* or a dedicated sentinel
  const loadMoreSentinelRef = React.useRef<HTMLDivElement>(null)
  const observer = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage()
        }
      },
      {
        root: null, // Use viewport for scroll detection
        threshold: 0.1, // Trigger when 10% of the target is visible
        rootMargin: '0px 0px 100px 0px', // Trigger loading a bit before reaching the end
      }
    )

    if (loadMoreSentinelRef.current) {
      observer.current.observe(loadMoreSentinelRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [isFetching, hasMore, fetchNextPage])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Theme grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isSuccess && data.length === 0 && renderNoResults()}

        {data.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isOwner={userId === theme.userId}
          />
        ))}

        {(isFetching || isLoading) && renderSkeleton && renderSkeleton(pageSize)}

        {!hasMore && data.length > 0 && renderEndMessage()}
      </div>

      <div ref={loadMoreSentinelRef} style={{ height: '1px' }} />
    </div>
  )
}