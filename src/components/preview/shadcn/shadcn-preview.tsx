import { CardsActivityGoal } from "./demos/activity-goal";
import { CardsCalendar } from "./demos/calendar";
import { CardsCookieSettings } from "./demos/cookie-settings";
import { CardsExerciseMinutes } from "./demos/exercise-minutes";
import { CardsForms } from "./demos/forms";
import { CardsPayments } from "./demos/payments";
import { CardsShare } from "./demos/share";
import { CardsStats } from "./demos/stats";
import { CardsTeamMembers } from "./demos/team-members";

export function ShadcnPreview() {
  return (
    <div className="font-sans h-full md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-13">
      <div className="h-full grid gap-4 lg:col-span-4 xl:col-span-6">
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
