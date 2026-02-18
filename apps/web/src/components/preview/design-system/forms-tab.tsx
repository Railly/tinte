"use client";

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function FormsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Inputs</CardTitle>
          <CardDescription>Text inputs and form controls</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Text Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="input-default">Default Input</Label>
                <Input id="input-default" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-disabled">Disabled Input</Label>
                <Input id="input-disabled" placeholder="Disabled" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-email">Email Input</Label>
                <Input
                  id="input-email"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-password">Password Input</Label>
                <Input
                  id="input-password"
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Textarea & Select</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="textarea-basic">Textarea</Label>
                <Textarea
                  id="textarea-basic"
                  placeholder="Enter message..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-basic">Select</Label>
                <Select>
                  <SelectTrigger id="select-basic">
                    <SelectValue placeholder="Choose option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Fields</CardTitle>
          <CardDescription>Field components with labels</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Basic Fields</h3>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="field-name">Full Name</FieldLabel>
                <FieldContent>
                  <Input id="field-name" placeholder="Enter your name" />
                  <FieldDescription>Displayed on your profile</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="field-email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="field-email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <FieldDescription>
                    We'll never share your email
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Error State</h3>
            <Field data-invalid="true">
              <FieldLabel htmlFor="field-error">Username</FieldLabel>
              <FieldContent>
                <Input
                  id="field-error"
                  placeholder="Enter username"
                  aria-invalid="true"
                  className="border-destructive focus-visible:ring-destructive"
                />
                <FieldError>
                  Username must be at least 3 characters
                </FieldError>
              </FieldContent>
            </Field>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Field Set</h3>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input id="first-name" placeholder="John" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input id="last-name" placeholder="Doe" />
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Input Groups</CardTitle>
          <CardDescription>Input groups with addons</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">With Addons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Search</Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <svg
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="Search..." />
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>https://</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="example.com" />
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput type="number" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label>With Button</Label>
                <InputGroup>
                  <InputGroupInput placeholder="Enter email..." />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>Subscribe</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">
            Button Groups
          </CardTitle>
          <CardDescription>Grouped button layouts</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Horizontal</h3>
            <ButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Middle</Button>
              <Button variant="outline">Right</Button>
            </ButtonGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">With Separator</h3>
            <ButtonGroup>
              <Button variant="outline">Copy</Button>
              <ButtonGroupSeparator />
              <Button variant="outline">Cut</Button>
              <ButtonGroupSeparator />
              <Button variant="outline">Paste</Button>
            </ButtonGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Mixed Elements</h3>
            <ButtonGroup>
              <Button variant="outline">Action</Button>
              <ButtonGroupText>or</ButtonGroupText>
              <Button variant="outline">Alternative</Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">
            Toggles, Switches & Checkboxes
          </CardTitle>
          <CardDescription>Toggle controls and states</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Switches</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="switch-on" defaultChecked />
                <Label htmlFor="switch-on">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-off" />
                <Label htmlFor="switch-off">Disabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-disabled" disabled />
                <Label
                  htmlFor="switch-disabled"
                  className="text-muted-foreground"
                >
                  Disabled State
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Checkboxes</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-checked" defaultChecked />
                <Label htmlFor="checkbox-checked">Checked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-unchecked" />
                <Label htmlFor="checkbox-unchecked">Unchecked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-disabled" disabled />
                <Label
                  htmlFor="checkbox-disabled"
                  className="text-muted-foreground"
                >
                  Disabled
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
