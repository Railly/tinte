import { nanoid } from 'nanoid'
import { redirect } from 'next/navigation'

export default function ChatPage() {
  const chatId = nanoid()
  return redirect(`/chat/${chatId}?new=true`)
}