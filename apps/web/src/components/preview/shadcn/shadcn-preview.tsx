import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { CardsActivityGoal } from "./demos/activity-goal";
import { CardsCalendar } from "./demos/calendar";
import { CardsCookieSettings } from "./demos/cookie-settings";
import { CardsExerciseMinutes } from "./demos/exercise-minutes";
import { CardsForms } from "./demos/forms";
import { CardsPayments } from "./demos/payments";
import { CardsShare } from "./demos/share";
import { CardsStats } from "./demos/stats";
import { CardsTeamMembers } from "./demos/team-members";
import { SurfaceCodeSelectionPreview } from "./demos/surface-code-selection";
import { InfiniteCanvas } from "./infinite-canvas";
import { AppearanceSettings } from "./new-components-01/components/appearance-settings";
import { ButtonGroupDemo } from "./new-components-01/components/button-group-demo";
import { ButtonGroupInputGroup } from "./new-components-01/components/button-group-input-group";
import { ButtonGroupNested } from "./new-components-01/components/button-group-nested";
import { ButtonGroupPopover } from "./new-components-01/components/button-group-popover";
import { EmptyAvatarGroup } from "./new-components-01/components/empty-avatar-group";
import { FieldDemo } from "./new-components-01/components/field-demo";
import { FieldSlider } from "./new-components-01/components/field-slider";
import { InputGroupButtonExample } from "./new-components-01/components/input-group-button";
import { InputGroupDemo } from "./new-components-01/components/input-group-demo";
import { ItemDemo } from "./new-components-01/components/item-demo";
import { NotionPromptForm } from "./new-components-01/components/notion-prompt-form";
import { SpinnerBadge } from "./new-components-01/components/spinner-badge";
import { SpinnerEmpty } from "./new-components-01/components/spinner-empty";

function Frame({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-base text-muted-foreground/60 mb-1.5 block truncate">
        {name}
      </span>
      {children}
    </div>
  );
}

export function ShadcnPreview() {
  return (
    <InfiniteCanvas>
      <div className="font-sans p-16" style={{ width: 2800 }}>
        <div className="columns-4 gap-10 [&>*]:mb-10 [&>*]:break-inside-avoid">
          <Frame name="Field">
            <Card className="p-6">
              <FieldDemo />
            </Card>
          </Frame>

          <Frame name="Spinner / Badge">
            <Card className="p-6 flex gap-2">
              <SpinnerBadge />
            </Card>
          </Frame>

          <Frame name="Surface / Code / Selection">
            <Card className="p-6">
              <SurfaceCodeSelectionPreview />
            </Card>
          </Frame>

          <Frame name="Avatar Group">
            <Card className="p-6 *:[div]:border">
              <EmptyAvatarGroup />
            </Card>
          </Frame>

          <Frame name="Input Group + Button">
            <Card className="p-6">
              <InputGroupButtonExample />
            </Card>
          </Frame>

          <Frame name="Stats">
            <Card className="p-4">
              <CardsStats />
            </Card>
          </Frame>

          <Frame name="Button Group + Input">
            <Card className="p-6">
              <ButtonGroupInputGroup />
            </Card>
          </Frame>

          <Frame name="Prompt Form">
            <Card className="p-6">
              <NotionPromptForm />
            </Card>
          </Frame>

          <Frame name="Calendar">
            <Card className="p-1">
              <CardsCalendar />
            </Card>
          </Frame>

          <Frame name="Field / Slider">
            <Card className="p-6">
              <FieldSlider />
            </Card>
          </Frame>

          <Frame name="Button Group">
            <Card className="p-6">
              <ButtonGroupDemo />
            </Card>
          </Frame>

          <Frame name="Activity Goal">
            <Card className="p-4">
              <CardsActivityGoal />
            </Card>
          </Frame>

          <Frame name="Input Group">
            <Card className="p-6">
              <InputGroupDemo />
            </Card>
          </Frame>

          <Frame name="Checkbox">
            <Card className="p-6">
              <FieldLabel htmlFor="checkbox-demo">
                <Field orientation="horizontal">
                  <Checkbox id="checkbox-demo" defaultChecked />
                  <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
                    I agree to the terms and conditions
                  </FieldLabel>
                </Field>
              </FieldLabel>
            </Card>
          </Frame>

          <Frame name="Exercise Minutes">
            <Card className="p-4">
              <CardsExerciseMinutes />
            </Card>
          </Frame>

          <Frame name="Item">
            <Card className="p-6">
              <ItemDemo />
            </Card>
          </Frame>

          <Frame name="Button Group / Nested">
            <Card className="p-6 flex gap-4">
              <ButtonGroupNested />
              <ButtonGroupPopover />
            </Card>
          </Frame>

          <Frame name="Cookie Settings">
            <Card className="p-4">
              <CardsCookieSettings />
            </Card>
          </Frame>

          <Frame name="Appearance Settings">
            <Card className="p-6">
              <FieldSeparator>Appearance Settings</FieldSeparator>
              <AppearanceSettings />
            </Card>
          </Frame>

          <Frame name="Spinner / Empty">
            <Card className="p-6 *:[div]:border">
              <SpinnerEmpty />
            </Card>
          </Frame>

          <Frame name="Forms">
            <Card className="p-4">
              <CardsForms />
            </Card>
          </Frame>

          <Frame name="Team Members">
            <Card className="p-4">
              <CardsTeamMembers />
            </Card>
          </Frame>

          <Frame name="Payments">
            <Card className="p-4">
              <CardsPayments />
            </Card>
          </Frame>

          <Frame name="Share">
            <Card className="p-4">
              <CardsShare />
            </Card>
          </Frame>
        </div>
      </div>
    </InfiniteCanvas>
  );
}
