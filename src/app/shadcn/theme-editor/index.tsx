"use client";

import { Loader2Icon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useShadcnSelectedTheme } from "@/hooks/use-shadcn-selected-theme";

import { ShadcnVariables } from "@/db/schema";

import { useQueryClient } from "@tanstack/react-query";
import ColorPickerInput from "./color-picker-input";
import { type UpdateState, updateTheme } from "./update.action";
import { ThemeEditorWrapper } from "./wrapper";

const radiusValues = ["0", "0.3", "0.5", "0.75", "1.0"];

export function ThemeEditor() {
  const [radius, setRadius] = React.useState(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const element = document.querySelector("#shadcn-theme");
    if (!element) {
      return undefined;
    }
    return getComputedStyle(element).getPropertyValue("--radius");
  });

  const { data: selectedTheme } = useShadcnSelectedTheme();

  const [state, formAction, isPending] = React.useActionState(
    async (currentState: UpdateState, formData: FormData) => {
      const element = document.querySelector(
        "#shadcn-theme",
      ) as HTMLStyleElement;
      if (!element) {
        throw new Error("Element not found");
      }
      const styleSheet = element.sheet;
      if (!styleSheet) {
        throw new Error("Style sheet not found");
      }

      const rules = styleSheet.cssRules;

      for (const rule of rules) {
        if (!(rule instanceof CSSStyleRule)) continue;

        const theme =
          rule.selectorText === ":root"
            ? "light"
            : rule.selectorText === ".dark"
              ? "dark"
              : null;

        if (!theme) continue;

        const style = rule.style;
        for (const key of ShadcnVariables) {
          const value = style.getPropertyValue(`--color-${key}`);
          formData.set(`${theme}-${key}`, value);
        }
      }
      return await updateTheme(currentState, formData);
    },
    {
      success: false,
      errors: [],
    },
  );

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({
        queryKey: ["shadcn-theme", selectedTheme?.id],
      });
    }
  }, [state.success, queryClient, selectedTheme]);

  return (
    <ThemeEditorWrapper>
      <form action={formAction}>
        <input type="hidden" name="themeId" defaultValue={selectedTheme?.id} />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-2 pr-0.5">
            <div className="flex w-full items-center justify-between rounded-t-md bg-muted px-4 py-1.5">
              <h2 className="font-bold text-sm">Properties</h2>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-1 size-4 animate-spin" />
                )}
                Save
              </Button>
            </div>

            <div className="px-4 pb-3">
              <Label htmlFor="theme-name" className="text-xs">
                Theme Name
              </Label>
              <Input
                id="name"
                className="mt-1"
                defaultValue={
                  state.success ? state.form.name : selectedTheme?.name
                }
                name="name"
              />
            </div>

            <div className="px-4 pb-3">
              <Label className="text-xs">Radius (rem)</Label>
              <div className="mt-1 flex gap-2">
                {radiusValues.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      Number(radius) === Number(value) ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-1 px-0"
                    onClick={() => {
                      setRadius(value);
                      const styleSheet = document.querySelector(
                        "#shadcn-theme",
                      ) as HTMLStyleElement;
                      if (!styleSheet) {
                        return;
                      }
                      const rules = styleSheet.sheet?.cssRules;
                      if (!rules) {
                        return;
                      }
                      for (const rule of rules) {
                        if (
                          rule instanceof CSSStyleRule &&
                          rule.selectorText === ":root"
                        ) {
                          rule.style.setProperty("--radius", value);
                        }
                      }
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <input type="hidden" name="radius" defaultValue={radius} />
            </div>

            <div className="space-y-4">
              <h3 className="bg-muted px-4 py-2.5 font-semibold text-sm">
                Theme Colors
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-3">
                {ShadcnVariables.map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <Label className="text-xs">{key}</Label>
                    <ColorPickerInput themeColor={key} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </form>
    </ThemeEditorWrapper>
  );
}
