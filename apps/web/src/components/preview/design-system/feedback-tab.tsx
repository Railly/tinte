"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

export function FeedbackTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Empty States</CardTitle>
          <CardDescription>Empty state components</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Basic Empty State</h3>
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </EmptyMedia>
                  <EmptyTitle>No files</EmptyTitle>
                  <EmptyDescription>Upload your first file</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button>Upload</Button>
                </EmptyContent>
              </Empty>

              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h3 className="text-base font-semibold">Loading Empty State</h3>
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
          <CardTitle className="text-base font-semibold">Alerts</CardTitle>
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
                <p className="text-xs text-green-600">Validation passed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
