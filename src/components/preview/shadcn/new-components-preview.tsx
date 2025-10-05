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
    <div className="font-sans grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <FieldDemo />
        <InputGroupDemo />
      </div>
      <div className="flex flex-col gap-4">
        <div className="*:[div]:border">
          <EmptyAvatarGroup />
        </div>
        <ButtonGroupInputGroup />
        <FieldSlider />
      </div>
      <div className="flex flex-col gap-4">
        <ItemDemo />
        <FieldSeparator>Appearance Settings</FieldSeparator>
        <AppearanceSettings />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <SpinnerBadge />
        </div>
        <InputGroupButtonExample />
        <NotionPromptForm />
        <ButtonGroupDemo />
        <div className="flex gap-6">
          <FieldLabel htmlFor="checkbox-demo">
            <Field orientation="horizontal">
              <Checkbox id="checkbox-demo" defaultChecked />
              <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
                I agree to the terms and conditions
              </FieldLabel>
            </Field>
          </FieldLabel>
        </div>
        <div className="flex gap-4">
          <ButtonGroupNested />
          <ButtonGroupPopover />
        </div>
        <div className="*:[div]:border">
          <SpinnerEmpty />
        </div>
      </div>
    </div>
  );
}
