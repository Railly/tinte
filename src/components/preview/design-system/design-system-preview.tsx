"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { DesignSystemOutput } from "@/lib/providers/design-system";
import { useThemeStore } from "@/stores/theme";
import { TypographySection } from "./typography-section";

interface DesignSystemPreviewProps {
  theme: DesignSystemOutput;
  className?: string;
}

export function DesignSystemPreview({
  theme,
  className,
}: DesignSystemPreviewProps) {
  const tinteTheme = useThemeStore((state) => state.tinteTheme);
  const currentMode = useThemeStore((state) => state.mode);
  const [demoTab, setDemoTab] = useState("tab1");

  const currentColors = tinteTheme?.[currentMode] || {
    bg: "#ffffff",
    bg_2: "#f8f9fa",
    ui: "#e9ecef",
    ui_2: "#dee2e6",
    ui_3: "#ced4da",
    tx: "#212529",
    tx_2: "#6c757d",
    tx_3: "#adb5bd",
    pr: "#007bff",
    sc: "#6c757d",
    ac_1: "#dc3545",
    ac_2: "#28a745",
    ac_3: "#ffc107",
  };

  return (
    <div className={`h-full font-sans ${className}`}>
      <div className="">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground text-sm">
            {theme.brand.description}
          </p>
        </div>

        <Tabs defaultValue="foundation" className="w-full">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="foundation"
              className="data-[state=active]:bg-muted"
            >
              Foundation
            </TabsTrigger>
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-muted"
            >
              Components
            </TabsTrigger>
            <TabsTrigger value="forms" className="data-[state=active]:bg-muted">
              Forms
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-muted">
              Data Display
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="data-[state=active]:bg-muted"
            >
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundation" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Typography
                </CardTitle>
                <CardDescription>
                  Font hierarchy and text styles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <TypographySection theme={theme} />

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Special Text</h3>
                  <Alert>
                    <AlertDescription>
                      This is a blockquote-style alert for quoted content.
                    </AlertDescription>
                  </Alert>
                  <Card
                    className="p-3"
                    style={{ backgroundColor: currentColors.bg_2 }}
                  >
                    <pre
                      className="text-sm font-mono"
                      style={{ color: currentColors.tx }}
                    >
                      {theme.typography.code.sample}
                    </pre>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Colors
                </CardTitle>
                <CardDescription>Color palette and variables</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Theme Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-lg overflow-hidden border">
                    {theme.colors.primary.colors.map((color, i) => (
                      <div
                        key={i}
                        className="aspect-video p-4 flex flex-col justify-end text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="space-y-0.5">
                          <div className="text-lg font-semibold">
                            {color.name}
                          </div>
                          <div className="text-xs opacity-90">
                            <div>HEX - {color.hex}</div>
                            <div>RGB - ({color.rgb})</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">CSS Variables</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      {
                        name: "Background",
                        class: "bg-background",
                        text: "text-foreground",
                      },
                      {
                        name: "Card",
                        class: "bg-card",
                        text: "text-card-foreground",
                      },
                      {
                        name: "Primary",
                        class: "bg-primary",
                        text: "text-primary-foreground",
                      },
                      {
                        name: "Secondary",
                        class: "bg-secondary",
                        text: "text-secondary-foreground",
                      },
                      {
                        name: "Muted",
                        class: "bg-muted",
                        text: "text-muted-foreground",
                      },
                      {
                        name: "Accent",
                        class: "bg-accent",
                        text: "text-accent-foreground",
                      },
                      {
                        name: "Destructive",
                        class: "bg-destructive",
                        text: "text-destructive-foreground",
                      },
                      {
                        name: "Border",
                        class: "bg-border",
                        text: "text-foreground",
                      },
                    ].map((color, i) => (
                      <Card key={i} className={`${color.class} ${color.text}`}>
                        <CardContent className="p-3 space-y-1">
                          <h4 className="font-medium text-sm">{color.name}</h4>
                          <p className="text-xs font-mono opacity-70">
                            {color.class}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Spacing
                </CardTitle>
                <CardDescription>
                  Padding, margin, and gap system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Padding</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "p-1", class: "p-1", size: "4px" },
                      { name: "p-2", class: "p-2", size: "8px" },
                      { name: "p-4", class: "p-4", size: "16px" },
                      { name: "p-6", class: "p-6", size: "24px" },
                    ].map((space, i) => (
                      <div key={i} className="space-y-1">
                        <div className="bg-muted rounded">
                          <div
                            className={`bg-primary text-primary-foreground rounded text-center text-xs ${space.class}`}
                          >
                            {space.name}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {space.size}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Gap</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: "gap-2", class: "gap-2", size: "8px" },
                      { name: "gap-4", class: "gap-4", size: "16px" },
                    ].map((space, i) => (
                      <div key={i} className="space-y-1">
                        <div className={`flex ${space.class}`}>
                          <div className="bg-primary text-primary-foreground p-2 rounded text-xs">
                            Item 1
                          </div>
                          <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
                            Item 2
                          </div>
                          <div className="bg-accent text-accent-foreground p-2 rounded text-xs">
                            Item 3
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {space.name} ({space.size})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Borders
                </CardTitle>
                <CardDescription>Border widths and radius</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Widths</h3>
                  <div className="space-y-2">
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="font-mono text-xs">border (1px)</div>
                      </CardContent>
                    </Card>
                    <Card className="border-2">
                      <CardContent className="p-3">
                        <div className="font-mono text-xs">border-2 (2px)</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Radius</h3>
                  <div className="space-y-2">
                    <Card className="rounded-sm border">
                      <CardContent className="p-3">
                        <div className="font-mono text-xs">rounded-sm</div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-lg border">
                      <CardContent className="p-3">
                        <div className="font-mono text-xs">rounded-lg</div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-full border">
                      <CardContent className="p-3">
                        <div className="font-mono text-xs text-center">
                          rounded-full
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Buttons
                </CardTitle>
                <CardDescription>Button variants and states</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Variants</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Button className="w-full">Default</Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="default"
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="destructive" className="w-full">
                        Destructive
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="destructive"
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="outline" className="w-full">
                        Outline
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="outline"
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="secondary" className="w-full">
                        Secondary
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="secondary"
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full">
                        Ghost
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="ghost"
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="link" className="w-full">
                        Link
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        variant="link"
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="space-y-1 text-center">
                      <Button size="sm">Small</Button>
                      <p className="text-xs text-muted-foreground">size="sm"</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <Button>Default</Button>
                      <p className="text-xs text-muted-foreground">
                        size="default"
                      </p>
                    </div>
                    <div className="space-y-1 text-center">
                      <Button size="lg">Large</Button>
                      <p className="text-xs text-muted-foreground">size="lg"</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">States</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button className="w-full">Normal</Button>
                    <Button className="w-full" disabled>
                      Disabled
                    </Button>
                    <Button className="w-full" variant="outline" disabled>
                      Disabled Outline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Cards</CardTitle>
                <CardDescription>Card layouts and variations</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Basic Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Simple Card</CardTitle>
                        <CardDescription className="text-xs">
                          Basic card with header
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">
                          Standard card styling
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Muted Card</CardTitle>
                        <CardDescription className="text-xs">
                          Card with muted background
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">
                          Uses bg-muted
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Interactive Cards</h3>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Hoverable Card</CardTitle>
                      <CardDescription className="text-xs">
                        Card with hover effects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm">Action</Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Badges & Tags
                </CardTitle>
                <CardDescription>
                  Badge variants and status tags
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Badge Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Status Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500 text-white">Active</Badge>
                    <Badge className="bg-yellow-500 text-black">Pending</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Tabs</CardTitle>
                <CardDescription>Tab navigation patterns</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Basic Tabs</h3>
                  <Tabs value={demoTab} onValueChange={setDemoTab}>
                    <TabsList>
                      <TabsTrigger value="tab1">Overview</TabsTrigger>
                      <TabsTrigger value="tab2">Analytics</TabsTrigger>
                      <TabsTrigger value="tab3">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Overview tab content
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="tab2" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Analytics tab content
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="tab3" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Settings tab content
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Full Width Tabs</h3>
                  <Tabs defaultValue="account">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                      <TabsTrigger value="notifications">
                        Notifications
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Account settings
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="password" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Password settings
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Notification preferences
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Inputs
                </CardTitle>
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
                      <Input
                        id="input-disabled"
                        placeholder="Disabled"
                        disabled
                      />
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
                <CardTitle className="text-base font-semibold">
                  Fields
                </CardTitle>
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
                        <FieldDescription>
                          Displayed on your profile
                        </FieldDescription>
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
                <CardTitle className="text-base font-semibold">
                  Input Groups
                </CardTitle>
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
          </TabsContent>

          <TabsContent value="data" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  List Items
                </CardTitle>
                <CardDescription>Item components for lists</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Basic Items</h3>
                  <ItemGroup>
                    <Item>
                      <ItemMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Documents</ItemTitle>
                        <ItemDescription>
                          All your important documents
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="secondary">24 files</Badge>
                      </ItemActions>
                    </Item>

                    <ItemSeparator />

                    <Item>
                      <ItemMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Images</ItemTitle>
                        <ItemDescription>Photos and graphics</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="secondary">156 files</Badge>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Item Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Outline</h4>
                      <ItemGroup>
                        <Item variant="outline">
                          <ItemContent>
                            <ItemTitle>Outlined Item</ItemTitle>
                            <ItemDescription>With border</ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Muted</h4>
                      <ItemGroup>
                        <Item variant="muted">
                          <ItemContent>
                            <ItemTitle>Muted Item</ItemTitle>
                            <ItemDescription>With background</ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">With Actions</h3>
                  <ItemGroup>
                    <Item variant="outline">
                      <ItemMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Team Members</ItemTitle>
                        <ItemDescription>Manage your team</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                        <Button size="sm">Manage</Button>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">
                    With Header & Footer
                  </h3>
                  <Item variant="outline">
                    <ItemHeader>
                      <ItemTitle>Project Alpha</ItemTitle>
                      <Badge variant="secondary">Active</Badge>
                    </ItemHeader>
                    <ItemContent>
                      <ItemDescription>
                        A comprehensive redesign with new features
                      </ItemDescription>
                    </ItemContent>
                    <ItemFooter>
                      <span className="text-xs text-muted-foreground">
                        Updated 2 hours ago
                      </span>
                      <ButtonGroup>
                        <Button size="sm" variant="ghost">
                          Share
                        </Button>
                        <Button size="sm">Open</Button>
                      </ButtonGroup>
                    </ItemFooter>
                  </Item>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Compact Size</h3>
                  <ItemGroup>
                    <Item size="sm" variant="outline">
                      <ItemMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Annual Report.pdf</ItemTitle>
                        <ItemDescription>2.4 MB</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Empty States
                </CardTitle>
                <CardDescription>Empty state components</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Basic Empty State</h3>
                  <Empty className="border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </EmptyMedia>
                      <EmptyTitle>No items found</EmptyTitle>
                      <EmptyDescription>
                        Get started by creating your first item
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button>Create Item</Button>
                    </EmptyContent>
                  </Empty>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Scenarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Empty className="border">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                        </EmptyMedia>
                        <EmptyTitle>No files</EmptyTitle>
                        <EmptyDescription>
                          Upload your first file
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button>Upload</Button>
                      </EmptyContent>
                    </Empty>

                    <Empty className="border">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </EmptyMedia>
                        <EmptyTitle>No messages</EmptyTitle>
                        <EmptyDescription>Your inbox is empty</EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button>Compose</Button>
                      </EmptyContent>
                    </Empty>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Multiple Actions</h3>
                  <Empty className="border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </EmptyMedia>
                      <EmptyTitle>No projects</EmptyTitle>
                      <EmptyDescription>
                        Create a new project or import one
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div className="flex flex-col gap-2 w-full">
                        <Button className="w-full">Create Project</Button>
                        <Button variant="outline" className="w-full">
                          Browse Templates
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Loading States
                </CardTitle>
                <CardDescription>Loading indicators</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Spinner</h3>
                  <div className="flex items-center gap-3">
                    <Spinner className="size-4" />
                    <Spinner className="size-6" />
                    <Spinner className="size-8" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">
                    Loading Empty State
                  </h3>
                  <Empty className="border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Spinner className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>Loading content...</EmptyTitle>
                      <EmptyDescription>
                        Please wait while we fetch your data
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Input Loading</h3>
                  <div className="relative">
                    <Input placeholder="Loading..." className="pr-10" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Spinner className="size-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">
                  Alerts
                </CardTitle>
                <CardDescription>Alert messages and states</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Basic Alert</h3>
                  <Alert>
                    <AlertDescription>
                      This is a standard alert message for information
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Error State</h3>
                  <Empty className="border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="text-destructive"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </EmptyMedia>
                      <EmptyTitle className="text-destructive">
                        Something went wrong
                      </EmptyTitle>
                      <EmptyDescription>
                        We encountered an error. Please try again.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <ButtonGroup>
                        <Button variant="outline">Go Back</Button>
                        <Button>Retry</Button>
                      </ButtonGroup>
                    </EmptyContent>
                  </Empty>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Input Validation</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-destructive">Error State</Label>
                      <Input
                        placeholder="Invalid input"
                        className="border-destructive focus-visible:ring-destructive"
                      />
                      <p className="text-xs text-destructive">
                        This field has an error
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-green-600">Success State</Label>
                      <Input
                        placeholder="Valid input"
                        className="border-green-500 focus-visible:ring-green-500"
                      />
                      <p className="text-xs text-green-600">
                        Validation passed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
