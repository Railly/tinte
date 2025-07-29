'use client';

import { AnimatePresence } from 'motion/react';
import { ChatSidebar } from './chat-sidebar';
import { ChatPreview } from './chat-preview';
import { useChatState } from '@/hooks/use-chat-state';

interface ChatPageProps {
  chatId: string;
}

export function ChatPage({ chatId }: ChatPageProps) {
  const { seed, split, loading } = useChatState(chatId);

  return (
    <div className="flex">
      <ChatSidebar
        split={split}
        loading={loading}
        seed={seed}
      />
      <AnimatePresence>
        <ChatPreview
          split={split}
        />
      </AnimatePresence>
    </div>
  );
}