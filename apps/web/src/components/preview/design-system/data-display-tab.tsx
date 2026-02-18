"use client";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";

export function DataDisplayTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">List Items</CardTitle>
          <CardDescription>Item components for lists</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Basic Items</h3>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <ItemDescription>All your important documents</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">24 files</Badge>
                </ItemActions>
              </Item>

              <ItemSeparator />

              <Item>
                <ItemMedia variant="icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h3 className="text-base font-semibold">With Header & Footer</h3>
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
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
  );
}
