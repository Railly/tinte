'use client';

import { TinteWorkbench } from './tinte-workbench';
import { useChatState } from '@/hooks/use-chat-state';

interface ChatPageProps {
  chatId: string;
}

export function ChatPage({ chatId }: ChatPageProps) {
  const { seed, split, loading } = useChatState(chatId);

  return (
    <div className="flex">
      <TinteWorkbench
        split={split}
        loading={loading}
        seed={seed}
      />
    </div>
  );
}