import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkbenchUrlSync } from "@/hooks/use-workbench-url-sync";
import type { WorkbenchTab } from "@/stores/workbench-store";
import { WORKBENCH_CONFIG, WORKBENCH_TABS } from "./workbench.config";

interface WorkbenchSidebarProps {
  defaultTab?: WorkbenchTab;
  initialPrompt?: string;
}

export function WorkbenchSidebar({
  defaultTab,
  initialPrompt,
}: WorkbenchSidebarProps) {
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(
    defaultTab || WORKBENCH_CONFIG.DEFAULT_TAB,
  );

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as WorkbenchTab)}
          className="flex gap-1 flex-col h-full"
        >
          <div className="flex-shrink-0 border-b border-border mt-[3.05rem]">
            <TabsList className="grid w-full grid-cols-3 gap-0 bg-transparent h-8 p-0 rounded-none">
              {WORKBENCH_TABS.map(({ id, label }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <SidebarGroup className="flex-1 pr-0 min-h-0">
            <SidebarGroupContent className="h-full">
              {WORKBENCH_TABS.map(({ id, component: Component }) => (
                <TabsContent key={id} value={id} className="h-full mt-0">
                  {id === "agent" ? (
                    <Component initialPrompt={initialPrompt} />
                  ) : (
                    <Component />
                  )}
                </TabsContent>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </Tabs>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
