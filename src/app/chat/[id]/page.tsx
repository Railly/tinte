import { ChatPage } from '@/components/chat/chat-page';
import { ChatHeader } from '@/components/shared/chat-header';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader chatId={id} />
      <ChatPage chatId={id} />
    </div>
  );
}
