"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { DesignSystemOutput } from "@/lib/providers/design-system";
import { useThemeContext } from "@/providers/theme";

interface DesignSystemPreviewProps {
  theme: DesignSystemOutput;
  className?: string;
}

const CloverlySybmol = ({ className }: { className?: string }) => (
  <div
    className={`relative w-10 h-10 flex items-center justify-center ${className}`}
  >
    <div
      className="absolute w-4 h-4 bg-current rounded-sm rotate-45 transform-gpu"
      style={{ borderRadius: "2px 8px 2px 8px" }}
    />
    <div
      className="absolute w-3 h-3 bg-current rounded-sm -rotate-45 transform-gpu"
      style={{ borderRadius: "8px 2px 8px 2px" }}
    />
  </div>
);

export function DesignSystemPreview({
  theme,
  className,
}: DesignSystemPreviewProps) {
  const { mode } = useThemeContext();
  const [demoTab, setDemoTab] = useState("tab1");

  // Fallback to a default theme if currentTheme is not loaded yet
  const defaultTheme = {
    light: {
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
    },
    dark: {
      bg: "#212529",
      bg_2: "#343a40",
      ui: "#495057",
      ui_2: "#6c757d",
      ui_3: "#adb5bd",
      tx: "#f8f9fa",
      tx_2: "#e9ecef",
      tx_3: "#ced4da",
      pr: "#0d6efd",
      sc: "#6c757d",
      ac_1: "#dc3545",
      ac_2: "#198754",
      ac_3: "#ffc107",
    },
  };

  const safeTheme = defaultTheme;
  const currentColors = mode === "dark" ? safeTheme.dark : safeTheme.light;

  return (
    <div className={`h-full ${className}`}>
      <ScrollArea className="h-full" showScrollIndicators>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Design System</h1>
            <p className="text-muted-foreground text-lg">
              {theme.brand.description}
            </p>
          </div>

          <Tabs defaultValue="typography" className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
              <TabsTrigger value="borders">Borders</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="toggles">Toggles</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="tabs">Tabs</TabsTrigger>
            </TabsList>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Headings</CardTitle>
                  <CardDescription>
                    Font hierarchy and sizing system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theme.typography.heading.sizes.map((heading, i) => (
                    <div key={i} className="space-y-2">
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: heading.size,
                          fontFamily: theme.typography.heading.family,
                        }}
                      >
                        {heading.sample}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {heading.usage}
                      </p>
                      <Separator />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Text Variants</CardTitle>
                  <CardDescription>Body text styles and usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theme.typography.body.variants.map((variant, i) => (
                    <div key={i} className="space-y-2">
                      <div
                        style={{
                          fontSize: variant.size,
                          fontFamily: theme.typography.body.family,
                        }}
                      >
                        {variant.sample}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {variant.usage}
                      </p>
                      <Separator />
                    </div>
                  ))}

                  <Alert>
                    <AlertDescription>
                      "This is a blockquote-style alert. It's styled to
                      distinguish quoted content from regular text."
                    </AlertDescription>
                  </Alert>

                  <Card
                    className="p-4"
                    style={{ backgroundColor: currentColors.bg_2 }}
                  >
                    <pre
                      className="text-sm font-mono"
                      style={{ color: currentColors.tx }}
                    >
                      {theme.typography.code.sample}
                    </pre>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-8">
              {/* CSS Variables Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle>CSS Color Variables</CardTitle>
                  <CardDescription>
                    Real shadcn/ui color system variables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      {
                        name: "Input",
                        class: "bg-input",
                        text: "text-foreground",
                      },
                      {
                        name: "Ring",
                        class: "bg-ring",
                        text: "text-foreground",
                      },
                    ].map((color, i) => (
                      <Card key={i} className={`${color.class} ${color.text}`}>
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-medium">{color.name}</h4>
                          <p className="text-xs font-mono opacity-70">
                            {color.class}
                          </p>
                          <p className="text-xs font-mono opacity-70">
                            {color.text}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Primary Colors Grid */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Color Palette</CardTitle>
                  <CardDescription>Current theme color values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-lg overflow-hidden border">
                    {theme.colors.primary.colors.map((color, i) => (
                      <div
                        key={i}
                        className="aspect-video p-6 flex flex-col justify-end text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="space-y-1">
                          <div className="text-xl font-semibold">
                            {color.name}
                          </div>
                          <div className="text-sm opacity-90">
                            <div>HEX - {color.hex}</div>
                            <div>RGB - ({color.rgb})</div>
                            <div>CMYK - ({color.cmyk})</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Text Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Text Colors</CardTitle>
                  <CardDescription>Typography color hierarchy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-foreground text-lg font-medium">
                      Primary text (text-foreground)
                    </p>
                    <p className="text-muted-foreground">
                      Muted text (text-muted-foreground)
                    </p>
                    <p className="text-primary">
                      Primary colored text (text-primary)
                    </p>
                    <p className="text-secondary-foreground">
                      Secondary text (text-secondary-foreground)
                    </p>
                    <p className="text-destructive">
                      Destructive text (text-destructive)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Buttons Tab */}
            <TabsContent value="buttons" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>
                    All shadcn/ui button variants and sizes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Button Variants */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Variants</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <Button className="w-full">Default</Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="default"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="destructive" className="w-full">
                          Destructive
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="destructive"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Outline
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="outline"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="secondary" className="w-full">
                          Secondary
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="secondary"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full">
                          Ghost
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="ghost"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="link" className="w-full">
                          Link
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          variant="link"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Button Sizes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sizes</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="space-y-2 text-center">
                        <Button size="sm">Small</Button>
                        <p className="text-xs text-muted-foreground">
                          size="sm"
                        </p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button>Default</Button>
                        <p className="text-xs text-muted-foreground">
                          size="default"
                        </p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button size="lg">Large</Button>
                        <p className="text-xs text-muted-foreground">
                          size="lg"
                        </p>
                      </div>
                      <div className="space-y-2 text-center">
                        <Button size="icon" className="w-10 h-10">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12l-4-4h8l-4 4z" />
                          </svg>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          size="icon"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Button States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">States</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Button className="w-full">Normal</Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Normal state
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Disabled
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          disabled
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline" disabled>
                          Disabled Outline
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          outline + disabled
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          variant="destructive"
                          disabled
                        >
                          Disabled Destructive
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          destructive + disabled
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inputs Tab */}
            <TabsContent value="inputs" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Input Components</CardTitle>
                  <CardDescription>
                    Form controls and input variations using shadcn/ui
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Inputs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Text Inputs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="input-default">Default Input</Label>
                          <Input
                            id="input-default"
                            placeholder="Enter text..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="input-disabled">Disabled Input</Label>
                          <Input
                            id="input-disabled"
                            placeholder="Disabled input"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="input-readonly">Readonly Input</Label>
                          <Input
                            id="input-readonly"
                            value="Read only value"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
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
                            placeholder="Enter password..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="input-number">Number Input</Label>
                          <Input
                            id="input-number"
                            type="number"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Input States</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="input-normal">Normal State</Label>
                          <Input id="input-normal" placeholder="Normal input" />
                          <p className="text-xs text-muted-foreground">
                            Standard input styling
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="input-focus" className="text-primary">
                            Focus State
                          </Label>
                          <Input
                            id="input-focus"
                            placeholder="Focused input"
                            className="ring-2 ring-ring ring-offset-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            Input with focus ring
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="input-error"
                            className="text-destructive"
                          >
                            Error State
                          </Label>
                          <Input
                            id="input-error"
                            placeholder="Invalid input"
                            className="border-destructive focus-visible:ring-destructive"
                          />
                          <p className="text-xs text-destructive">
                            This field has an error
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="input-success"
                            className="text-green-600"
                          >
                            Success State
                          </Label>
                          <Input
                            id="input-success"
                            placeholder="Valid input"
                            className="border-green-500 focus-visible:ring-green-500"
                          />
                          <p className="text-xs text-green-600">
                            Input validation passed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Controls */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Form Controls</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="select-basic">Select Dropdown</Label>
                          <Select>
                            <SelectTrigger id="select-basic">
                              <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="option1">
                                First Option
                              </SelectItem>
                              <SelectItem value="option2">
                                Second Option
                              </SelectItem>
                              <SelectItem value="option3">
                                Third Option
                              </SelectItem>
                              <SelectItem value="option4" disabled>
                                Disabled Option
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textarea-basic">Textarea</Label>
                          <Textarea
                            id="textarea-basic"
                            placeholder="Enter your message here..."
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="textarea-disabled">
                            Disabled Textarea
                          </Label>
                          <Textarea
                            id="textarea-disabled"
                            placeholder="This textarea is disabled"
                            disabled
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textarea-resize">
                            Resizable Textarea
                          </Label>
                          <Textarea
                            id="textarea-resize"
                            placeholder="You can resize this textarea"
                            className="resize-y"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Sizes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Input Sizes</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Small Input</Label>
                        <Input
                          placeholder="Small size input"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Default Input</Label>
                        <Input placeholder="Default size input" />
                      </div>
                      <div className="space-y-2">
                        <Label>Large Input</Label>
                        <Input
                          placeholder="Large size input"
                          className="h-12 text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Input with Icons/Buttons */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Input Variations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Input with Button</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Search..." className="flex-1" />
                            <Button type="submit">Search</Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>File Input</Label>
                          <Input
                            type="file"
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Input Group</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-muted border border-r-0 border-input rounded-l-md">
                              https://
                            </span>
                            <Input
                              placeholder="example.com"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Range Input</Label>
                          <Input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="50"
                            className="accent-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cards Tab */}
            <TabsContent value="cards" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Card Components</CardTitle>
                  <CardDescription>
                    Different card layouts and content examples
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Cards */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Simple Card</CardTitle>
                          <CardDescription>
                            Basic card with header and content
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            This is a simple card component with standard
                            styling.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted">
                        <CardHeader>
                          <CardTitle>Muted Card</CardTitle>
                          <CardDescription>
                            Card with muted background
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            This card uses bg-muted for subtle differentiation.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary">
                        <CardHeader>
                          <CardTitle className="text-primary">
                            Primary Border
                          </CardTitle>
                          <CardDescription>
                            Card with primary border accent
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            This card has a primary colored border.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Interactive Cards */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interactive Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle>Hoverable Card</CardTitle>
                          <CardDescription>
                            Card with hover effects
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            This card responds to hover with shadow effects.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm">Primary Action</Button>
                            <Button variant="outline" size="sm">
                              Secondary
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-accent">
                        <CardHeader>
                          <CardTitle className="text-accent-foreground">
                            Accent Card
                          </CardTitle>
                          <CardDescription className="text-accent-foreground/70">
                            Card with accent background
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-accent-foreground/80 mb-4">
                            This card uses the accent color system.
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-background text-foreground"
                          >
                            Action
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing System</CardTitle>
                  <CardDescription>
                    Consistent spacing scale using Tailwind classes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Padding Examples */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Padding Examples</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "p-1", class: "p-1", size: "4px" },
                        { name: "p-2", class: "p-2", size: "8px" },
                        { name: "p-4", class: "p-4", size: "16px" },
                        { name: "p-6", class: "p-6", size: "24px" },
                      ].map((space, i) => (
                        <div key={i} className="space-y-2">
                          <div className="bg-muted rounded">
                            <div
                              className={`bg-primary text-primary-foreground rounded text-center text-sm ${space.class}`}
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

                  {/* Margin Examples */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Margin Examples</h3>
                    <div className="bg-muted p-4 rounded space-y-4">
                      {[
                        { name: "m-2", class: "m-2", size: "8px" },
                        { name: "m-4", class: "m-4", size: "16px" },
                        { name: "m-6", class: "m-6", size: "24px" },
                        { name: "m-8", class: "m-8", size: "32px" },
                      ].map((space, i) => (
                        <div key={i} className="bg-background rounded p-2">
                          <div
                            className={`bg-primary text-primary-foreground rounded text-center text-sm p-2 ${space.class}`}
                          >
                            {space.name} ({space.size})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gap Examples */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Gap Examples</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: "gap-2", class: "gap-2", size: "8px" },
                        { name: "gap-4", class: "gap-4", size: "16px" },
                        { name: "gap-6", class: "gap-6", size: "24px" },
                        { name: "gap-8", class: "gap-8", size: "32px" },
                      ].map((space, i) => (
                        <div key={i} className="space-y-2">
                          <div className={`flex ${space.class}`}>
                            <div className="bg-primary text-primary-foreground p-2 rounded text-sm">
                              Item 1
                            </div>
                            <div className="bg-secondary text-secondary-foreground p-2 rounded text-sm">
                              Item 2
                            </div>
                            <div className="bg-accent text-accent-foreground p-2 rounded text-sm">
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
            </TabsContent>

            {/* Borders Tab */}
            <TabsContent value="borders" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Border Widths</CardTitle>
                    <CardDescription>
                      Different border thicknesses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="border">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">border (1px)</div>
                      </CardContent>
                    </Card>
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">border-2 (2px)</div>
                      </CardContent>
                    </Card>
                    <Card className="border-4">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">border-4 (4px)</div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Border Radius</CardTitle>
                    <CardDescription>
                      Different corner roundness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="rounded-none border">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">rounded-none</div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-sm border">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">rounded-sm</div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-lg border">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm">rounded-lg</div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-full border">
                      <CardContent className="p-4">
                        <div className="font-mono text-sm text-center">
                          rounded-full
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="space-y-8">
              {/* Shadows Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Shadows & Elevation</CardTitle>
                  <CardDescription>
                    Shadow system for depth and hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="shadow-none border">
                      <CardHeader>
                        <CardTitle className="text-base">No Shadow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-none
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Flat design with border only
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Small Shadow
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-sm
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Subtle depth for cards
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Medium Shadow
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-md
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Standard elevation
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Large Shadow
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-lg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          High elevation for modals
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-base">Extra Large</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-xl
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Maximum elevation
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-base">2XL Shadow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          shadow-2xl
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dramatic depth
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Gradients Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Gradient Effects</CardTitle>
                  <CardDescription>
                    Diverse gradient patterns using theme colors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Linear Gradients */}
                    <Card className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Primary Fade
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Horizontal fade to transparent
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-br from-primary via-accent to-secondary" />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Triple Blend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Three-color diagonal blend
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-b from-muted/50 via-muted to-accent/80" />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Subtle Depth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Soft vertical progression
                        </p>
                      </CardContent>
                    </Card>

                    {/* Radial Gradients */}
                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `radial-gradient(ellipse 100% 50% at top, var(--primary), transparent)`,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Top Spotlight
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Elliptical top-focused light
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `radial-gradient(circle, var(--accent), var(--muted), var(--background))`,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Central Glow
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Multi-ring radial effect
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `conic-gradient(from 45deg, var(--primary), var(--destructive), var(--accent), var(--secondary), var(--primary))`,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">Color Wheel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Off-center conic spectrum
                        </p>
                      </CardContent>
                    </Card>

                    {/* Complex Patterns */}
                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `repeating-linear-gradient(45deg, var(--muted) 0px, var(--muted) 8px, var(--accent) 8px, var(--accent) 16px)`,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Diagonal Stripes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Repeating stripe pattern
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `
                            linear-gradient(45deg, var(--primary) 25%, transparent 25%),
                            linear-gradient(-45deg, var(--accent) 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, var(--secondary) 75%),
                            linear-gradient(-45deg, transparent 75%, var(--muted) 75%)
                          `,
                          backgroundSize: "16px 16px",
                          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">Geometric</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Complex layered pattern
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div
                        className="h-24"
                        style={{
                          background: `
                            radial-gradient(circle at 20% 80%, var(--primary) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, var(--secondary) 0%, transparent 50%),
                            var(--background)
                          `,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Bubble Blend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Multiple overlapping circles
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Blur & Filter Effects */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter & Transform Effects</CardTitle>
                  <CardDescription>
                    Advanced visual filters and transformations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Backdrop Blur Variations */}
                    <Card className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-accent/40 to-secondary/50" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/20 to-accent/30" />
                      <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format"
                        alt="Mountain landscape"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className="relative backdrop-blur-sm bg-background/70 border border-white/20 p-4 m-2 rounded-lg">
                        <CardTitle className="text-sm mb-1">
                          Light Glass
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          backdrop-blur-sm + border
                        </p>
                      </div>
                    </Card>

                    <Card className="relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format"
                        alt="Abstract colors"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative backdrop-blur-md bg-card/40 border border-primary/30 p-4 m-2 rounded-xl shadow-lg">
                        <CardTitle className="text-sm mb-1">
                          Heavy Glass
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          backdrop-blur-md + shadow
                        </p>
                      </div>
                    </Card>

                    <Card className="relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop&auto=format"
                        alt="Gradient mesh"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative backdrop-blur-lg bg-background/90 p-4 m-2 rounded-lg backdrop-saturate-150">
                        <CardTitle className="text-sm mb-1">
                          Frosted Glass
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          blur-lg + saturate
                        </p>
                      </div>
                    </Card>

                    {/* Color Filters */}
                    <Card className="overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format"
                        alt="Colorful abstract"
                        className="h-24 w-full object-cover saturate-150 contrast-125"
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          High Saturation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          saturate-150 + contrast-125
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&auto=format"
                        alt="Vibrant colors"
                        className="h-24 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Grayscale Hover
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          grayscale + hover transition
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop&auto=format"
                        alt="Nature scene"
                        className="h-24 w-full object-cover sepia-0 hover:sepia transition-all duration-300"
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Sepia Effect
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          sepia filter on hover
                        </p>
                      </CardContent>
                    </Card>

                    {/* Transform Effects */}
                    <Card className="overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&h=300&fit=crop&auto=format"
                        alt="Geometric shapes"
                        className="h-24 w-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Scale Transform
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          hover:scale-110
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format"
                        alt="Abstract patterns"
                        className="h-24 w-full object-cover hover:rotate-3 hover:skew-x-3 transition-transform duration-500"
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Skew & Rotate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          rotate + skew transforms
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden perspective-1000">
                      <img
                        src="https://images.unsplash.com/photo-1506729623306-b5a934d88b53?w=400&h=300&fit=crop&auto=format"
                        alt="3D perspective"
                        className="h-24 w-full object-cover hover:rotate-y-12 transition-transform duration-700 transform-gpu"
                        style={{ transformStyle: "preserve-3d" }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">3D Rotate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          3D perspective rotation
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Animated Effects */}
              <Card>
                <CardHeader>
                  <CardTitle>Animated Effects</CardTitle>
                  <CardDescription>
                    CSS animations with theme colors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="overflow-hidden">
                      <div
                        className="h-24 animate-pulse"
                        style={{
                          background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.3), hsl(var(--primary)))`,
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Pulse Effect
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          animate-pulse
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div className="h-24 animate-bounce bg-gradient-to-r from-accent to-secondary" />
                      <CardHeader>
                        <CardTitle className="text-base">
                          Bounce Effect
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          animate-bounce
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <div
                        className="h-24 animate-spin bg-gradient-to-r from-primary via-accent to-secondary"
                        style={{ borderRadius: "50%" }}
                      />
                      <CardHeader>
                        <CardTitle className="text-base">Spin Effect</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          animate-spin
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* States Tab */}
            <TabsContent value="states" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive States</CardTitle>
                  <CardDescription>
                    Component states using real shadcn/ui interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Button States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Button States</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Button className="w-full">Default</Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Normal state
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full hover:bg-primary/90">
                          Hover
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          hover:bg-primary/90
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full active:scale-95">
                          Active
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          active:scale-95
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Disabled
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          disabled
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Input States</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Default State</Label>
                          <Input placeholder="Default input" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-primary">Focus State</Label>
                          <Input
                            placeholder="Focus state"
                            className="ring-2 ring-ring ring-offset-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-destructive">
                            Error State
                          </Label>
                          <Input
                            placeholder="Error state"
                            className="border-destructive focus-visible:ring-destructive"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-green-600">
                            Success State
                          </Label>
                          <Input
                            placeholder="Success state"
                            className="border-green-500 focus-visible:ring-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Disabled State</Label>
                          <Input placeholder="Disabled input" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Loading State</Label>
                          <div className="relative">
                            <Input placeholder="Loading..." className="pr-10" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Card States</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Default Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Standard card styling
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle>Hoverable Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            hover:shadow-lg transition-shadow
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-primary">
                            Selected Card
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            border-primary bg-primary/5
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Badge States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Badge States</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge className="hover:bg-primary/80 cursor-pointer">
                        Hoverable
                      </Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge className="opacity-50 pointer-events-none">
                        Disabled
                      </Badge>
                    </div>
                  </div>

                  {/* Toggle States */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Toggle States</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Switch States</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="switch-off" />
                            <Label htmlFor="switch-off">Off State</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="switch-on" defaultChecked />
                            <Label htmlFor="switch-on">On State</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="switch-disabled" disabled />
                            <Label
                              htmlFor="switch-disabled"
                              className="text-muted-foreground"
                            >
                              Disabled
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Checkbox States</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="checkbox-unchecked" />
                            <Label htmlFor="checkbox-unchecked">
                              Unchecked
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="checkbox-checked" defaultChecked />
                            <Label htmlFor="checkbox-checked">Checked</Label>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Toggles Tab */}
            <TabsContent value="toggles" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Switches</CardTitle>
                    <CardDescription>Toggle switches</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="switch-1" defaultChecked />
                      <Label htmlFor="switch-1">Enabled</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="switch-2" />
                      <Label htmlFor="switch-2">Disabled</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Checkboxes</CardTitle>
                    <CardDescription>Checkbox controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="checkbox-1" defaultChecked />
                      <Label htmlFor="checkbox-1">Checked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="checkbox-2" />
                      <Label htmlFor="checkbox-2">Unchecked</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Components</CardTitle>
                  <CardDescription>
                    Various badge and tag styles using shadcn/ui variants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Badge Variants</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground space-y-1">
                      <div>
                        variant="default" | variant="secondary" |
                        variant="destructive" | variant="outline"
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Status Examples</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-500 text-white">Active</Badge>
                      <Badge className="bg-yellow-500 text-black">
                        Pending
                      </Badge>
                      <Badge variant="destructive">Error</Badge>
                      <Badge variant="outline">Draft</Badge>
                      <Badge className="bg-blue-500 text-white">
                        In Progress
                      </Badge>
                      <Badge className="bg-purple-500 text-white">Review</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Category Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Design",
                        "Development",
                        "Marketing",
                        "Sales",
                        "Support",
                      ].map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interactive Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="cursor-pointer hover:bg-primary/80">
                        Clickable
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                      >
                        Hoverable
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        Interactive
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tabs Tab */}
            <TabsContent value="tabs" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tab Navigation</CardTitle>
                  <CardDescription>
                    Real shadcn/ui tab component variations and layouts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Tabs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Tabs</h3>
                    <Tabs value={demoTab} onValueChange={setDemoTab}>
                      <TabsList>
                        <TabsTrigger value="tab1">Overview</TabsTrigger>
                        <TabsTrigger value="tab2">Analytics</TabsTrigger>
                        <TabsTrigger value="tab3">Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>
                              General information and summary
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              This is the overview tab content. It shows a
                              general summary of the information.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="tab2" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>
                              Detailed metrics and statistics
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Analytics content with detailed metrics, charts,
                              and performance data would be displayed here.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="tab3" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>
                              Configuration options
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Settings and configuration options for customizing
                              the application behavior.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Full Width Tabs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Full Width Tabs</h3>
                    <Tabs defaultValue="account">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="notifications">
                          Notifications
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="account" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                              Manage your account information
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                              />
                            </div>
                            <Button>Save Changes</Button>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="password" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Password Settings</CardTitle>
                            <CardDescription>
                              Change your password
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current">Current Password</Label>
                              <Input id="current" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new">New Password</Label>
                              <Input id="new" type="password" />
                            </div>
                            <Button>Update Password</Button>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="notifications" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                              Configure how you receive notifications
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Switch id="email-notifications" />
                              <Label htmlFor="email-notifications">
                                Email notifications
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="push-notifications" defaultChecked />
                              <Label htmlFor="push-notifications">
                                Push notifications
                              </Label>
                            </div>
                            <Button>Save Preferences</Button>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Vertical Tabs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Custom Tab Layouts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pill Style Tabs */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Pill Style</h4>
                        <Tabs defaultValue="profile">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                              value="profile"
                              className="rounded-full"
                            >
                              Profile
                            </TabsTrigger>
                            <TabsTrigger
                              value="billing"
                              className="rounded-full"
                            >
                              Billing
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="profile" className="mt-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Profile information and settings
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="billing" className="mt-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Billing and subscription details
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Compact Tabs */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Compact Size</h4>
                        <Tabs defaultValue="dashboard">
                          <TabsList className="h-8">
                            <TabsTrigger
                              value="dashboard"
                              className="text-xs h-6"
                            >
                              Dashboard
                            </TabsTrigger>
                            <TabsTrigger
                              value="reports"
                              className="text-xs h-6"
                            >
                              Reports
                            </TabsTrigger>
                            <TabsTrigger value="users" className="text-xs h-6">
                              Users
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="dashboard" className="mt-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Dashboard overview
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="reports" className="mt-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Reports and analytics
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="users" className="mt-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                User management
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </div>

                  {/* Tab with Badges */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tabs with Badges</h3>
                    <Tabs defaultValue="inbox">
                      <TabsList>
                        <TabsTrigger value="inbox" className="gap-2">
                          Inbox
                          <Badge variant="destructive" className="text-xs">
                            5
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="sent" className="gap-2">
                          Sent
                          <Badge variant="secondary" className="text-xs">
                            12
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="drafts">Drafts</TabsTrigger>
                      </TabsList>
                      <TabsContent value="inbox" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-muted-foreground">
                              You have 5 new messages in your inbox.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="sent" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-muted-foreground">
                              12 messages have been sent.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="drafts" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-muted-foreground">
                              No draft messages.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
