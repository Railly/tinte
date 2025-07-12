'use client'

import { useSession } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

export function useClerkSupabase() {
  const { session } = useSession()

  const client = useMemo(() => {
    const getToken = session 
      ? () => session.getToken() 
      : null

    return createClerkSupabaseClient(getToken)
  }, [session])

  return client
}