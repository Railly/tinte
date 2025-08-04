'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function WorkbenchError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Chat error:', error)
  }, [error])

  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Something went wrong!</h2>
      </div>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        An error occurred while loading the theme workbench. Please try again.
      </p>
      <Button onClick={reset} variant="outline" className="mt-4">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}