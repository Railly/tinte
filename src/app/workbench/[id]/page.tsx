import { WorkbenchHeader } from '@/components/workbench/workbench-header'
import { Workbench } from '@/components/workbench/workbench'
import { Metadata } from 'next'
import { workbenchCache } from '../search-params'
import type { SearchParams } from 'nuqs/server'

export const metadata: Metadata = {
  title: 'Theme Workbench | Tinte',
  description: 'Create, edit, and convert themes with Tinte\'s powerful workbench',
}

export default async function WorkbenchIdPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParams>
}) {
  const { id } = await params
  
  // Parse search params server-side with nuqs
  const { new: isNew, tab } = await workbenchCache.parse(searchParams)
  const isStatic = isNew
  
  // For static mode, default to design tab; otherwise chat
  const defaultTab = isStatic ? 'design' : 'chat'

  return (
    <div className="flex flex-col min-h-screen">
      <WorkbenchHeader chatId={id} />
      <Workbench chatId={id} isStatic={isStatic} defaultTab={defaultTab} />
    </div>
  )
}
