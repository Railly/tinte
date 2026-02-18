"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ComponentsTab() {
  const [demoTab, setDemoTab] = useState("tab1");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Buttons</CardTitle>
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
                <p className="text-xs text-muted-foreground">size="default"</p>
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
                  <p className="text-xs text-muted-foreground">Uses bg-muted</p>
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
          <CardDescription>Badge variants and status tags</CardDescription>
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
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
    </div>
  );
}
