import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkbenchUrlSync } from "@/hooks/use-workbench-url-sync";
import type { WorkbenchTab } from "@/stores/workbench-store";
import { useWorkbenchStore } from "@/stores/workbench-store";
import { ChatContent } from "./chat-content";
import { WORKBENCH_CONFIG, WORKBENCH_TABS } from "./workbench.config";

interface WorkbenchSidebarProps {
  isStatic?: boolean;
  split?: boolean;
  defaultTab?: WorkbenchTab;
}

export function WorkbenchSidebar({
  isStatic = false,
  split = false,
  defaultTab,
}: WorkbenchSidebarProps) {
  // Get own data - no prop drilling
  const loading = useWorkbenchStore((state) => state.loading);
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(
    defaultTab || WORKBENCH_CONFIG.DEFAULT_TAB,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([activeTab]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAccordionChange = (value: string) => {
    setOpenAccordions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as WorkbenchTab)}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-3 shrink-0">
            {WORKBENCH_TABS.map(({ id, label }) => (
              <TabsTrigger key={id} value={id} className="text-xs">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 overflow-hidden">
            {WORKBENCH_TABS.map(
              ({ id, component: Component, requiresLoading }) => (
                <TabsContent
                  key={id}
                  value={id}
                  className="h-full overflow-hidden mt-2"
                >
                  <div className={isStatic ? "h-full" : "px-3 h-full"}>
                    {requiresLoading && !isStatic ? (
                      <ChatContent loading={loading} />
                    ) : (
                      <Component loading={loading} />
                    )}
                  </div>
                </TabsContent>
              ),
            )}
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop: Multiple accordions can be open */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {WORKBENCH_TABS.map(
            ({ id, label, component: Component, requiresLoading }) => {
              const isOpen = openAccordions.includes(id);
              return (
                <div key={id} className="border border-border rounded-lg">
                  <button
                    onClick={() => handleAccordionChange(id)}
                    className="w-full py-3 px-3 text-left text-[15px] leading-6 font-medium hover:bg-accent transition-colors flex items-center justify-between"
                  >
                    <span>{label}</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="border-t border-border">
                      <div className={isStatic ? "p-0" : "px-3 pb-3"}>
                        {requiresLoading && !isStatic ? (
                          <ChatContent loading={loading} />
                        ) : (
                          <Component loading={loading} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
