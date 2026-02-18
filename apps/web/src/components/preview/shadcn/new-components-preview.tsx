import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
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

export function NewComponentsPreview() {
  return (
    <div className="@container font-sans">
      <div className="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
        <div className="order-1 flex flex-col gap-4">
          <Card className="p-6">
            <FieldDemo />
          </Card>
        </div>
        <div className="order-2 flex flex-col gap-4">
          <Card className="p-6 *:[div]:border">
            <EmptyAvatarGroup />
          </Card>
          <Card className="p-6">
            <ButtonGroupInputGroup />
          </Card>
          <Card className="p-6">
            <FieldSlider />
          </Card>
          <Card className="p-6">
            <InputGroupDemo />
          </Card>
        </div>
        <div className="order-3 flex flex-col gap-4 @md:col-span-2 @4xl:col-span-1">
          <div className="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-1">
            <Card className="p-6">
              <ItemDemo />
            </Card>
            <Card className="p-6">
              <FieldSeparator>Appearance Settings</FieldSeparator>
              <AppearanceSettings />
            </Card>
          </div>
        </div>
        <div className="order-first flex flex-col gap-4 @4xl:order-4 @md:col-span-2 @4xl:col-span-3 @6xl:col-span-1">
          <Card className="p-6 flex gap-2">
            <SpinnerBadge />
          </Card>
          <Card className="p-6">
            <InputGroupButtonExample />
          </Card>
          <Card className="p-6">
            <NotionPromptForm />
          </Card>
          <Card className="p-6">
            <ButtonGroupDemo />
          </Card>
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
          <Card className="p-6 flex gap-4">
            <ButtonGroupNested />
            <ButtonGroupPopover />
          </Card>
          <Card className="p-6 *:[div]:border">
            <SpinnerEmpty />
          </Card>
        </div>
      </div>
    </div>
  );
}
