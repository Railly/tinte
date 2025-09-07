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
}

export function WorkbenchSidebar({
  defaultTab,
}: WorkbenchSidebarProps) {
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(
    defaultTab || WORKBENCH_CONFIG.DEFAULT_TAB,
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-16">
          <SidebarGroupContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as WorkbenchTab)}
              className="flex w-full flex-col h-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-2">
                {WORKBENCH_TABS.map(({ id, label }) => (
                  <TabsTrigger key={id} value={id}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex-1 overflow-hidden">
                {WORKBENCH_TABS.map(({ id, component: Component }) => (
                  <TabsContent
                    key={id}
                    value={id}
                    className="h-full overflow-hidden mt-0"
                  >
                    <div className="h-full">
                      <Component />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
