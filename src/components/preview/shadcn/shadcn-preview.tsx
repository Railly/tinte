"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardsActivityGoal } from "./demos/activity-goal";
import { CardsCalendar } from "./demos/calendar";
import { CardsCookieSettings } from "./demos/cookie-settings";
import { CardsExerciseMinutes } from "./demos/exercise-minutes";
import { CardsForms } from "./demos/forms";
import { CardsPayments } from "./demos/payments";
import { CardsShare } from "./demos/share";
import { CardsStats } from "./demos/stats";
import { CardsTeamMembers } from "./demos/team-members";
import { NewComponentsPreview } from "./new-components-preview";

function ClassicPreview() {
  return (
    <div className="font-sans md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-13">
      <div className="grid gap-4 lg:col-span-4 xl:col-span-6">
        <CardsStats />
        <div className="grid gap-1 sm:grid-cols-[auto_1fr] md:hidden">
          <CardsCalendar />
          <div className="pt-3 sm:pt-0 sm:pl-2 xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <CardsForms />
          <CardsTeamMembers />
          <CardsCookieSettings />
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-7">
        <div className="hidden gap-1 sm:grid-cols-[auto_1fr] md:grid">
          <CardsCalendar />
          <div className="pt-3 sm:pt-0 sm:pl-2 xl:pl-3">
            <CardsActivityGoal />
          </div>
          <div className="grid gap-4 pt-3 sm:col-span-2 xl:pt-3">
            <CardsExerciseMinutes />
            <CardsPayments />
            <CardsShare />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShadcnPreview() {
  return (
    <Tabs defaultValue="classic" className="w-full h-full flex flex-col">
      <TabsList className="mb-4">
        <TabsTrigger value="classic">Classic</TabsTrigger>
        <TabsTrigger value="new">New Components</TabsTrigger>
      </TabsList>
      <TabsContent value="classic" className="flex-1 min-h-0 mt-0">
        <ScrollArea className="h-full">
          <ClassicPreview />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="new" className="flex-1 min-h-0 mt-0">
        <ScrollArea className="h-full">
          <NewComponentsPreview />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
