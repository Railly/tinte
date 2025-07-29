'use client';

import { useEffect, useState } from 'react';
import { popSeed } from '@/utils/anon-seed';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { SeedPayload } from '@/utils/seed-mapper';

export function useChatState(chatId: string) {
  const [seed, setSeed] = useState<SeedPayload | null>(null);
  const [split, setSplit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplit(true), CHAT_CONFIG.SPLIT_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (chatId) {
      setSeed(popSeed(chatId));
      setLoading(false);
    }
  }, [chatId]);

  return {
    seed,
    split,
    loading
  };
}