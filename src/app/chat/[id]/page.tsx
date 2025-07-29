import { ChatHeader } from '@/components/shared/chat-header';
import { TinteWorkbench } from '@/components/chat/tinte-workbench';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <ChatHeader chatId={id} />
      <TinteWorkbench
        chatId={id}
      />
    </div>
  );
}
