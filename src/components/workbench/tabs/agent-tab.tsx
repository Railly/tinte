import { useWorkbenchStore } from "@/stores/workbench-store";
import { ChatContent } from "../chat-content";

export function AgentTab() {
  const loading = useWorkbenchStore((state) => state.loading);
  
  return <ChatContent loading={loading} />;
}