import { ChatHeader } from '@/components/shared/chat-header'
import { Workbench } from '@/components/chat/workbench'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Workbench | Tinte',
  description: 'Create, edit, and convert themes with Tinte\'s powerful workbench',
}

export default async function ChatPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { id } = await params
  const { new: isNew } = await searchParams
  const showStatic = isNew === 'true'

  return (
    <div className="flex flex-col min-h-screen">
      <ChatHeader chatId={id} />
      <Workbench chatId={id} isStatic={showStatic} />
    </div>
  )
}
